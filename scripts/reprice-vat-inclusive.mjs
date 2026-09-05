#!/usr/bin/env node
/**
 * Re-price the catalog to round VAT-inclusive figures.
 *
 * The store runs with "All prices include tax" enabled, so the displayed price
 * already contains 5% UAE VAT and the net kept was price / 1.05. These figures
 * raise each variant to a round number whose net clears the previous sticker,
 * while preserving the interval structure within every range.
 *
 * Pass --dry-run to print the diff without writing.
 * Usage: node scripts/reprice-vat-inclusive.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const store = args.find((a) => !a.startsWith('--')) || process.env.SHOPIFY_FLAG_STORE;
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';
const VAT_RATE = 1.05;

if (!store) {
  console.error('\nUsage: node scripts/reprice-vat-inclusive.mjs <store>.myshopify.com [--dry-run]\n');
  process.exit(1);
}

const PRICES = {
  'cft-1': { 'Ibiza White': '5800', 'Armani Grey': '5500', Travertine: '5200' },
  'cft-2': { 'Ibiza White': '4000', 'Armani Grey': '3700', Travertine: '3400' },
  'cft-3': { 'Ibiza White': '5300', Travertine: '4900', 'Rosso Levanto': '8200' },
  'cs-1': { 'Ibiza White': '3900', 'Armani Grey': '3300', Travertine: '3100' },
  'cs-2': { 'Ibiza White': '4000', 'Armani Grey': '3600', Travertine: '3400' },
  'cs-3': { 'Ibiza White': '5300', 'Armani Grey': '4800', Travertine: '4500' },
  'sd-1': { 'Ibiza White': '520', 'Armani Grey': '460', Travertine: '425' },
  'sd-2': { 'Ibiza White': '500', 'Armani Grey': '440', Travertine: '410' },
  'sd-3': { 'Ibiza White': '540', 'Armani Grey': '510', Travertine: '460' },
};

function runShopify(args) {
  const out = execFileSync(shopifyCmd, [...args, '--json'], {
    encoding: 'utf8',
    env: { ...process.env, SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:1|p:cursor|m:reprice' },
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: isWin,
  });
  return JSON.parse(out);
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-price-'));
  const queryFile = join(dir, 'query.graphql');
  writeFileSync(queryFile, query, 'utf8');
  const a = ['store', 'execute', '--store', store, '--query-file', queryFile];
  if (variables) {
    writeFileSync(join(dir, 'variables.json'), JSON.stringify(variables), 'utf8');
    a.push('--variable-file', join(dir, 'variables.json'));
  }
  if (allowMutations) a.push('--allow-mutations');
  try {
    return runShopify(a);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const productQuery = `query Product($handle: String!) {
  productByHandle(handle: $handle) {
    id
    title
    variants(first: 20) { edges { node { id title price } } }
  }
}`;

const bulkUpdate = `mutation Reprice($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
  productVariantsBulkUpdate(productId: $productId, variants: $variants) {
    productVariants { id title price }
    userErrors { field message }
  }
}`;

const money = (n) => Number(n).toFixed(2);
console.log(`\nRe-pricing catalog on ${store}${dryRun ? ' (dry run)' : ''} ...\n`);

let changed = 0;
let skipped = 0;
const failures = [];

for (const [handle, wanted] of Object.entries(PRICES)) {
  const res = execute(productQuery, { handle });
  const product = res.productByHandle;
  if (!product) {
    failures.push(`${handle}: product not found`);
    continue;
  }

  const variants = product.variants.edges.map((e) => e.node);
  const updates = [];

  for (const [marble, price] of Object.entries(wanted)) {
    const variant = variants.find((v) => v.title === marble);
    if (!variant) {
      failures.push(`${handle} / ${marble}: variant not found`);
      continue;
    }
    if (Number(variant.price) === Number(price)) {
      console.log(`  = ${product.title} / ${marble} already ${money(price)}`);
      skipped += 1;
      continue;
    }
    const netBefore = Number(variant.price) / VAT_RATE;
    const netAfter = Number(price) / VAT_RATE;
    console.log(
      `  ${product.title} / ${marble}: ${money(variant.price)} -> ${money(price)}` +
        `   (net ${money(netBefore)} -> ${money(netAfter)})`,
    );
    updates.push({ id: variant.id, price: String(price) });
  }

  if (!updates.length || dryRun) continue;

  const out = execute(bulkUpdate, { productId: product.id, variants: updates }, true);
  const errors = out.productVariantsBulkUpdate?.userErrors || [];
  if (errors.length) {
    failures.push(`${handle}: ${errors.map((e) => e.message).join('; ')}`);
  } else {
    changed += out.productVariantsBulkUpdate.productVariants.length;
  }
}

console.log(
  `\n${dryRun ? 'Would update' : 'Updated'}: ${dryRun ? 27 - skipped : changed} variant(s). ` +
    `Already correct: ${skipped}.`,
);
if (failures.length) {
  console.log('\nFailures:');
  failures.forEach((f) => console.log(`  ! ${f}`));
  process.exit(1);
}
console.log(dryRun ? '\nDry run only. Re-run without --dry-run to apply.\n' : '\nDone.\n');
