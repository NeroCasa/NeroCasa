#!/usr/bin/env node
/**
 * Remove legacy Shopify content not used by the NeroCasa theme.
 * Keeps only the current catalog, collections, and page handles.
 *
 * Usage: node scripts/cleanup-shopify-catalog.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || process.env.SHOPIFY_FLAG_STORE || process.env.SHOPIFY_STORE;
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';

const KEEP_PRODUCTS = new Set([
  'cft-1', 'cft-2', 'cft-3',
  'cs-1', 'cs-2', 'cs-3',
  'sd-1', 'sd-2', 'sd-3',
]);

const KEEP_COLLECTIONS = new Set([
  'coffee-tables', 'side-tables', 'console-tables',
]);

const KEEP_PAGES = new Set([
  'why-nerocasa', 'contact', 'custom', 'b2b',
  'terms', 'refunds', 'track-order', 'collections',
]);

const PAGE_TEMPLATES = {
  'why-nerocasa': 'about',
  contact: 'contact',
  custom: 'custom',
  b2b: 'b2b',
  terms: 'terms',
  refunds: 'refunds',
  'track-order': 'track',
  collections: 'collections',
};

function q(strings) {
  return strings.replace(/\s+/g, ' ').trim();
}

function runShopify(args) {
  const env = {
    ...process.env,
    SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:1|p:cursor|m:cleanup',
  };
  try {
    const out = execFileSync(shopifyCmd, [...args, '--json'], {
      encoding: 'utf8',
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: isWin,
    });
    return JSON.parse(out);
  } catch (error) {
    const stderr = error.stderr?.toString?.() || '';
    const stdout = error.stdout?.toString?.() || '';
    throw new Error(stderr || stdout || error.message);
  }
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-cleanup-'));
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

function listAll(type, fields) {
  const items = [];
  let cursor = null;
  do {
    const data = execute(q(`
      query List($cursor: String) {
        ${type}(first: 50, after: $cursor) {
          nodes { ${fields} }
          pageInfo { hasNextPage endCursor }
        }
      }
    `), { cursor });
    const block = data[type];
    items.push(...(block?.nodes || []));
    cursor = block?.pageInfo?.hasNextPage ? block.pageInfo.endCursor : null;
  } while (cursor);
  return items;
}

function deleteProduct(id, handle) {
  const data = execute(q(`
    mutation DeleteProduct($input: ProductDeleteInput!) {
      productDelete(input: $input) {
        deletedProductId
        userErrors { field message }
      }
    }
  `), { input: { id } }, true);
  const errors = data.productDelete?.userErrors || [];
  if (errors.length) throw new Error(`${handle}: ${errors.map((e) => e.message).join('; ')}`);
}

function deleteCollection(id, handle) {
  const data = execute(q(`
    mutation DeleteCollection($input: CollectionDeleteInput!) {
      collectionDelete(input: $input) {
        deletedCollectionId
        userErrors { field message }
      }
    }
  `), { input: { id } }, true);
  const errors = data.collectionDelete?.userErrors || [];
  if (errors.length) throw new Error(`${handle}: ${errors.map((e) => e.message).join('; ')}`);
}

function deletePage(id, handle) {
  const data = execute(q(`
    mutation DeletePage($id: ID!) {
      pageDelete(id: $id) {
        deletedPageId
        userErrors { field message }
      }
    }
  `), { id }, true);
  const errors = data.pageDelete?.userErrors || [];
  if (errors.length) throw new Error(`${handle}: ${errors.map((e) => e.message).join('; ')}`);
}

function updatePage(id, handle) {
  const data = execute(q(`
    mutation UpdatePage($id: ID!, $page: PageUpdateInput!) {
      pageUpdate(id: $id, page: $page) {
        page { id handle templateSuffix }
        userErrors { field message }
      }
    }
  `), {
    id,
    page: {
      body: '',
      isPublished: true,
      templateSuffix: PAGE_TEMPLATES[handle] || null,
    },
  }, true);
  const errors = data.pageUpdate?.userErrors || [];
  if (errors.length) throw new Error(`${handle}: ${errors.map((e) => e.message).join('; ')}`);
}

async function main() {
  if (!store) {
    console.error('\nUsage: node scripts/cleanup-shopify-catalog.mjs <store>.myshopify.com\n');
    process.exit(1);
  }

  console.log(`NeroCasa Shopify cleanup — ${store}\n`);

  const products = listAll('products', 'id handle title');
  const collections = listAll('collections', 'id handle title');
  const pages = listAll('pages', 'id handle title templateSuffix bodySummary');

  console.log('→ Removing legacy products');
  for (const product of products) {
    if (KEEP_PRODUCTS.has(product.handle)) {
      console.log(`  ✓ keep ${product.handle}`);
      continue;
    }
    deleteProduct(product.id, product.handle);
    console.log(`  − deleted ${product.handle} (${product.title})`);
  }

  console.log('\n→ Removing legacy collections');
  for (const collection of collections) {
    if (KEEP_COLLECTIONS.has(collection.handle)) {
      console.log(`  ✓ keep ${collection.handle}`);
      continue;
    }
    try {
      deleteCollection(collection.id, collection.handle);
      console.log(`  − deleted ${collection.handle} (${collection.title})`);
    } catch (error) {
      console.log(`  ! skipped ${collection.handle}: ${error.message}`);
    }
  }

  console.log('\n→ Removing legacy pages');
  for (const page of pages) {
    if (KEEP_PAGES.has(page.handle)) {
      console.log(`  ✓ keep ${page.handle}`);
      continue;
    }
    deletePage(page.id, page.handle);
    console.log(`  − deleted ${page.handle} (${page.title})`);
  }

  console.log('\n→ Resetting kept pages (clear old body, set theme template)');
  for (const page of pages.filter((p) => KEEP_PAGES.has(p.handle))) {
    updatePage(page.id, page.handle);
    console.log(`  · reset ${page.handle} → template ${PAGE_TEMPLATES[page.handle]}`);
  }

  console.log('\nDone. Store now matches the current NeroCasa theme.\n');
}

main().catch((error) => {
  console.error('\nCleanup failed:\n', error.message || error);
  process.exit(1);
});
