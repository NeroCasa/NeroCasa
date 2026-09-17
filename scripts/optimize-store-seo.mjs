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
  soglia: {
    seoTitle: 'Soglia Marble Coffee Table Pair | UAE | NEROCASA',
    seoDescription:
      'Made-to-order pair of marble coffee tables from our Sharjah factory. Ibiza White, Armani Grey, Travertine or Rosso Levanto. Delivered across the UAE.',
    descriptionHtml:
      '<p>Soglia is a sculptural marble coffee table sold as a matching pair. Available in Ibiza White, Armani Grey, Travertine and Rosso Levanto, each piece is cut in our Sharjah factory and delivered across the UAE.</p>',
  },
  equilibrio: {
    seoTitle: 'Equilibrio Marble Coffee Table | UAE | NEROCASA',
    seoDescription:
      'Equilibrio marble coffee table, made to order in Sharjah. Ibiza White, Armani Grey or Travertine. Delivered across the UAE.',
    descriptionHtml:
      '<p>Equilibrio is a marble coffee table that balances mass and lightness. Choose Ibiza White, Armani Grey or Travertine. Cut in Sharjah Industrial Area 15 and delivered across the UAE.</p>',
  },
  monolite: {
    seoTitle: 'Monolite Marble Coffee Table | UAE | NEROCASA',
    seoDescription:
      'Monolite marble coffee table in Ibiza White, Travertine or Rosso Levanto. Made to order in Sharjah and delivered across the UAE.',
    descriptionHtml:
      '<p>Monolite is a bold marble coffee table in Ibiza White, Travertine or Rosso Levanto. Cut in our Sharjah factory for homes and projects across the UAE.</p>',
  },
  galleria: {
    seoTitle: 'Galleria Marble Console Table | UAE | NEROCASA',
    seoDescription:
      'Galleria marble console for hallways and entries. Ibiza White, Armani Grey or Travertine. Made in Sharjah, delivered across the UAE.',
    descriptionHtml:
      '<p>Galleria is an architectural marble console table for entryways and living spaces. Finished in Ibiza White, Armani Grey or Travertine in our Sharjah factory. Delivery across the UAE.</p>',
  },
  passaggio: {
    seoTitle: 'Passaggio Marble Console Table | UAE | NEROCASA',
    seoDescription:
      'Passaggio slim marble console in Ibiza White, Armani Grey or Travertine. Made to order in Sharjah, delivered across the UAE.',
    descriptionHtml:
      '<p>Passaggio is a slim marble console for hallways and interiors. Hand-finished in Ibiza White, Armani Grey or Travertine at our Sharjah factory. We deliver across the UAE.</p>',
  },
  atrio: {
    seoTitle: 'Atrio Marble Console Table | UAE | NEROCASA',
    seoDescription:
      'Atrio statement marble console in Ibiza White, Armani Grey or Travertine. Made in Sharjah and delivered across the UAE.',
    descriptionHtml:
      '<p>Atrio is a statement marble console for foyers and living areas. Available in Ibiza White, Armani Grey and Travertine. Cut in Sharjah Industrial Area 15, delivered UAE-wide.</p>',
  },
  nodo: {
    seoTitle: 'Nodo Marble Side Table | UAE | NEROCASA',
    seoDescription:
      'Nodo marble side table in Ibiza White, Armani Grey or Travertine. Compact made-to-order stone from Sharjah, delivered across the UAE.',
    descriptionHtml:
      '<p>Nodo is a compact marble side table for sofas, bedsides and seating. Finished in Ibiza White, Armani Grey or Travertine in Sharjah. Delivery across the UAE.</p>',
  },
  punto: {
    seoTitle: 'Punto Marble Side Table | UAE | NEROCASA',
    seoDescription:
      'Punto marble side table in Ibiza White, Armani Grey or Travertine. Made to order in Sharjah and delivered across the UAE.',
    descriptionHtml:
      '<p>Punto is a refined marble side table in Ibiza White, Armani Grey or Travertine. Cut in our Sharjah factory for interiors across the UAE.</p>',
  },
  scalino: {
    seoTitle: 'Scalino Marble Side Table | UAE | NEROCASA',
    seoDescription:
      'Scalino layered marble side table in Ibiza White, Armani Grey or Travertine. Made in Sharjah, delivered across the UAE.',
    descriptionHtml:
      '<p>Scalino is a layered marble side table for living rooms and hospitality. Available in Ibiza White, Armani Grey and Travertine from our Sharjah factory. UAE delivery.</p>',
  },
};
PRODUCTS['cft-1'] = PRODUCTS.soglia;
PRODUCTS['cft-2'] = PRODUCTS.equilibrio;
PRODUCTS['cft-3'] = PRODUCTS.monolite;
PRODUCTS['cs-1'] = PRODUCTS.galleria;
PRODUCTS['cs-2'] = PRODUCTS.passaggio;
PRODUCTS['cs-3'] = PRODUCTS.atrio;
PRODUCTS['sd-1'] = PRODUCTS.nodo;
PRODUCTS['sd-2'] = PRODUCTS.punto;
PRODUCTS['sd-3'] = PRODUCTS.scalino;

const COLLECTIONS = {
  'coffee-tables': {
    seoTitle: 'Marble Coffee Tables UAE | Made to Order | NEROCASA',
    seoDescription:
      'Soglia, Equilibrio and Monolite marble coffee tables. Made to order in Sharjah Industrial Area 15 and delivered across the UAE.',
    descriptionHtml:
      '<p>Marble coffee tables from The 9: Soglia, Equilibrio and Monolite. Cut in our Sharjah factory in Ibiza White, Armani Grey, Travertine and Rosso Levanto. Delivery across the UAE.</p>',
  },
  'side-tables': {
    seoTitle: 'Marble Side Tables UAE | Made to Order | NEROCASA',
    seoDescription:
      'Nodo, Punto and Scalino marble side tables. Made in Sharjah and delivered across the UAE.',
    descriptionHtml:
      '<p>Marble side tables Nodo, Punto and Scalino in Ibiza White, Armani Grey and Travertine. Made in Sharjah Industrial Area 15. UAE delivery.</p>',
  },
  'console-tables': {
    seoTitle: 'Marble Console Tables UAE | Hall Furniture | NEROCASA',
    seoDescription:
      'Galleria, Passaggio and Atrio marble consoles for entries and halls. Made in Sharjah, delivered across the UAE.',
    descriptionHtml:
      '<p>Marble console tables for hallways and foyers. Galleria, Passaggio and Atrio, cut in Sharjah and delivered across the UAE.</p>',
  },
  'the-9': {
    seoTitle: 'The 9 | Marble Furniture UAE | NEROCASA',
    seoDescription:
      'Nine made-to-order marble designs from our Sharjah factory. Coffee, side and console tables, delivered across the UAE.',
    descriptionHtml:
      '<p>The 9 is NeroCasa’s marble furniture collection: coffee, side and console tables made in Sharjah Industrial Area 15 and delivered across the UAE.</p>',
  },
};

const PAGES = {
  'why-nerocasa': {
    seoTitle: 'Why NEROCASA | Marble Factory Sharjah UAE',
    seoDescription:
      'NEROCASA cuts marble furniture in Sharjah Industrial Area 15 and delivers across the UAE. Made to order, no showroom markup.',
  },
  contact: {
    seoTitle: 'Contact NEROCASA | Sharjah Factory | UAE',
    seoDescription:
      'WhatsApp, email or call NEROCASA. Factory in Sharjah Industrial Area 15. We sell and deliver marble furniture across the UAE. No showroom.',
  },
  custom: {
    seoTitle: 'Custom Marble Furniture UAE | Made to Order | NEROCASA',
    seoDescription:
      'Commission custom marble furniture from our Sharjah factory. Any stone, size or design, delivered across the UAE.',
  },
  b2b: {
    seoTitle: 'B2B Marble Furniture UAE | Trade and Hospitality',
    seoDescription:
      'Trade and hospitality marble furniture from our Sharjah factory. Production for architects and designers, delivered across the UAE.',
  },
  terms: {
    seoTitle: 'Terms and Conditions | NEROCASA',
    seoDescription: 'Terms for buying made-to-order marble furniture from NEROCASA in the UAE.',
  },
  refunds: {
    seoTitle: 'Refunds and Returns | NEROCASA',
    seoDescription: 'Made-to-order marble furniture refunds and returns for NEROCASA orders in the UAE.',
  },
  'track-order': {
    seoTitle: 'Track Your Order UAE | NEROCASA',
    seoDescription: 'Track your NEROCASA marble furniture order. White-glove delivery across the UAE, typically 3 to 7 working days.',
  },
  collections: {
    seoTitle: 'Marble Furniture Collections UAE | NEROCASA',
    seoDescription:
      'The 9 marble collection. Coffee, side and console tables made in Sharjah and delivered across the UAE.',
  },
  privacy: {
    seoTitle: 'Privacy Policy | NEROCASA',
    seoDescription:
      'How NEROCASA collects and uses personal information when you shop for marble furniture in the UAE.',
  },
};

const ARTICLES = {
  'how-to-choose-luxury-marble-coffee-table': {
    seoTitle: 'How to Choose a Marble Coffee Table UAE | NEROCASA',
    seoDescription:
      'Scale, stone and silhouette for a marble coffee table in a UAE living room. From the NEROCASA Sharjah factory.',
  },
  'ibiza-white-vs-armani-grey-vs-travertine': {
    seoTitle: 'Ibiza White vs Armani Grey vs Travertine | NEROCASA',
    seoDescription:
      'Three signature marbles, three distinct moods. Compare colour, veining and character to find the finish that suits your interior.',
  },
  'marble-console-tables-entryway-guide': {
    seoTitle: 'Marble Console Tables for Entryways UAE | NEROCASA',
    seoDescription:
      'How to choose and style a marble console table for an entryway or hallway, from proportion to finish.',
  },
  'caring-for-marble-furniture-at-home': {
    seoTitle: 'How to Care for Marble Furniture at Home | NEROCASA',
    seoDescription:
      'Natural stone rewards simple, consistent care. A practical guide to keeping marble furniture looking its best at home.',
  },
  'bespoke-marble-furniture-guide': {
    seoTitle: 'Custom Marble Furniture: Brief to Delivery | NEROCASA',
    seoDescription:
      'How a bespoke marble commission works, from the first conversation through to installation in your home.',
  },
  'italian-marble-in-modern-interiors': {
    seoTitle: 'Italian Marble in Modern Interiors | NEROCASA',
    seoDescription:
      'Marble is ancient, yet in contemporary rooms it feels more relevant than ever. A look at stone in modern design.',
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

const blogs = execute(`query {
  blogs(first: 10) {
    nodes { handle articles(first: 50) { nodes { id handle } } }
  }
}`).blogs.nodes;

for (const blog of blogs) {
  for (const article of blog.articles.nodes) {
    const seo = ARTICLES[article.handle];
    if (!seo) continue;
    const result = execute(
      pageMetafieldMutation,
      {
        metafields: [
          {
            ownerId: article.id,
            namespace: 'global',
            key: 'title_tag',
            type: 'single_line_text_field',
            value: seo.seoTitle,
          },
          {
            ownerId: article.id,
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
      console.log(`  ✗ article ${article.handle}: ${errors.map((e) => e.message).join('; ')}`);
    } else {
      console.log(`  + article ${article.handle}`);
    }
  }
}

console.log('\nDone. SEO titles and descriptions updated in Shopify Admin.');
