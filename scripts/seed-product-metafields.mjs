#!/usr/bin/env node
/**
 * Create product dimension metafield definitions and seed values from catalog defaults.
 * Usage: node scripts/seed-product-metafields.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || process.env.SHOPIFY_FLAG_STORE || process.env.SHOPIFY_STORE;
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';
const SCOPES = 'write_products,read_products';

const DIMENSIONS = {
  'cft-1': { height: '35', length: '160', width: '90' },
  'cft-2': { height: '60', length: '100', depth: '40' },
  'cft-3': { height: '45', length: '100', width: '40' },
  'cs-1': { height: '160', width: '35', length: '90' },
  'cs-2': { height: '40', width: '30', length: '140' },
  'cs-3': { height: '90', width: '35', length: '175' },
  'sd-1': { height: '60', width: '30', depth: '18' },
  'sd-2': { height: '50', width: '40', depth: '40' },
  'sd-3': { height: '35', width: '40', depth: '25' },
};

const DEFINITIONS = [
  { key: 'height', name: 'Height (cm)' },
  { key: 'length', name: 'Length (cm)' },
  { key: 'width', name: 'Width (cm)' },
  { key: 'depth', name: 'Depth (cm)' },
];

if (!store) {
  console.error('\nUsage: node scripts/seed-product-metafields.mjs <store>.myshopify.com\n');
  process.exit(1);
}

function runShopify(args, { parseJson = true } = {}) {
  const finalArgs = parseJson ? [...args, '--json'] : args;
  const out = execFileSync(shopifyCmd, finalArgs, { encoding: 'utf8', shell: isWin });
  return parseJson ? JSON.parse(out) : out;
}

function ensureAuth() {
  console.log(`→ Authenticating with ${store} ...`);
  runShopify(['store', 'auth', '--store', store, '--scopes', SCOPES], { parseJson: false });
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-metafields-'));
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

console.log(`Seeding product dimension metafields on ${store} ...\n`);
ensureAuth();

const defMutation = `mutation Def($definition: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $definition) {
    createdDefinition { id name namespace key }
    userErrors { message field }
  }
}`;

for (const def of DEFINITIONS) {
  const result = execute(
    defMutation,
    {
      definition: {
        name: def.name,
        namespace: 'custom',
        key: def.key,
        ownerType: 'PRODUCT',
        type: 'single_line_text_field',
        access: { storefront: 'PUBLIC_READ' },
      },
    },
    true,
  );
  const errors = result.metafieldDefinitionCreate?.userErrors || [];
  if (errors.length) {
    const msg = errors.map((e) => e.message).join('; ');
    if (/taken|already exists/i.test(msg)) {
      console.log(`  ✓ custom.${def.key} definition exists`);
    } else {
      console.log(`  ✗ custom.${def.key}: ${msg}`);
    }
  } else {
    console.log(`  + custom.${def.key} definition created`);
  }
}

const products = execute(`query { products(first: 50) { nodes { id handle } } }`).products.nodes.filter(
  (p) => DIMENSIONS[p.handle],
);

const setMutation = `mutation Set($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields { key namespace value }
    userErrors { message }
  }
}`;

for (const product of products) {
  const dims = DIMENSIONS[product.handle];
  const metafields = Object.entries(dims).map(([key, value]) => ({
    ownerId: product.id,
    namespace: 'custom',
    key,
    type: 'single_line_text_field',
    value,
  }));
  const result = execute(setMutation, { metafields }, true);
  const errors = result.metafieldsSet?.userErrors || [];
  if (errors.length) {
    console.log(`  ✗ ${product.handle}: ${errors.map((e) => e.message).join('; ')}`);
  } else {
    console.log(`  ✓ ${product.handle} dimensions seeded`);
  }
}

console.log('\nDone. Edit anytime under Products → each product → Metafields.');
