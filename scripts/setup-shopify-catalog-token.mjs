#!/usr/bin/env node
/**
 * NeroCasa Shopify setup using Admin API token (no browser PKCE needed).
 *
 * 1. Shopify Admin → Settings → Apps → App development → Create app
 * 2. Configure Admin API scopes: read/write products, read/write content
 * 3. Install app → copy Admin API access token (starts with shpat_)
 * 4. Run:
 *    set SHOPIFY_ADMIN_TOKEN=shpat_xxxxx
 *    node scripts/setup-shopify-catalog-token.mjs zhjbdz-yw.myshopify.com
 */

const store = process.argv[2];
const token = process.env.SHOPIFY_ADMIN_TOKEN || process.argv[3];

if (!store || !token) {
  console.error(`
Missing store or token.

Steps:
  1. Open: https://admin.shopify.com/store/zhjbdz-yw/settings/apps/development
  2. Create an app → Configure Admin API scopes:
       write_products, read_products, write_content, read_content
  3. Install the app → Reveal Admin API access token once
  4. Run in PowerShell:

     $env:SHOPIFY_ADMIN_TOKEN="shpat_YOUR_TOKEN_HERE"
     node scripts/setup-shopify-catalog-token.mjs ${store || 'zhjbdz-yw.myshopify.com'}
`);
  process.exit(1);
}

const API_VERSION = '2025-01';
const endpoint = `https://${store}/admin/api/${API_VERSION}/graphql.json`;

const COLLECTIONS = [
  { title: 'Coffee Tables', handle: 'coffee-tables', description: 'Architectural marble coffee tables.' },
  { title: 'Side Tables', handle: 'side-tables', description: 'Side tables in Ibiza White, Armani Grey, and Travertine.' },
  { title: 'Console Tables', handle: 'console-tables', description: 'Console tables for refined interiors.' },
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

async function gql(query, variables) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  return json.data;
}

function userErrors(key, data) {
  const block = data?.[key];
  if (block?.userErrors?.length) throw new Error(block.userErrors.map((e) => e.message).join('; '));
  return block;
}

async function loadMaps() {
  const [collections, products, pages] = await Promise.all([
    gql(`query { collections(first: 50) { nodes { id handle title } } }`),
    gql(`query { products(first: 50) { nodes { id handle title } } }`),
    gql(`query { pages(first: 50) { nodes { id handle title } } }`),
  ]);
  return {
    collections: new Map(collections.collections.nodes.map((n) => [n.handle, n])),
    products: new Map(products.products.nodes.map((n) => [n.handle, n])),
    pages: new Map(pages.pages.nodes.map((n) => [n.handle, n])),
  };
}

async function ensureCollections(map) {
  console.log('\n→ Collections');
  for (const col of COLLECTIONS) {
    if (map.has(col.handle)) {
      console.log(`  ✓ ${col.title}`);
      continue;
    }
    const data = await gql(
      `mutation($input: CollectionInput!) {
        collectionCreate(input: $input) { collection { id handle title } userErrors { message } }
      }`,
      { input: { title: col.title, handle: col.handle, descriptionHtml: `<p>${col.description}</p>` } }
    );
    const created = userErrors('collectionCreate', data).collection;
    map.set(created.handle, created);
    console.log(`  + ${created.title}`);
  }
}

async function ensurePages(map) {
  console.log('\n→ Pages');
  for (const page of PAGES) {
    if (map.has(page.handle)) {
      console.log(`  ✓ ${page.title}`);
      continue;
    }
    const data = await gql(
      `mutation($page: PageCreateInput!) {
        pageCreate(page: $page) { page { id handle title } userErrors { message } }
      }`,
      { page: { title: page.title, handle: page.handle, body: '', isPublished: true, templateSuffix: page.templateSuffix } }
    );
    const created = userErrors('pageCreate', data).page;
    map.set(created.handle, created);
    console.log(`  + ${page.title} (/pages/${created.handle})`);
  }
}

async function addToCollection(collectionId, productIds) {
  if (!collectionId || !productIds.length) return;
  const data = await gql(
    `mutation($id: ID!, $productIds: [ID!]!) {
      collectionAddProducts(id: $id, productIds: $productIds) { userErrors { message } }
    }`,
    { id: collectionId, productIds }
  );
  userErrors('collectionAddProducts', data);
}

async function ensureProducts(productMap, collectionMap) {
  console.log('\n→ Products');
  for (const product of PRODUCTS) {
    if (productMap.has(product.handle)) {
      console.log(`  ✓ ${product.title}`);
      await addToCollection(collectionMap.get(product.collection)?.id, [productMap.get(product.handle).id]);
      continue;
    }
    const data = await gql(
      `mutation($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id handle title
            variants(first: 20) { nodes { id selectedOptions { name value } } }
          }
          userErrors { message }
        }
      }`,
      {
        product: {
          title: product.title,
          handle: product.handle,
          productType: product.type,
          status: 'ACTIVE',
          descriptionHtml: '<p>Architectural marble furniture, made to order.</p>',
          productOptions: [{ name: 'Marble', values: product.colors.map((name) => ({ name })) }],
        },
      }
    );
    const created = userErrors('productCreate', data).product;
    productMap.set(created.handle, created);
    console.log(`  + ${created.title}`);

    const updates = (created.variants?.nodes || []).map((variant) => {
      const color = variant.selectedOptions?.find((o) => o.name === 'Marble')?.value;
      const index = product.colors.indexOf(color);
      return { id: variant.id, price: String(index >= 0 ? product.prices[index] : product.prices[0]) };
    });
    if (updates.length) {
      await gql(
        `mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
          productVariantsBulkUpdate(productId: $productId, variants: $variants) { userErrors { message } }
        }`,
        { productId: created.id, variants: updates }
      );
      console.log(`    · ${updates.length} marble variants priced`);
    }
    await addToCollection(collectionMap.get(product.collection)?.id, [created.id]);
  }
}

async function main() {
  console.log(`NeroCasa setup — ${store}`);
  const maps = await loadMaps();
  await ensureCollections(maps.collections);
  await ensurePages(maps.pages);
  await ensureProducts(maps.products, maps.collections);
  console.log('\n✅ Done! Refresh your storefront.\n');
}

main().catch((err) => {
  console.error('\n❌ Setup failed:', err.message || err);
  process.exit(1);
});
