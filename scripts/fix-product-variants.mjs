#!/usr/bin/env node
/**
 * Fix catalog products: ensure 3 Marble variants each with correct prices.
 * Usage: node scripts/fix-product-variants.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || 'zhjbdz-yw.myshopify.com';
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';

const PRODUCTS = [
  { handle: 'cft-1', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [8500, 8800, 8200] },
  { handle: 'cft-2', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [9200, 9500, 8900] },
  { handle: 'cft-3', colors: ['Ibiza White', 'Travertine', 'Rosso Levanto'], prices: [9800, 9400, 11200] },
  { handle: 'cs-1', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [7200, 7500, 6900] },
  { handle: 'cs-2', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [7800, 8100, 7600] },
  { handle: 'cs-3', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [8400, 8700, 8200] },
  { handle: 'sd-1', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [4200, 4500, 3900] },
  { handle: 'sd-2', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [4600, 4900, 4300] },
  { handle: 'sd-3', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [5100, 5400, 4800] },
];

function q(s) { return s.replace(/\s+/g, ' ').trim(); }

function runShopify(args) {
  const out = execFileSync(shopifyCmd, [...args, '--json'], {
    encoding: 'utf8',
    env: { ...process.env, SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:1|p:cursor|m:variants' },
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: isWin,
  });
  return JSON.parse(out);
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-fix-variants-'));
  writeFileSync(join(dir, 'query.graphql'), query, 'utf8');
  const args = ['store', 'execute', '--store', store, '--query-file', join(dir, 'query.graphql')];
  if (variables) {
    writeFileSync(join(dir, 'variables.json'), JSON.stringify(variables), 'utf8');
    args.push('--variable-file', join(dir, 'variables.json'));
  }
  if (allowMutations) args.push('--allow-mutations');
  try {
    return runShopify(args);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function findUserErrors(payload, keys) {
  for (const key of keys) {
    const block = payload?.[key];
    if (block?.userErrors?.length) return block.userErrors;
  }
  return [];
}

function getProducts() {
  const data = execute(q(`
    query {
      products(first: 20) {
        nodes {
          id handle title
          options { id name values }
          variants(first: 20) {
            nodes { id title price selectedOptions { name value } }
          }
        }
      }
    }
  `));
  const map = new Map();
  for (const p of data.products?.nodes || []) map.set(p.handle, p);
  return map;
}

function createVariants(productId, colors, prices, existingColors) {
  const toCreate = colors
    .map((color, i) => ({ color, price: prices[i] }))
    .filter(({ color }) => !existingColors.has(color));

  if (!toCreate.length) return null;

  const data = execute(q(`
    mutation CreateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, variants: $variants) {
        productVariants { id title price selectedOptions { name value } }
        userErrors { field message }
      }
    }
  `), {
    productId,
    variants: toCreate.map(({ color, price }) => ({
      optionValues: [{ optionName: 'Marble', name: color }],
      price: String(price),
    })),
  }, true);
  const errors = findUserErrors(data, ['productVariantsBulkCreate']);
  if (errors.length) throw new Error(errors.map((e) => e.message).join('; '));
  return data.productVariantsBulkCreate.productVariants;
}

function fetchProduct(handle) {
  const data = execute(q(`
    query Product($handle: String!) {
      productByHandle(handle: $handle) {
        id handle title
        options { id name values }
        variants(first: 20) {
          nodes { id title price selectedOptions { name value } }
        }
      }
    }
  `), { handle });
  return data.productByHandle;
}

function updatePrices(productId, variants, colors, prices) {
  const updates = variants.map((variant) => {
    const color = variant.selectedOptions?.find((o) => o.name === 'Marble')?.value;
    const index = colors.indexOf(color);
    const price = index >= 0 ? String(prices[index]) : String(prices[0]);
    return { id: variant.id, price };
  });
  if (!updates.length) return;
  const data = execute(q(`
    mutation UpdateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants { id title price }
        userErrors { field message }
      }
    }
  `), { productId, variants: updates }, true);
  const errors = findUserErrors(data, ['productVariantsBulkUpdate']);
  if (errors.length) throw new Error(errors.map((e) => e.message).join('; '));
}

async function main() {
  console.log(`Fixing Marble variants — ${store}\n`);
  const productMap = getProducts();

  for (const spec of PRODUCTS) {
    let product = productMap.get(spec.handle) || fetchProduct(spec.handle);
    if (!product) {
      console.log(`  ! ${spec.handle} not found — skip`);
      continue;
    }

    const existingColors = new Set(
      product.variants.nodes.map((v) => v.selectedOptions.find((o) => o.name === 'Marble')?.value).filter(Boolean),
    );
    const missing = spec.colors.filter((c) => !existingColors.has(c));

    if (missing.length) {
      createVariants(product.id, spec.colors, spec.prices, existingColors);
      product = fetchProduct(spec.handle);
      console.log(`  + ${spec.handle}: created variants for ${missing.join(', ')}`);
    } else {
      console.log(`  ✓ ${spec.handle}: already has ${spec.colors.length} variants`);
    }

    updatePrices(product.id, product.variants.nodes, spec.colors, spec.prices);
    console.log(`    · prices set for ${product.variants.nodes.length} variants`);
  }

  console.log('\nDone. Each product now has 3 Marble color variants with prices.\n');
}

main().catch((err) => {
  console.error('\nFailed:\n', err.message || err);
  process.exit(1);
});
