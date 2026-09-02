#!/usr/bin/env node
/**
 * Update Shopify Admin store contact email and refresh key SEO/content.
 * Usage: node scripts/update-store-settings.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || process.env.SHOPIFY_FLAG_STORE || process.env.SHOPIFY_STORE;
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';
const SCOPES = 'write_content,read_content,write_shop';
const EMAIL = 'nerocasamarbles@gmail.com';
const INSTAGRAM = 'https://www.instagram.com/ncmarbles/';

if (!store) {
  console.error('\nUsage: node scripts/update-store-settings.mjs <store>.myshopify.com\n');
  process.exit(1);
}

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
  const dir = mkdtempSync(join(tmpdir(), 'nc-store-settings-'));
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

console.log(`Updating store settings on ${store} ...\n`);
ensureAuth();

// Shop contact email cannot be updated via Store GraphQL execute API — set manually in
// Admin → Settings → Store details → Store contact email: nerocasamarbles@gmail.com
console.log('  · shop contact email: set manually in Admin → Settings → Store details');

const seoMutation = `mutation SeoMetafields($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields { key namespace value }
    userErrors { message }
  }
}`;

const pages = execute(`query {
  pages(first: 50) { nodes { id handle title } }
}`).pages.nodes;

const pageSeo = {
  custom: {
    title: 'Custom Marble Furniture | Made to Your Design | NEROCASA',
    description:
      'Commission custom marble furniture in any stone, size or design. Custom tables and surfaces crafted from premium natural stone by NEROCASA.',
  },
  contact: {
    title: 'Contact NEROCASA | Luxury Marble Furniture',
    description: `Contact NEROCASA at ${EMAIL} for luxury marble furniture, custom stone pieces and project enquiries.`,
  },
};

for (const page of pages) {
  const seo = pageSeo[page.handle];
  if (!seo) continue;
  const result = execute(
    seoMutation,
    {
      metafields: [
        { ownerId: page.id, namespace: 'global', key: 'title_tag', type: 'single_line_text_field', value: seo.title },
        { ownerId: page.id, namespace: 'global', key: 'description_tag', type: 'single_line_text_field', value: seo.description },
      ],
    },
    true,
  );
  const errors = result.metafieldsSet?.userErrors || [];
  if (errors.length) console.log(`  ✗ page ${page.handle}: ${errors.map((e) => e.message).join('; ')}`);
  else console.log(`  + page SEO ${page.handle}`);
}

const blogs = execute(`query { blogs(first: 10) { nodes { id handle articles(first: 20) { nodes { id handle title } } } } }`).blogs.nodes;
const journal = blogs.find((b) => b.handle === 'journal');
if (journal) {
  const article = journal.articles.nodes.find((a) => a.handle === 'bespoke-marble-furniture-guide');
  if (article) {
    const update = execute(
      `mutation ArticleUpdate($id: ID!, $article: ArticleUpdateInput!) {
        articleUpdate(id: $id, article: $article) {
          article { handle title }
          userErrors { message }
        }
      }`,
      {
        id: article.id,
        article: {
          title: 'Custom Marble Furniture: From Brief to Delivery',
          body: `<p>Beyond our catalog, NEROCASA creates custom marble furniture for private clients, designers and hospitality projects.</p><p>For custom enquiries, visit our <a href="/pages/custom">custom page</a> or reach us on WhatsApp.</p>`,
        },
      },
      true,
    );
    const errors = update.articleUpdate?.userErrors || [];
    if (errors.length) console.log(`  ✗ journal article: ${errors.map((e) => e.message).join('; ')}`);
    else console.log('  + journal article updated (custom wording)');
  }
}

console.log(`\nDone.`);
console.log(`- Store contact email target: ${EMAIL}`);
console.log(`- Instagram (theme setting): ${INSTAGRAM}`);
