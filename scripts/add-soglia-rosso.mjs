#!/usr/bin/env node
/**
 * Add Rosso Levanto to Soglia (cft-1): variant, image, SEO.
 * Uses the Admin file soglia_red.jpg already uploaded by the merchant.
 *
 * Usage: node scripts/add-soglia-rosso.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || 'zhjbdz-yw.myshopify.com';
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';

const HANDLE = 'cft-1';
const MARBLE = 'Rosso Levanto';
const PRICE = '8800';
const SKU = 'NC-CFT-SOG-RLV';
const FILE_QUERY = 'soglia_red';
const ALT = 'Soglia Rosso Levanto';
const SEO = {
  title: 'Soglia Marble Coffee Table | Natural Stone Pair | NEROCASA',
  description:
    'A pair of sculptural marble coffee tables in Ibiza White, Armani Grey, Travertine or Rosso Levanto. Price shown is for both tables, hand-finished in our workshop.',
};
const DESCRIPTION_HTML =
  '<p>Soglia is a sculptural marble coffee table sold as a matching pair. Available in Ibiza White, Armani Grey, Travertine and Rosso Levanto, each piece is hand-finished in our workshop for refined, architectural living spaces.</p>';

function runShopify(args) {
  const out = execFileSync(shopifyCmd, [...args, '--json'], {
    encoding: 'utf8',
    env: { ...process.env, SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:1|p:cursor|m:soglia-rosso' },
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: isWin,
  });
  return JSON.parse(out);
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-soglia-rosso-'));
  writeFileSync(join(dir, 'query.graphql'), query, 'utf8');
  const a = ['store', 'execute', '--store', store, '--query-file', join(dir, 'query.graphql')];
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

function fail(label, errors) {
  console.error(`✗ ${label}`);
  for (const e of errors || []) console.error(`  - ${e.message || JSON.stringify(e)}`);
  process.exit(1);
}

console.log(`\nAdding ${MARBLE} to Soglia on ${store} ...\n`);

const discovery = execute(`query {
  product: productByHandle(handle: "${HANDLE}") {
    id
    title
    options { name values }
    media(first: 40) {
      edges {
        node {
          ... on MediaImage {
            id
            alt
            image { url }
          }
        }
      }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          price
          sku
          image { id url }
        }
      }
    }
  }
  files(first: 10, query: "${FILE_QUERY}", sortKey: CREATED_AT, reverse: true) {
    edges {
      node {
        ... on MediaImage {
          id
          alt
          image { url }
          fileStatus
        }
      }
    }
  }
}`);

const product = discovery.product;
if (!product) {
  console.error('✗ Product cft-1 not found');
  process.exit(1);
}

const existing = product.variants.edges.map((e) => e.node).find((v) => v.title === MARBLE);
const fileNode = discovery.files.edges.map((e) => e.node).find((n) => n?.image?.url?.includes('soglia_red'));
if (!fileNode) {
  console.error('✗ soglia_red not found in Shopify Files');
  process.exit(1);
}
console.log(`✓ Found file: ${fileNode.image.url}`);

// Set alt on the Files asset
const fileUpdate = execute(
  `mutation FileUpdate($input: [FileUpdateInput!]!) {
    fileUpdate(files: $input) {
      files { ... on MediaImage { id alt } }
      userErrors { message }
    }
  }`,
  { input: [{ id: fileNode.id, alt: ALT }] },
  true,
);
if (fileUpdate.fileUpdate?.userErrors?.length) fail('fileUpdate', fileUpdate.fileUpdate.userErrors);
console.log(`✓ File alt set to "${ALT}"`);

// Attach image to product if not already there
let mediaId = product.media.edges
  .map((e) => e.node)
  .find((m) => m?.image?.url?.includes('soglia_red'))?.id;

if (!mediaId) {
  const created = execute(
    `mutation CreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media { id ... on MediaImage { image { url } alt } }
        mediaUserErrors { message }
      }
    }`,
    {
      productId: product.id,
      media: [
        {
          originalSource: fileNode.image.url,
          alt: ALT,
          mediaContentType: 'IMAGE',
        },
      ],
    },
    true,
  );
  if (created.productCreateMedia?.mediaUserErrors?.length) {
    fail('productCreateMedia', created.productCreateMedia.mediaUserErrors);
  }
  mediaId = created.productCreateMedia?.media?.[0]?.id;
  if (!mediaId) {
    console.error('✗ productCreateMedia returned no media id');
    process.exit(1);
  }
  console.log(`✓ Image attached to product: ${mediaId}`);
} else {
  console.log(`✓ Image already on product: ${mediaId}`);
  execute(
    `mutation FileUpdate($input: [FileUpdateInput!]!) {
      fileUpdate(files: $input) {
        files { ... on MediaImage { id alt } }
        userErrors { message }
      }
    }`,
    { input: [{ id: mediaId, alt: ALT }] },
    true,
  );
}

let variantId = existing?.id;
if (existing) {
  console.log(`~ Variant already exists (${existing.id}) — updating price/SKU/media`);
  const updated = execute(
    `mutation UpdateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants { id title price sku }
        userErrors { message }
      }
    }`,
    {
      productId: product.id,
      variants: [{ id: existing.id, price: PRICE, inventoryPolicy: 'CONTINUE', barcode: null }],
    },
    true,
  );
  // SKU via inventoryItem / productVariantsBulkUpdate - sku field
  const skuUpdate = execute(
    `mutation UpdateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants { id title price sku }
        userErrors { message }
      }
    }`,
    {
      productId: product.id,
      variants: [{ id: existing.id, price: PRICE, inventoryPolicy: 'CONTINUE', inventoryItem: { sku: SKU } }],
    },
    true,
  );
  if (skuUpdate.productVariantsBulkUpdate?.userErrors?.length) {
    fail('productVariantsBulkUpdate', skuUpdate.productVariantsBulkUpdate.userErrors);
  }
  console.log(`✓ Updated to AED ${PRICE} / ${SKU}`);
} else {
  const created = execute(
    `mutation CreateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, variants: $variants) {
        productVariants { id title price sku media(first: 1) { nodes { id } } }
        userErrors { field message }
      }
    }`,
    {
      productId: product.id,
      variants: [
        {
          price: PRICE,
          optionValues: [{ optionName: 'Marble', name: MARBLE }],
          inventoryPolicy: 'CONTINUE',
          inventoryItem: { sku: SKU, tracked: true },
          mediaId,
        },
      ],
    },
    true,
  );
  if (created.productVariantsBulkCreate?.userErrors?.length) {
    fail('productVariantsBulkCreate', created.productVariantsBulkCreate.userErrors);
  }
  variantId = created.productVariantsBulkCreate?.productVariants?.[0]?.id;
  if (!variantId) {
    console.error('✗ No variant id returned');
    process.exit(1);
  }
  console.log(`✓ Variant created: ${variantId} — ${MARBLE} @ AED ${PRICE} (${SKU})`);
}

// Ensure media is linked to the variant (covers update path / create without media attach)
const append = execute(
  `mutation AppendMedia($productId: ID!, $variantMedia: [ProductVariantAppendMediaInput!]!) {
    productVariantAppendMedia(productId: $productId, variantMedia: $variantMedia) {
      productVariants { id title image { url altText } }
      userErrors { field message }
    }
  }`,
  {
    productId: product.id,
    variantMedia: [{ variantId, mediaIds: [mediaId] }],
  },
  true,
);
const appendErrors = append.productVariantAppendMedia?.userErrors || [];
const ignorable = appendErrors.every(
  (e) => /already|attached|exists/i.test(e.message || ''),
);
if (appendErrors.length && !ignorable) fail('productVariantAppendMedia', appendErrors);
if (!appendErrors.length) console.log('✓ Variant image linked');
else console.log('~ Variant image already linked');

const seoUpdate = execute(
  `mutation ProductUpdate($product: ProductUpdateInput!) {
    productUpdate(product: $product) {
      product { id seo { title description } descriptionHtml }
      userErrors { message }
    }
  }`,
  {
    product: {
      id: product.id,
      descriptionHtml: DESCRIPTION_HTML,
      seo: SEO,
    },
  },
  true,
);
if (seoUpdate.productUpdate?.userErrors?.length) fail('productUpdate', seoUpdate.productUpdate.userErrors);
console.log('✓ SEO title, meta description and product description updated');

const verify = execute(`query {
  productByHandle(handle: "${HANDLE}") {
    seo { title description }
    descriptionHtml
    options { name values }
    variants(first: 20) {
      edges {
        node {
          title
          price
          sku
          image { url altText }
        }
      }
    }
  }
}`);

const v = verify.productByHandle;
const rosso = v.variants.edges.map((e) => e.node).find((n) => n.title === MARBLE);
console.log('\nDone. Soglia now includes:');
console.log(`  Options: ${v.options.map((o) => o.values.join(', ')).join(' | ')}`);
console.log(`  ${rosso?.title}: AED ${rosso?.price} / ${rosso?.sku}`);
console.log(`  Image: ${rosso?.image?.altText || '(no alt)'} — ${rosso?.image?.url || 'MISSING'}`);
console.log(`  SEO: ${v.seo.title}`);
console.log(`  Meta: ${v.seo.description}\n`);
