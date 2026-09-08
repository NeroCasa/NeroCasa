#!/usr/bin/env node
/**
 * Set the shop search-listing title and description Google is reading.
 * Usage: node scripts/fix-homepage-seo.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || 'zhjbdz-yw.myshopify.com';
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';
const TITLE = 'NEROCASA | Luxury Marble Furniture';
const DESCRIPTION =
  'Luxury marble furniture, cut in our workshop. Coffee tables, side tables and console tables in natural stone, from quarries worldwide.';

function runShopify(args, { parseJson = true } = {}) {
  const finalArgs = parseJson ? [...args, '--json'] : args;
  const out = execFileSync(shopifyCmd, finalArgs, { encoding: 'utf8', shell: isWin });
  return parseJson ? JSON.parse(out) : out;
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-seo-'));
  const queryFile = join(dir, 'query.graphql');
  writeFileSync(queryFile, query, 'utf8');
  const args = ['store', 'execute', '--store', store, '--query-file', queryFile];
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

runShopify(
  ['store', 'auth', '--store', store, '--scopes', 'read_content,write_content,read_products'],
  { parseJson: false },
);

const shop = execute(`query {
  shop {
    id
    name
    description
    metafields(first: 20, namespace: "global") {
      nodes { id key namespace value }
    }
  }
}`).shop;

console.log('Shop:', shop.name);
console.log('Current description:', shop.description || '(blank)');
console.log('Current global metafields:', JSON.stringify(shop.metafields.nodes, null, 2));

const result = execute(
  `mutation HomepageSeo($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { key namespace value }
      userErrors { field message }
    }
  }`,
  {
    metafields: [
      {
        ownerId: shop.id,
        namespace: 'global',
        key: 'title_tag',
        type: 'single_line_text_field',
        value: TITLE,
      },
      {
        ownerId: shop.id,
        namespace: 'global',
        key: 'description_tag',
        type: 'single_line_text_field',
        value: DESCRIPTION,
      },
    ],
  },
  true,
);

const errors = result.metafieldsSet?.userErrors || [];
if (errors.length) {
  console.error('Failed:', errors.map((e) => e.message).join('; '));
  process.exit(1);
}

console.log('Updated shop search listing title and description.');
