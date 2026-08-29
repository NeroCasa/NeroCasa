#!/usr/bin/env node
/**
 * Rename catalog products to Italian display titles in Shopify admin.
 * Usage: node scripts/rename-catalog-titles.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || process.env.SHOPIFY_FLAG_STORE || process.env.SHOPIFY_STORE;
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';
const SCOPES = 'write_products,read_products';

const TITLES = {
  'cft-1': 'Soglia',
  'cft-2': 'Equilibrio',
  'cft-3': 'Monolite',
  'cs-1': 'Galleria',
  'cs-2': 'Passaggio',
  'cs-3': 'Atrio',
  'sd-1': 'Nodo',
  'sd-2': 'Punto',
  'sd-3': 'Scalino',
};

if (!store) {
  console.error('\nUsage: node scripts/rename-catalog-titles.mjs <store>.myshopify.com\n');
  process.exit(1);
}

function runShopify(args, { parseJson = true } = {}) {
  const finalArgs = parseJson ? [...args, '--json'] : args;
  const out = execFileSync(shopifyCmd, finalArgs, {
    encoding: 'utf8',
    shell: isWin,
  });
  return parseJson ? JSON.parse(out) : out;
}

function ensureAuth() {
  console.log(`→ Authenticating with ${store} ...`);
  runShopify(['store', 'auth', '--store', store, '--scopes', SCOPES], { parseJson: false });
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-rename-'));
  const queryFile = join(dir, 'query.graphql');
  writeFileSync(queryFile, query, 'utf8');
  const args = ['store', 'execute', '--store', store, '--query-file', queryFile];
  if (variables) {
    const variablesFile = join(dir, 'variables.json');
    writeFileSync(variablesFile, JSON.stringify(variables), 'utf8');
    args.push('--variable-file', variablesFile);
  }
  if (allowMutations) args.push('--allow-mutations');
  try {
    return runShopify(args);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

console.log(`Renaming catalog products on ${store} ...\n`);
ensureAuth();

const products = execute(`query { products(first: 50) { nodes { id handle title } } }`).products.nodes.filter(
  (p) => TITLES[p.handle],
);

const mutation = `mutation Rename($input: ProductInput!) {
  productUpdate(input: $input) {
    product { handle title }
    userErrors { message }
  }
}`;

for (const product of products) {
  const title = TITLES[product.handle];
  if (product.title === title) {
    console.log(`  ✓ ${product.handle} already "${title}"`);
    continue;
  }
  const result = execute(mutation, { input: { id: product.id, title } }, true);
  const errors = result.productUpdate?.userErrors || [];
  if (errors.length) {
    console.log(`  ✗ ${product.handle}: ${errors.map((e) => e.message).join('; ')}`);
    continue;
  }
  console.log(`  + ${product.handle}: "${product.title}" → "${title}"`);
}

console.log('\nDone.');
