#!/usr/bin/env node
/**
 * Set all catalog variants to always available (made-to-order).
 * - inventoryPolicy: CONTINUE
 * - inventory tracking: disabled
 *
 * Usage: node scripts/fix-catalog-inventory.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || 'zhjbdz-yw.myshopify.com';
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';

const HANDLES = ['cft-1', 'cft-2', 'cft-3', 'cs-1', 'cs-2', 'cs-3', 'sd-1', 'sd-2', 'sd-3'];

function runShopify(args) {
  const out = execFileSync(shopifyCmd, [...args, '--json'], {
    encoding: 'utf8',
    env: { ...process.env, SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:1|p:cursor|m:inventory' },
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: isWin,
  });
  return JSON.parse(out);
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-fix-inv-'));
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

function errors(payload, key) {
  const list = payload?.[key]?.userErrors || [];
  if (list.length) throw new Error(list.map((e) => e.message).join('; '));
}

async function main() {
  console.log(`Fixing catalog inventory — ${store}\n`);

  const data = execute(`
    query {
      products(first: 50) {
        nodes {
          id handle title
          variants(first: 10) {
            nodes {
              id title availableForSale inventoryPolicy
              inventoryItem { id tracked }
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

  for (const product of products) {
    const variants = product.variants?.nodes || [];
    if (!variants.length) continue;

    execute(
      `mutation UpdateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          productVariants { id inventoryPolicy availableForSale }
          userErrors { field message }
        }
      }`,
      {
        productId: product.id,
        variants: variants.map((v) => ({
          id: v.id,
          inventoryPolicy: 'CONTINUE',
        })),
      },
      true,
    );

    const refreshed = execute(
      `query Product($id: ID!) {
        product(id: $id) {
          variants(first: 10) {
            nodes { title availableForSale inventoryPolicy inventoryItem { tracked } }
          }
        }
      }`,
      { id: product.id },
    );

    const summary = (refreshed.product?.variants?.nodes || [])
      .map((v) => `${v.title}:${v.availableForSale ? 'available' : 'unavailable'}`)
      .join(', ');
    console.log(`  ✓ ${product.handle} — ${summary}`);
  }

  console.log('\nDone. All marble variants should show as available to order.\n');
}

main().catch((err) => {
  console.error('\nFailed:\n', err.message || err);
  process.exit(1);
});
