#!/usr/bin/env node
/**
 * NeroCasa — one-shot Shopify Admin setup
 * Creates collections, catalog products (with Marble variants), and pages.
 *
 * Prerequisites:
 *   npm install -g @shopify/cli@latest
 *
 * Usage:
 *   node scripts/setup-shopify-catalog.mjs your-store.myshopify.com
 *
 * First run opens browser auth. Required scopes:
 *   write_products, read_products, write_content, read_content
 */

import { execFileSync, execSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { platform } from 'node:os';

const store = process.argv[2] || process.env.SHOPIFY_FLAG_STORE || process.env.SHOPIFY_STORE;
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';

function q(strings) {
  return strings.replace(/\s+/g, ' ').trim();
}

function runShopify(args, { parseJson = true } = {}) {
  const env = {
    ...process.env,
    SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:1|p:cursor|m:auto',
  };
  const finalArgs = parseJson ? [...args, '--json'] : args;
  try {
    const out = execFileSync(shopifyCmd, finalArgs, {
      encoding: 'utf8',
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: isWin,
    });
    if (!parseJson) return out;
    return JSON.parse(out);
  } catch (error) {
    const stderr = error.stderr?.toString?.() || error.message;
    const stdout = error.stdout?.toString?.() || '';
    throw new Error(stderr || stdout || error.message);
  }
}
if (!store) {
  console.error('\nUsage: node scripts/setup-shopify-catalog.mjs <store>.myshopify.com\n');
  process.exit(1);
}

const SCOPES = 'write_products,read_products,write_content,read_content';

const COLLECTIONS = [
  { title: 'Coffee Tables', handle: 'coffee-tables', description: 'Luxury marble coffee tables in Ibiza White, Armani Grey, Travertine and Rosso Levanto.' },
  { title: 'Side Tables', handle: 'side-tables', description: 'Premium marble side tables in Ibiza White, Armani Grey and Travertine.' },
  { title: 'Console Tables', handle: 'console-tables', description: 'Architectural marble console tables for refined entryways and interiors.' },
];

const PAGES = [
  { title: 'Why Nerocasa', handle: 'why-nerocasa', templateSuffix: 'about' },
  { title: 'Contact', handle: 'contact', templateSuffix: 'contact' },
  { title: 'Custom', handle: 'custom', templateSuffix: 'custom' },
  { title: 'B2B', handle: 'b2b', templateSuffix: 'b2b' },
  { title: 'Terms & Conditions', handle: 'terms', templateSuffix: 'terms' },
  { title: 'Refunds', handle: 'refunds', templateSuffix: 'refunds' },
  { title: 'Track Order', handle: 'track-order', templateSuffix: 'track' },
  { title: 'Collections', handle: 'collections', templateSuffix: 'collections' },
];

const PRODUCTS = [
  { handle: 'cft-1', title: 'Soglia', type: 'Coffee Table', collection: 'coffee-tables', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [8500, 8800, 8200] },
  { handle: 'cft-2', title: 'Equilibrio', type: 'Coffee Table', collection: 'coffee-tables', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [9200, 9500, 8900] },
  { handle: 'cft-3', title: 'Monolite', type: 'Coffee Table', collection: 'coffee-tables', colors: ['Ibiza White', 'Travertine', 'Rosso Levanto'], prices: [9800, 9400, 11200] },
  { handle: 'cs-1', title: 'Galleria', type: 'Console Table', collection: 'console-tables', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [7200, 7500, 6900] },
  { handle: 'cs-2', title: 'Passaggio', type: 'Console Table', collection: 'console-tables', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [7800, 8100, 7600] },
  { handle: 'cs-3', title: 'Atrio', type: 'Console Table', collection: 'console-tables', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [8400, 8700, 8200] },
  { handle: 'sd-1', title: 'Nodo', type: 'Side Table', collection: 'side-tables', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [4200, 4500, 3900] },
  { handle: 'sd-2', title: 'Punto', type: 'Side Table', collection: 'side-tables', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [4600, 4900, 4300] },
  { handle: 'sd-3', title: 'Scalino', type: 'Side Table', collection: 'side-tables', colors: ['Ibiza White', 'Armani Grey', 'Travertine'], prices: [5100, 5400, 4800] },
];

function ensureAuth() {
  console.log(`\n→ Authenticating with ${store} ...`);
  runShopify(['store', 'auth', '--store', store, '--scopes', SCOPES], { parseJson: false });
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-shopify-'));
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

function findUserErrors(payload, keys) {
  for (const key of keys) {
    const block = payload?.[key];
    if (block?.userErrors?.length) return block.userErrors;
  }
  return [];
}

async function getCollectionMap() {
  const data = execute(q(`query { collections(first: 50) { nodes { id handle title } } }`));
  const map = new Map();
  for (const node of data.collections?.nodes || []) map.set(node.handle, node);
  return map;
}

async function getProductMap() {
  const data = execute(q(`query { products(first: 50) { nodes { id handle title options { id name values } variants(first: 20) { nodes { id title price selectedOptions { name value } } } } } }`));
  const map = new Map();
  for (const node of data.products?.nodes || []) map.set(node.handle, node);
  return map;
}

function createMissingVariants(productId, spec, existingVariants) {
  const existingColors = new Set(
    existingVariants.map((v) => v.selectedOptions?.find((o) => o.name === 'Marble')?.value).filter(Boolean),
  );
  const toCreate = spec.colors
    .map((color, i) => ({ color, price: spec.prices[i] }))
    .filter(({ color }) => !existingColors.has(color));
  if (!toCreate.length) return existingVariants;

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
  if (errors.length) throw new Error(`Variants for ${spec.handle}: ${errors.map((e) => e.message).join('; ')}`);
  return [...existingVariants, ...(data.productVariantsBulkCreate.productVariants || [])];
}

function setVariantPrices(productId, variants, spec) {
  const updates = variants.map((variant) => {
    const color = variant.selectedOptions?.find((o) => o.name === 'Marble')?.value;
    const index = spec.colors.indexOf(color);
    const price = index >= 0 ? String(spec.prices[index]) : String(spec.prices[0]);
    return { id: variant.id, price };
  });
  if (!updates.length) return;
  const priceData = execute(q(`
    mutation UpdateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants { id price }
        userErrors { field message }
      }
    }
  `), { productId, variants: updates }, true);
  const priceErrors = findUserErrors(priceData, ['productVariantsBulkUpdate']);
  if (priceErrors.length) throw new Error(`Prices for ${spec.handle}: ${priceErrors.map((e) => e.message).join('; ')}`);
}

async function getPageMap() {
  const data = execute(q(`query { pages(first: 50) { nodes { id handle title } } }`));
  const map = new Map();
  for (const node of data.pages?.nodes || []) map.set(node.handle, node);
  return map;
}

async function ensureCollections(collectionMap) {
  console.log('\n→ Collections');
  for (const col of COLLECTIONS) {
    if (collectionMap.has(col.handle)) {
      console.log(`  ✓ ${col.title} (${col.handle}) exists`);
      continue;
    }
    const mutation = q(`mutation CreateCollection($input: CollectionInput!) { collectionCreate(input: $input) { collection { id handle title } userErrors { field message } } }`);
    const data = execute(mutation, {
      input: {
        title: col.title,
        handle: col.handle,
        descriptionHtml: `<p>${col.description}</p>`,
      },
    }, true);
    const errors = findUserErrors(data, ['collectionCreate']);
    if (errors.length) throw new Error(`Collection ${col.handle}: ${errors.map((e) => e.message).join('; ')}`);
    const created = data.collectionCreate.collection;
    collectionMap.set(created.handle, created);
    console.log(`  + Created ${created.title} (${created.handle})`);
  }
}

async function ensurePages(pageMap) {
  console.log('\n→ Pages');
  for (const page of PAGES) {
    if (pageMap.has(page.handle)) {
      console.log(`  ✓ ${page.title} (${page.handle}) exists`);
      continue;
    }
    const mutation = q(`mutation CreatePage($page: PageCreateInput!) { pageCreate(page: $page) { page { id handle title } userErrors { field message } } }`);
    const data = execute(mutation, {
      page: {
        title: page.title,
        handle: page.handle,
        body: '',
        isPublished: true,
        templateSuffix: page.templateSuffix,
      },
    }, true);
    const errors = findUserErrors(data, ['pageCreate']);
    if (errors.length) throw new Error(`Page ${page.handle}: ${errors.map((e) => e.message).join('; ')}`);
    const created = data.pageCreate.page;
    pageMap.set(created.handle, created);
    console.log(`  + Created ${created.title} (/pages/${created.handle})`);
  }
}

async function ensureProducts(productMap, collectionMap) {
  console.log('\n→ Products');
  for (const product of PRODUCTS) {
    if (productMap.has(product.handle)) {
      const existing = productMap.get(product.handle);
      const variants = createMissingVariants(existing.id, product, existing.variants?.nodes || []);
      setVariantPrices(existing.id, variants, product);
      console.log(`  ✓ ${product.title} (${product.handle}) — ${variants.length} marble variants`);
      await assignToCollection(existing.id, collectionMap.get(product.collection)?.id);
      continue;
    }

    const createMutation = q(`mutation CreateProduct($product: ProductCreateInput!) { productCreate(product: $product) { product { id handle title variants(first: 20) { nodes { id title selectedOptions { name value } } } } userErrors { field message } } }`);

    const createData = execute(createMutation, {
      product: {
        title: product.title,
        handle: product.handle,
        productType: product.type,
        status: 'ACTIVE',
        descriptionHtml: '<p>Luxury marble furniture, hand-finished in premium Italian stone.</p>',
        productOptions: [{
          name: 'Marble',
          values: product.colors.map((name) => ({ name })),
        }],
      },
    }, true);

    const createErrors = findUserErrors(createData, ['productCreate']);
    if (createErrors.length) throw new Error(`Product ${product.handle}: ${createErrors.map((e) => e.message).join('; ')}`);

    const created = createData.productCreate.product;
    productMap.set(created.handle, created);
    console.log(`  + Created ${created.title} (${created.handle})`);

    const variants = created.variants?.nodes || [];
    const updates = variants.map((variant) => {
      const color = variant.selectedOptions?.find((o) => o.name === 'Marble')?.value;
      const index = product.colors.indexOf(color);
      const price = index >= 0 ? String(product.prices[index]) : String(product.prices[0]);
      return { id: variant.id, price };
    });

    if (updates.length) {
      const priceMutation = q(`mutation UpdateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) { productVariantsBulkUpdate(productId: $productId, variants: $variants) { productVariants { id price } userErrors { field message } } }`);
      const priceData = execute(priceMutation, {
        productId: created.id,
        variants: updates,
      }, true);
      const priceErrors = findUserErrors(priceData, ['productVariantsBulkUpdate']);
      if (priceErrors.length) throw new Error(`Prices for ${product.handle}: ${priceErrors.map((e) => e.message).join('; ')}`);
      console.log(`    · Set ${updates.length} marble variant prices`);
    }

    await assignToCollection(created.id, collectionMap.get(product.collection)?.id);
  }
}

async function assignToCollection(productId, collectionId) {
  if (!productId || !collectionId) return;
  const mutation = q(`mutation AddProducts($id: ID!, $productIds: [ID!]!) { collectionAddProducts(id: $id, productIds: $productIds) { userErrors { field message } } }`);
  const data = execute(mutation, { id: collectionId, productIds: [productId] }, true);
  const errors = findUserErrors(data, ['collectionAddProducts']);
  if (errors.length && !errors.every((e) => /already/i.test(e.message))) {
    throw new Error(errors.map((e) => e.message).join('; '));
  }
}

async function assignManyToCollection(collectionId, productIds) {
  if (!collectionId || !productIds.length) return;
  const mutation = q(`mutation AddProducts($id: ID!, $productIds: [ID!]!) { collectionAddProducts(id: $id, productIds: $productIds) { userErrors { field message } } }`);
  execute(mutation, { id: collectionId, productIds }, true);
}

async function main() {
  console.log(`NeroCasa Shopify setup — ${store}`);

  const collectionMap = await getCollectionMap();
  const pageMap = await getPageMap();
  const productMap = await getProductMap();

  await ensureCollections(collectionMap);
  await ensurePages(pageMap);
  await ensureProducts(productMap, collectionMap);

  console.log('\nDone. Your store now has:');
  console.log('  • 3 collections (coffee, side, console)');
  console.log('  • 9 products with Marble color variants + placeholder prices');
  console.log('  • 8 published pages with theme templates');
  console.log('\nEdit prices in Shopify Admin → Products when ready.\n');
}

main().catch((error) => {
  console.error('\nSetup failed:\n', error.message || error);
  process.exit(1);
});
