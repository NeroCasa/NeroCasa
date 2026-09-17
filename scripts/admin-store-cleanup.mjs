/**
 * Admin cleanup: name-based product URLs, redirects, duplicate collections page,
 * empty News blog, shipping label, page titles, journal images.
 * Usage: node scripts/admin-store-cleanup.mjs zhjbdz-yw.myshopify.com
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || 'zhjbdz-yw.myshopify.com';
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';
const SCOPES = [
  'read_products',
  'write_products',
  'read_content',
  'write_content',
  'write_online_store_navigation',
  'write_files',
  'read_shipping',
  'write_shipping',
].join(',');

const HANDLE_MAP = {
  'cft-1': 'soglia',
  'cft-2': 'equilibrio',
  'cft-3': 'monolite',
  'cs-1': 'galleria',
  'cs-2': 'passaggio',
  'cs-3': 'atrio',
  'sd-1': 'nodo',
  'sd-2': 'punto',
  'sd-3': 'scalino',
};

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-admin-'));
  writeFileSync(join(dir, 'q.graphql'), query, 'utf8');
  const args = ['store', 'execute', '--store', store, '--query-file', join(dir, 'q.graphql'), '--json'];
  if (variables) {
    writeFileSync(join(dir, 'v.json'), JSON.stringify(variables), 'utf8');
    args.push('--variable-file', join(dir, 'v.json'));
  }
  if (allowMutations) args.push('--allow-mutations');
  try {
    return JSON.parse(
      execFileSync(shopifyCmd, args, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: isWin,
        env: { ...process.env, SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:none|p:none|m:cursor-grok-4.6' },
      }),
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function errs(payload, key) {
  const list = payload?.[key]?.userErrors || [];
  if (list.length) throw new Error(key + ': ' + list.map((e) => e.message).join('; '));
}

console.log('Auth ' + store);
execFileSync(shopifyCmd, ['store', 'auth', '--store', store, '--scopes', SCOPES], {
  stdio: 'inherit',
  shell: isWin,
  env: { ...process.env, SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:none|p:none|m:cursor-grok-4.6' },
});

const products = execute(`query { products(first: 50) { nodes { id handle title featuredMedia { preview { image { url } } } } } }`).products.nodes;
const imageByOld = {};
for (const p of products) {
  imageByOld[p.handle] = p.featuredMedia?.preview?.image?.url || '';
}

for (const product of products) {
  const next = HANDLE_MAP[product.handle];
  if (!next) continue;
  console.log('handle', product.handle, '->', next);
  const updated = execute(
    `mutation ($input: ProductInput!) {
      productUpdate(input: $input) {
        product { handle }
        userErrors { message }
      }
    }`,
    { input: { id: product.id, handle: next } },
    true,
  );
  errs(updated, 'productUpdate');
  try {
    const redir = execute(
      `mutation ($urlRedirect: UrlRedirectInput!) {
        urlRedirectCreate(urlRedirect: $urlRedirect) {
          urlRedirect { id }
          userErrors { message }
        }
      }`,
      { urlRedirect: { path: '/products/' + product.handle, target: '/products/' + next } },
      true,
    );
    const rErr = redir.urlRedirectCreate?.userErrors || [];
    if (rErr.length) console.log('  redirect note:', rErr.map((e) => e.message).join('; '));
    else console.log('  redirect /products/' + product.handle);
  } catch (e) {
    console.log('  redirect skipped:', e.message);
  }
}

const pages = execute(`query { pages(first: 50) { nodes { id handle title isPublished } } }`).pages.nodes;
const collectionsPage = pages.find((p) => p.handle === 'collections');
if (collectionsPage) {
  console.log('unpublish /pages/collections');
  const upd = execute(
    `mutation ($id: ID!, $page: PageUpdateInput!) {
      pageUpdate(id: $id, page: $page) {
        page { handle isPublished }
        userErrors { message field }
      }
    }`,
    { id: collectionsPage.id, page: { isPublished: false } },
    true,
  );
  errs(upd, 'pageUpdate');
  try {
    execute(
      `mutation ($urlRedirect: UrlRedirectInput!) {
        urlRedirectCreate(urlRedirect: $urlRedirect) {
          urlRedirect { id }
          userErrors { message }
        }
      }`,
      { urlRedirect: { path: '/pages/collections', target: '/collections' } },
      true,
    );
  } catch (e) {
    console.log('  collections redirect skipped:', e.message);
  }
}

const titleFixes = {
  terms: 'Terms & Conditions',
  refunds: 'Refunds',
};
for (const page of pages) {
  const title = titleFixes[page.handle];
  if (!title || page.title === title) continue;
  console.log('rename page', page.handle, '->', title);
  const upd = execute(
    `mutation ($id: ID!, $page: PageUpdateInput!) {
      pageUpdate(id: $id, page: $page) {
        page { title }
        userErrors { message }
      }
    }`,
    { id: page.id, page: { title } },
    true,
  );
  errs(upd, 'pageUpdate');
}

const blogs = execute(
  `query { blogs(first: 10) { nodes { id handle title articles(first: 20) { nodes { id handle title body } } } } }`,
).blogs.nodes;
const news = blogs.find((b) => b.handle === 'news');
if (news && (news.articles?.nodes || []).length === 0) {
  console.log('delete empty News blog');
  try {
    const del = execute(
      `mutation ($id: ID!) {
        blogDelete(id: $id) {
          deletedBlogId
          userErrors { message }
        }
      }`,
      { id: news.id },
      true,
    );
    errs(del, 'blogDelete');
  } catch (e) {
    console.log('  blog delete skipped:', e.message);
  }
}

const journal = blogs.find((b) => b.handle === 'journal');
const slabFallback = [
  imageByOld['cft-3'],
  imageByOld['cft-1'],
  imageByOld['cs-1'],
  imageByOld['sd-1'],
  imageByOld['cft-2'],
  imageByOld['cs-2'],
].filter(Boolean);
if (journal) {
  (journal.articles.nodes || []).forEach((article, i) => {
    let body = article.body || '';
    Object.entries(HANDLE_MAP).forEach(([oldH, newH]) => {
      body = body.split('/products/' + oldH).join('/products/' + newH);
    });
    const imageUrl = slabFallback[i % slabFallback.length];
    console.log('update journal', article.handle);
    const upd = execute(
      `mutation ($id: ID!, $article: ArticleUpdateInput!) {
        articleUpdate(id: $id, article: $article) {
          article { handle }
          userErrors { message }
        }
      }`,
      {
        id: article.id,
        article: {
          body,
          ...(imageUrl ? { image: { url: imageUrl, altText: article.title } } : {}),
        },
      },
      true,
    );
    errs(upd, 'articleUpdate');
  });
}

try {
  const profiles = execute(`
    query {
      deliveryProfiles(first: 5) {
        nodes {
          id
          name
          profileLocationGroups {
            locationGroup { id }
            locationGroupZones(first: 10) {
              nodes {
                zone { id }
                methodDefinitions(first: 10) {
                  nodes { id name active }
                }
              }
            }
          }
        }
      }
    }
  `);
  const methods = [];
  for (const profile of profiles.deliveryProfiles.nodes || []) {
    for (const group of profile.profileLocationGroups || []) {
      for (const zone of group.locationGroupZones.nodes || []) {
        for (const method of zone.methodDefinitions.nodes || []) {
          methods.push({
            profileId: profile.id,
            locationGroupId: group.locationGroup?.id,
            zoneId: zone.zone?.id,
            ...method,
          });
        }
      }
    }
  }
  const ship = methods.find((m) => m.name === 'NeroCasa' || m.name.toLowerCase().includes('nerocasa'));
  if (ship) {
    console.log('rename shipping', ship.name);
    const upd = execute(
      `mutation ($id: ID!, $profile: DeliveryProfileInput!) {
        deliveryProfileUpdate(id: $id, profile: $profile) {
          profile { name }
          userErrors { message }
        }
      }`,
      {
        id: ship.profileId,
        profile: {
          locationGroupsToUpdate: [
            {
              id: ship.locationGroupId,
              zonesToUpdate: [
                {
                  id: ship.zoneId,
                  methodDefinitionsToUpdate: [{ id: ship.id, name: 'Free delivery (3 to 7 working days)' }],
                },
              ],
            },
          ],
        },
      },
      true,
    );
    errs(upd, 'deliveryProfileUpdate');
  } else {
    console.log('shipping rename skipped: no NeroCasa method found');
  }
} catch (e) {
  console.log('shipping rename skipped:', e.message);
}

console.log('done');
