#!/usr/bin/env node
/**
 * Delete the best-sellers collection from Shopify (products stay in their category collections).
 * Usage: node scripts/remove-best-sellers.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || process.env.SHOPIFY_FLAG_STORE || process.env.SHOPIFY_STORE;
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';

if (!store) {
  console.error('\nUsage: node scripts/remove-best-sellers.mjs <store>.myshopify.com\n');
  process.exit(1);
}

function runShopify(args) {
  const out = execFileSync(shopifyCmd, [...args, '--json'], {
    encoding: 'utf8',
    shell: isWin,
  });
  return JSON.parse(out);
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-remove-best-'));
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

const listQuery = `query {
  collections(first: 50) {
    nodes { id handle title }
  }
}`;

const deleteMutation = `mutation DeleteCollection($input: CollectionDeleteInput!) {
  collectionDelete(input: $input) {
    deletedCollectionId
    userErrors { field message }
  }
}`;

const data = execute(listQuery);
const best = (data.collections?.nodes || []).find((c) => c.handle === 'best-sellers');

if (!best) {
  console.log('best-sellers collection not found — already removed.');
  process.exit(0);
}

const del = execute(deleteMutation, { input: { id: best.id } }, true);
const errors = del.collectionDelete?.userErrors || [];
if (errors.length) {
  throw new Error(errors.map((e) => e.message).join('; '));
}

console.log(`Deleted best-sellers collection (${best.title}).`);
console.log('Catalog products remain in coffee-tables, side-tables, and console-tables.');
