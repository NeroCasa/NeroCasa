#!/usr/bin/env node
/**
 * Publish all NeroCasa catalog products to the Online Store sales channel.
 * Usage: node scripts/publish-catalog-products.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || process.env.SHOPIFY_FLAG_STORE || process.env.SHOPIFY_STORE;
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';
const SCOPES = 'write_products,read_products,write_publications,read_publications';

const HANDLES = ['cft-1', 'cft-2', 'cft-3', 'cs-1', 'cs-2', 'cs-3', 'sd-1', 'sd-2', 'sd-3'];

if (!store) {
  console.error('\nUsage: node scripts/publish-catalog-products.mjs <store>.myshopify.com\n');
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
  console.log(`→ Authenticating with ${store} (publications scope) ...`);
  runShopify(['store', 'auth', '--store', store, '--scopes', SCOPES], { parseJson: false });
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-publish-'));
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

console.log(`Publishing catalog products on ${store} ...\n`);
ensureAuth();

const pubs = execute(`query { publications(first: 10) { nodes { id name } } }`);
const online = (pubs.publications?.nodes || []).find((p) => /online store/i.test(p.name));
if (!online) {
  console.error('Online Store publication not found.');
  process.exit(1);
}

const products = execute(`query { products(first: 50) { nodes { id handle title } } }`).products.nodes.filter((p) =>
  HANDLES.includes(p.handle),
);

const publishMutation = `mutation Publish($id: ID!, $input: [PublicationInput!]!) {
  publishablePublish(id: $id, input: $input) {
    publishable { ... on Product { handle onlineStoreUrl } }
    userErrors { message }
  }
}`;

for (const product of products) {
  const result = execute(publishMutation, { id: product.id, input: [{ publicationId: online.id }] }, true);
  const errors = result.publishablePublish?.userErrors || [];
  if (errors.length) {
    console.log(`  ✗ ${product.handle}: ${errors.map((e) => e.message).join('; ')}`);
    continue;
  }
  const url = result.publishablePublish?.publishable?.onlineStoreUrl;
  console.log(`  ✓ ${product.handle} (${product.title})${url ? ` → ${url}` : ''}`);
}

console.log('\nDone. Product pages should load on the storefront.');
