#!/usr/bin/env node
/**
 * Upload catalog JPGs from theme assets/ to Shopify product media and link variants.
 * Place files as assets/{handle}-{marble-slug}.jpg before running.
 *
 * Usage: node scripts/upload-catalog-images.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets');
const store = process.argv[2] || 'zhjbdz-yw.myshopify.com';
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';

const PRODUCTS = [
  { handle: 'cft-1', marbles: ['ibiza-white', 'armani-grey', 'travertine'] },
  { handle: 'cft-2', marbles: ['ibiza-white', 'armani-grey', 'travertine'] },
  { handle: 'cft-3', marbles: ['ibiza-white', 'travertine', 'rosso-levanto'] },
  { handle: 'cs-1', marbles: ['ibiza-white', 'armani-grey', 'travertine'] },
  { handle: 'cs-2', marbles: ['ibiza-white', 'armani-grey', 'travertine'] },
  { handle: 'cs-3', marbles: ['ibiza-white', 'armani-grey', 'travertine'] },
  { handle: 'sd-1', marbles: ['ibiza-white', 'armani-grey', 'travertine'] },
  { handle: 'sd-2', marbles: ['ibiza-white', 'armani-grey', 'travertine'] },
  { handle: 'sd-3', marbles: ['ibiza-white', 'armani-grey', 'travertine'] },
];

const MARBLE_LABEL = {
  'ibiza-white': 'Ibiza White',
  'armani-grey': 'Armani Grey',
  travertine: 'Travertine',
  'rosso-levanto': 'Rosso Levanto',
};

function runShopify(args) {
  const out = execFileSync(shopifyCmd, [...args, '--json'], {
    encoding: 'utf8',
    env: { ...process.env, SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:1|p:cursor|m:images' },
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: isWin,
  });
  return JSON.parse(out);
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-upload-img-'));
  writeFileSync(join(dir, 'query.graphql'), query, 'utf8');
  const args = ['store', 'execute', '--store', store, '--query-file', join(dir, 'query.graphql')];
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

async function uploadFile(filename, fileBuffer) {
  const staged = execute(
    `mutation Staged($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets { url resourceUrl parameters { name value } }
        userErrors { message }
      }
    }`,
    {
      input: [{
        filename,
        mimeType: 'image/jpeg',
        resource: 'PRODUCT_IMAGE',
        fileSize: String(fileBuffer.length),
        httpMethod: 'POST',
      }],
    },
    true,
  );
  const target = staged.stagedUploadsCreate?.stagedTargets?.[0];
  if (!target) throw new Error('Staged upload failed');

  const form = new FormData();
  for (const param of target.parameters) form.append(param.name, param.value);
  form.append('file', new Blob([fileBuffer], { type: 'image/jpeg' }), filename);
  const uploadRes = await fetch(target.url, { method: 'POST', body: form });
  if (!uploadRes.ok) throw new Error(`Upload failed (${uploadRes.status})`);
  return target.resourceUrl;
}

async function main() {
  console.log(`Upload catalog images — ${store}\n`);

  const missing = [];
  for (const product of PRODUCTS) {
    for (const marble of product.marbles) {
      const file = join(assetsDir, `${product.handle}-${marble}.jpg`);
      if (!existsSync(file)) missing.push(`${product.handle}-${marble}.jpg`);
    }
  }

  if (missing.length) {
    console.error('Missing JPG files in assets/. Add these files first:\n');
    missing.forEach((f) => console.error(`  - assets/${f}`));
    console.error('\nThese images must exist locally, then re-run this script.');
    console.error('Without them, Admin and checkout will show no product photos.\n');
    process.exit(1);
  }

  const catalog = execute(`
    query {
      products(first: 20) {
        nodes {
          id handle title
          media(first: 50) {
            nodes { id }
          }
          variants(first: 10) {
            nodes { id title selectedOptions { name value } }
          }
        }
      }
    }
  `);

  const productMap = new Map((catalog.products?.nodes || []).map((p) => [p.handle, p]));

  for (const spec of PRODUCTS) {
    const product = productMap.get(spec.handle);
    if (!product) {
      console.log(`  ! ${spec.handle} not found`);
      continue;
    }

    const existingMediaIds = (product.media?.nodes || []).map((m) => m.id).filter(Boolean);
    if (existingMediaIds.length) {
      const deleted = execute(
        `mutation DeleteMedia($productId: ID!, $mediaIds: [ID!]!) {
          productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
            deletedMediaIds
            mediaUserErrors { field message }
          }
        }`,
        { productId: product.id, mediaIds: existingMediaIds },
        true,
      );
      const deleteErrors = deleted.productDeleteMedia?.mediaUserErrors || [];
      if (deleteErrors.length) throw new Error(deleteErrors.map((e) => e.message).join('; '));
      console.log(`  - ${spec.handle} removed ${existingMediaIds.length} old image(s)`);
    }

    const variantMedia = [];

    for (const marble of spec.marbles) {
      const filename = `${spec.handle}-${marble}.jpg`;
      const fileBuffer = readFileSync(join(assetsDir, filename));
      const resourceUrl = await uploadFile(filename, fileBuffer);
      const label = MARBLE_LABEL[marble] || marble;

      const created = execute(
        `mutation CreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
          productCreateMedia(productId: $productId, media: $media) {
            media {
              id
              ... on MediaImage { image { url } }
            }
            mediaUserErrors { field message }
          }
        }`,
        {
          productId: product.id,
          media: [{ originalSource: resourceUrl, alt: `${product.title} ${label}`, mediaContentType: 'IMAGE' }],
        },
        true,
      );

      const mediaErrors = created.productCreateMedia?.mediaUserErrors || [];
      if (mediaErrors.length) throw new Error(mediaErrors.map((e) => e.message).join('; '));
      const mediaId = created.productCreateMedia?.media?.[0]?.id;
      if (!mediaId) continue;

      const variant = product.variants.nodes.find(
        (v) => v.title === label || v.selectedOptions?.some((o) => o.value === label),
      );
      if (variant) variantMedia.push({ variantId: variant.id, mediaIds: [mediaId] });
      console.log(`  + ${spec.handle} / ${label}`);
    }

    if (variantMedia.length) {
      execute(
        `mutation AppendMedia($productId: ID!, $variantMedia: [ProductVariantAppendMediaInput!]!) {
          productVariantAppendMedia(productId: $productId, variantMedia: $variantMedia) {
            userErrors { field message }
          }
        }`,
        { productId: product.id, variantMedia },
        true,
      );
    }
  }

  console.log('\nDone. Product images should now appear in Admin and checkout.\n');
}

main().catch((err) => {
  console.error('\nFailed:\n', err.message || err);
  process.exit(1);
});
