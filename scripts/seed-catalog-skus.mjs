#!/usr/bin/env node
/**
 * Assign NC-{CAT}-{DES}-{MAR} SKUs to all catalog marble variants.
 * Usage: node scripts/seed-catalog-skus.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || 'zhjbdz-yw.myshopify.com';
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';

const DESIGN = {
  'cft-1': 'SOG',
  'cft-2': 'EQU',
  'cft-3': 'MON',
  'cs-1': 'GAL',
  'cs-2': 'PAS',
  'cs-3': 'ATR',
  'sd-1': 'NOD',
  'sd-2': 'PUN',
  'sd-3': 'SCA',
};

const MARBLE = {
  'Ibiza White': 'IBW',
  'Armani Grey': 'AGY',
  Travertine: 'TRV',
  'Rosso Levanto': 'RLV',
};

const HANDLES = Object.keys(DESIGN);

function categoryFromHandle(handle) {
  if (handle.startsWith('cft-')) return 'CFT';
  if (handle.startsWith('cs-')) return 'CS';
  if (handle.startsWith('sd-')) return 'SD';
  return 'NC';
}

function skuFor(handle, marble) {
  const cat = categoryFromHandle(handle);
  const des = DESIGN[handle];
  const mar = MARBLE[marble];
  if (!des || !mar) return null;
  return `NC-${cat}-${des}-${mar}`;
}

function runShopify(args) {
  const out = execFileSync(shopifyCmd, [...args, '--json'], {
    encoding: 'utf8',
    env: { ...process.env, SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:1|p:cursor|m:skus' },
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: isWin,
  });
  return JSON.parse(out);
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-seed-skus-'));
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

function marbleFromVariant(variant) {
  const fromOption = variant.selectedOptions?.find((o) => o.name === 'Marble')?.value;
  if (fromOption) return fromOption;
  return variant.title;
}

async function main() {
  console.log(`Seeding catalog SKUs — ${store}\n`);

  const data = execute(`
    query {
      products(first: 50) {
        nodes {
          id handle title
          variants(first: 10) {
            nodes {
              id title sku
              selectedOptions { name value }
            }
          }
        }
      }
    }
  `);

  const products = (data.products?.nodes || []).filter((p) => HANDLES.includes(p.handle));
  if (!products.length) {
    console.error('No catalog products found.');
    process.exit(1);
  }

  let updated = 0;

  for (const product of products) {
    const variants = product.variants?.nodes || [];
    const updates = [];

    for (const variant of variants) {
      const marble = marbleFromVariant(variant);
      const sku = skuFor(product.handle, marble);
      if (!sku) {
        console.log(`  ! ${product.handle} / ${marble}: no SKU mapping — skip`);
        continue;
      }
      if (variant.sku === sku) {
        console.log(`  · ${product.handle} / ${marble}: ${sku} (already set)`);
        continue;
      }
      updates.push({ id: variant.id, inventoryItem: { sku } });
    }

    if (!updates.length) continue;

    const result = execute(
      `mutation UpdateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          productVariants { id title sku }
          userErrors { field message }
        }
      }`,
      { productId: product.id, variants: updates },
      true,
    );

    const errors = result.productVariantsBulkUpdate?.userErrors || [];
    if (errors.length) throw new Error(errors.map((e) => e.message).join('; '));

    for (const variant of result.productVariantsBulkUpdate.productVariants) {
      console.log(`  ✓ ${product.handle} / ${variant.title}: ${variant.sku}`);
      updated += 1;
    }
  }

  console.log(`\nDone. ${updated} variant SKU(s) updated.\n`);
}

main().catch((err) => {
  console.error('\nFailed:\n', err.message || err);
  process.exit(1);
});
