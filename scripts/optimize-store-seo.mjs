#!/usr/bin/env node
/**
 * Bulk-optimize Shopify SEO for NeroCasa catalog, collections, and pages.
 * Usage: node scripts/optimize-store-seo.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || process.env.SHOPIFY_FLAG_STORE || process.env.SHOPIFY_STORE;
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';
const SCOPES = 'write_products,read_products,write_content,read_content';

if (!store) {
  console.error('\nUsage: node scripts/optimize-store-seo.mjs <store>.myshopify.com\n');
  process.exit(1);
}

const PRODUCTS = {
  'cft-1': {
    seoTitle: 'Soglia Marble Coffee Table | Luxury Italian Stone | NEROCASA',
    seoDescription:
      'Soglia is a pair of sculptural marble coffee tables in Ibiza White, Armani Grey or Travertine. Price shown is for both tables. Hand-finished natural stone from NEROCASA.',
    descriptionHtml:
      '<p>Soglia is a sculptural marble coffee table sold as a matching pair. Available in Ibiza White, Armani Grey and Travertine, each piece is hand-finished in premium Italian marble for refined, architectural living spaces.</p>',
  },
  'cft-2': {
    seoTitle: 'Equilibrio Marble Coffee Table | Premium Natural Stone | NEROCASA',
    seoDescription:
      'Equilibrio balances mass and lightness in Ibiza White, Armani Grey or Travertine. A luxury marble coffee table crafted for architectural interiors.',
    descriptionHtml:
      '<p>Equilibrio is a premium marble coffee table that balances mass and lightness with architectural precision. Choose Ibiza White, Armani Grey or Travertine for a centrepiece that elevates contemporary and classic interiors alike.</p>',
  },
  'cft-3': {
    seoTitle: 'Monolite Marble Coffee Table | Rosso Levanto & Italian Stone | NEROCASA',
    seoDescription:
      'Monolite marble coffee table in Ibiza White, Travertine or Rosso Levanto. Bold monolithic form in premium Italian stone for luxury interiors.',
    descriptionHtml:
      '<p>Monolite commands attention with a bold monolithic form carved from premium Italian marble. Available in Ibiza White, Travertine and Rosso Levanto, it brings sculptural presence and natural stone character to luxury living rooms.</p>',
  },
  'cs-1': {
    seoTitle: 'Galleria Marble Console Table | Luxury Entry Furniture | NEROCASA',
    seoDescription:
      'Galleria is an architectural marble console in Ibiza White, Armani Grey or Travertine. Premium stone furniture for refined hallways and living spaces.',
    descriptionHtml:
      '<p>Galleria is an architectural marble console table designed for entryways, galleries and refined living spaces. Finished in Ibiza White, Armani Grey or Travertine, it pairs gallery-worthy presence with everyday elegance.</p>',
  },
  'cs-2': {
    seoTitle: 'Passaggio Marble Console Table | Italian Stone | NEROCASA',
    seoDescription:
      'Passaggio marble console table in Ibiza White, Armani Grey or Travertine. Slim, sculptural luxury furniture for hallways and curated interiors.',
    descriptionHtml:
      '<p>Passaggio is a slim, sculptural marble console that frames transitions between rooms with quiet luxury. Hand-finished in Ibiza White, Armani Grey or Travertine for discerning residential and hospitality projects.</p>',
  },
  'cs-3': {
    seoTitle: 'Atrio Marble Console Table | Premium Natural Stone | NEROCASA',
    seoDescription:
      'Atrio marble console table in Ibiza White, Armani Grey or Travertine. Statement stone furniture for luxury foyers, corridors and living areas.',
    descriptionHtml:
      '<p>Atrio is a statement marble console table crafted for luxury foyers and curated interiors. Available in Ibiza White, Armani Grey and Travertine, it combines generous surface area with the enduring beauty of natural stone.</p>',
  },
  'sd-1': {
    seoTitle: 'Nodo Marble Side Table | Luxury Accent Furniture | NEROCASA',
    seoDescription:
      'Nodo marble side table in Ibiza White, Armani Grey or Travertine. Compact luxury stone accent for sofas, bedsides and curated seating areas.',
    descriptionHtml:
      '<p>Nodo is a compact marble side table that anchors seating arrangements with sculptural simplicity. Finished in Ibiza White, Armani Grey or Travertine, it is ideal beside sofas, beds and lounge chairs.</p>',
  },
  'sd-2': {
    seoTitle: 'Punto Marble Side Table | Italian Stone Accent | NEROCASA',
    seoDescription:
      'Punto marble side table in Ibiza White, Armani Grey or Travertine. Refined natural stone accent furniture for premium interiors.',
    descriptionHtml:
      '<p>Punto is a refined marble side table designed as a precise accent in premium interiors. Select Ibiza White, Armani Grey or Travertine to complement upholstery, lighting and architectural details.</p>',
  },
  'sd-3': {
    seoTitle: 'Scalino Marble Side Table | Premium Stone Furniture | NEROCASA',
    seoDescription:
      'Scalino marble side table in Ibiza White, Armani Grey or Travertine. Layered stone form for luxury living rooms and boutique hospitality spaces.',
    descriptionHtml:
      '<p>Scalino features a layered marble form that adds depth and texture to luxury living rooms and boutique hospitality spaces. Available in Ibiza White, Armani Grey and Travertine with hand-finished natural stone surfaces.</p>',
  },
};

const COLLECTIONS = {
  'coffee-tables': {
    seoTitle: 'Luxury Marble Coffee Tables | Italian Stone | NEROCASA',
    seoDescription:
      'Shop luxury marble coffee tables in Ibiza White, Armani Grey, Travertine and Rosso Levanto. Sculptural Italian stone furniture for premium interiors.',
    descriptionHtml:
      '<p>Explore architect-designed marble coffee tables crafted from premium Italian stone. From Soglia and Equilibrio to Monolite in Rosso Levanto, each design is hand-finished for luxury living spaces.</p>',
  },
  'side-tables': {
    seoTitle: 'Luxury Marble Side Tables | Premium Accent Furniture | NEROCASA',
    seoDescription:
      'Marble side tables in Ibiza White, Armani Grey and Travertine. Compact luxury stone accent pieces for refined sofas, bedsides and lounge settings.',
    descriptionHtml:
      '<p>Discover marble side tables designed as sculptural accents for premium interiors. Nodo, Punto and Scalino are available in Ibiza White, Armani Grey and Travertine with hand-finished natural stone surfaces.</p>',
  },
  'console-tables': {
    seoTitle: 'Luxury Marble Console Tables | Entry & Hall Furniture | NEROCASA',
    seoDescription:
      'Architectural marble console tables in Ibiza White, Armani Grey and Travertine. Premium stone furniture for foyers, corridors and curated interiors.',
    descriptionHtml:
      '<p>Browse luxury marble console tables for entryways, hallways and gallery walls. Galleria, Passaggio and Atrio combine architectural proportion with the enduring character of Italian stone.</p>',
  },
};

const PAGES = {
  'why-nerocasa': {
    seoTitle: 'Why NEROCASA | Luxury Marble Furniture Workshop',
    seoDescription:
      'NEROCASA imports premium marble and crafts luxury furniture in its own workshop. Italian stone, architectural design and white-glove delivery.',
  },
  contact: {
    seoTitle: 'Contact NEROCASA | Luxury Marble Furniture',
    seoDescription:
      'Contact NEROCASA for luxury marble furniture, custom stone pieces and project enquiries. WhatsApp, email and showroom appointments available.',
  },
  custom: {
    seoTitle: 'Custom Marble Furniture | Made to Your Design | NEROCASA',
    seoDescription:
      'Commission custom marble furniture in any stone, size or design. Custom tables and surfaces crafted from premium natural stone by NEROCASA.',
  },
  b2b: {
    seoTitle: 'B2B Marble Furniture | Trade & Hospitality | NEROCASA',
    seoDescription:
      'Trade and hospitality marble furniture from NEROCASA. Volume pricing, project support and premium Italian stone for architects and designers.',
  },
  terms: {
    seoTitle: 'Terms & Conditions | NEROCASA',
    seoDescription: 'Terms and conditions for purchasing luxury marble furniture from NEROCASA online and in showroom.',
  },
  refunds: {
    seoTitle: 'Refunds & Returns Policy | NEROCASA',
    seoDescription: 'NEROCASA refunds and returns policy for luxury marble furniture orders, delivery and product care.',
  },
  'track-order': {
    seoTitle: 'Track Your Order | NEROCASA',
    seoDescription: 'Track your NEROCASA marble furniture order. Delivery updates for luxury stone furniture across the UAE and internationally.',
  },
  collections: {
    seoTitle: 'Marble Furniture Collections | Coffee, Console & Side Tables | NEROCASA',
    seoDescription:
      'Browse all NEROCASA marble furniture collections. Luxury coffee tables, console tables and side tables in premium Italian stone finishes.',
  },
};

function runShopify(args, { parseJson = true } = {}) {
  const finalArgs = parseJson ? [...args, '--json'] : args;
  const out = execFileSync(shopifyCmd, finalArgs, { encoding: 'utf8', shell: isWin });
  return parseJson ? JSON.parse(out) : out;
}

function ensureAuth() {
  if (process.env.NC_SKIP_SHOPIFY_AUTH === '1') return;
  try {
    runShopify(['store', 'execute', '--store', store, '--query', 'query { shop { name } }']);
    return;
  } catch {
    /* needs auth */
  }
  console.log(`→ Authenticating with ${store} ...`);
  runShopify(['store', 'auth', '--store', store, '--scopes', SCOPES], { parseJson: false });
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

console.log(`Optimizing store SEO on ${store} ...\n`);
ensureAuth();

const productMutation = `mutation ProductSeo($input: ProductInput!) {
  productUpdate(input: $input) {
    product { handle seo { title description } }
    userErrors { message }
  }
}`;

const products = execute(`query {
  products(first: 50) {
    nodes { id handle title seo { title description } }
  }
}`).products.nodes;

for (const product of products) {
  const seo = PRODUCTS[product.handle];
  if (!seo) continue;
  const result = execute(
    productMutation,
    {
      input: {
        id: product.id,
        seo: { title: seo.seoTitle, description: seo.seoDescription },
        descriptionHtml: seo.descriptionHtml,
      },
    },
    true,
  );
  const errors = result.productUpdate?.userErrors || [];
  if (errors.length) {
    console.log(`  ✗ product ${product.handle}: ${errors.map((e) => e.message).join('; ')}`);
  } else {
    console.log(`  + product ${product.handle}`);
  }
}

const collectionMutation = `mutation CollectionSeo($input: CollectionInput!) {
  collectionUpdate(input: $input) {
    collection { handle seo { title description } }
    userErrors { message }
  }
}`;

const collections = execute(`query {
  collections(first: 50) {
    nodes { id handle title seo { title description } }
  }
}`).collections.nodes;

for (const collection of collections) {
  const seo = COLLECTIONS[collection.handle];
  if (!seo) continue;
  const result = execute(
    collectionMutation,
    {
      input: {
        id: collection.id,
        seo: { title: seo.seoTitle, description: seo.seoDescription },
        descriptionHtml: seo.descriptionHtml,
      },
    },
    true,
  );
  const errors = result.collectionUpdate?.userErrors || [];
  if (errors.length) {
    console.log(`  ✗ collection ${collection.handle}: ${errors.map((e) => e.message).join('; ')}`);
  } else {
    console.log(`  + collection ${collection.handle}`);
  }
}

const pageMetafieldMutation = `mutation PageSeoMetafields($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields { key namespace value }
    userErrors { message }
  }
}`;

const pages = execute(`query {
  pages(first: 50) {
    nodes { id handle title }
  }
}`).pages.nodes;

for (const page of pages) {
  const seo = PAGES[page.handle];
  if (!seo) continue;
  const result = execute(
    pageMetafieldMutation,
    {
      metafields: [
        {
          ownerId: page.id,
          namespace: 'global',
          key: 'title_tag',
          type: 'single_line_text_field',
          value: seo.seoTitle,
        },
        {
          ownerId: page.id,
          namespace: 'global',
          key: 'description_tag',
          type: 'single_line_text_field',
          value: seo.seoDescription,
        },
      ],
    },
    true,
  );
  const errors = result.metafieldsSet?.userErrors || [];
  if (errors.length) {
    console.log(`  ✗ page ${page.handle}: ${errors.map((e) => e.message).join('; ')}`);
  } else {
    console.log(`  + page ${page.handle}`);
  }
}

console.log('\nDone. SEO titles and descriptions updated in Shopify Admin.');
