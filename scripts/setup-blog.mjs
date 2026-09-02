#!/usr/bin/env node
/**
 * Create NEROCASA Journal blog with SEO-optimized launch articles.
 * Usage: node scripts/setup-blog.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const store = process.argv[2] || process.env.SHOPIFY_FLAG_STORE || process.env.SHOPIFY_STORE;
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';
const SCOPES = 'write_content,read_content,write_files';
const BLOG_HANDLE = 'journal';
const LOGO_ASSET = 'nerocasa-brand-logo.jpg';

const ARTICLES = [
  {
    handle: 'how-to-choose-luxury-marble-coffee-table',
    title: 'How to Choose a Luxury Marble Coffee Table',
    tags: ['Coffee Tables', 'Buying Guide', 'Marble'],
    seoTitle: 'How to Choose a Luxury Marble Coffee Table | NEROCASA Journal',
    seoDescription:
      'A practical guide to choosing a luxury marble coffee table: scale, stone finishes, room placement and Italian design from NEROCASA.',
    summary:
      'Scale, stone and silhouette: what to look for when choosing a luxury marble coffee table for a refined living room.',
    bodyHtml: `<p>A marble coffee table should feel inevitable in the room: sculptural, calm and unmistakably premium. Before choosing a design, consider three things: proportion, stone character and how the piece will be used day to day.</p>
<h2>Start with scale</h2>
<p>The table should sit comfortably within your seating layout. As a guide, aim for roughly two thirds the length of your sofa and a height close to the seat cushions. Our <a href="/products/cft-1">Soglia</a>, <a href="/products/cft-2">Equilibrio</a> and <a href="/products/cft-3">Monolite</a> designs cover distinct silhouettes from refined minimal to bold monolithic form.</p>
<h2>Choose your marble finish</h2>
<p>Ibiza White brings luminous clarity. Armani Grey adds depth and architectural restraint. Travertine introduces warmth and texture. For a statement centre piece, Rosso Levanto on Monolite delivers rich colour with gallery-level presence. Browse the full <a href="/collections/coffee-tables">coffee table collection</a> to compare finishes.</p>
<h2>Think long term</h2>
<p>Natural stone develops character over time. Select a design with honest material expression and a finish you will still admire in ten years. That is the difference between trend-led furniture and true luxury.</p>`,
  },
  {
    handle: 'ibiza-white-vs-armani-grey-vs-travertine',
    title: 'Ibiza White vs Armani Grey vs Travertine: A Buyer\'s Guide',
    tags: ['Marble', 'Materials', 'Buying Guide'],
    seoTitle: 'Ibiza White vs Armani Grey vs Travertine | NEROCASA Journal',
    seoDescription:
      'Compare Ibiza White, Armani Grey and Travertine marble finishes for luxury furniture. Tone, veining and interior pairings explained by NEROCASA.',
    summary:
      'Three signature marbles, three distinct moods. Learn which finish suits your interior.',
    bodyHtml: `<p>Every NEROCASA piece is available in a curated selection of Italian marbles. These three finishes appear across our <a href="/collections/coffee-tables">coffee tables</a>, <a href="/collections/console-tables">console tables</a> and <a href="/collections/side-tables">side tables</a>, each bringing a different atmosphere to the room.</p>
<h2>Ibiza White</h2>
<p>Clean, bright and quietly luxurious. Ibiza White suits contemporary interiors, neutral palettes and spaces where you want stone to feel fresh rather than heavy. Ideal for open-plan living rooms and light-filled apartments.</p>
<h2>Armani Grey</h2>
<p>Cool, refined and architectural. Armani Grey pairs beautifully with charcoal upholstery, brushed metal and monochrome schemes. It reads as modern luxury without feeling cold when balanced with warm lighting and texture.</p>
<h2>Travertine</h2>
<p>Warm, tactile and timeless. Travertine adds organic movement and a softer presence than polished white marble. It works exceptionally well in Mediterranean, warm minimal and boutique hotel-inspired interiors.</p>
<h2>Which should you choose?</h2>
<p>Match the stone to the room's light and mood. Bright spaces often favour Ibiza White. Structured, urban interiors suit Armani Grey. Warm, layered rooms come alive with Travertine. For a deeper red tone, explore Rosso Levanto on selected designs such as <a href="/products/cft-3">Monolite</a>.</p>`,
  },
  {
    handle: 'marble-console-tables-entryway-guide',
    title: 'Marble Console Tables for Entryways and Hallways',
    tags: ['Console Tables', 'Interior Design', 'Marble'],
    seoTitle: 'Marble Console Tables for Entryways | NEROCASA Journal',
    seoDescription:
      'How to style luxury marble console tables in entryways and hallways. Galleria, Passaggio and Atrio by NEROCASA explained.',
    summary:
      'The right console table sets the tone from the moment you arrive home.',
    bodyHtml: `<p>An entryway console is the first impression of your home. In marble, it signals taste, permanence and attention to material quality before a guest reaches the living room.</p>
<h2>Proportion in narrow spaces</h2>
<p>Hallways and foyers need furniture that feels generous without blocking flow. Slim profiles such as <a href="/products/cs-2">Passaggio</a> work well in tighter corridors, while <a href="/products/cs-1">Galleria</a> and <a href="/products/cs-3">Atrio</a> suit wider entries where you can layer art, sculpture or lighting above.</p>
<h2>Stone as a design anchor</h2>
<p>Because marble carries visual weight, a console can anchor an otherwise minimal space. Keep styling restrained: one object, a low bowl, a single stem or a framed print. Let the stone be the story.</p>
<h2>Finishes for entry light</h2>
<p>North-facing or low-light entries often benefit from Ibiza White or Travertine to avoid feeling closed in. Armani Grey is exceptional in dramatic, gallery-like foyers with strong architectural lighting. Explore all <a href="/collections/console-tables">marble console tables</a>.</p>`,
  },
  {
    handle: 'caring-for-marble-furniture-at-home',
    title: 'Caring for Marble Furniture at Home',
    tags: ['Care Guide', 'Marble', 'Luxury Living'],
    seoTitle: 'How to Care for Marble Furniture | NEROCASA Journal',
    seoDescription:
      'Expert tips for caring for luxury marble furniture at home. Cleaning, protection and everyday use from the NEROCASA workshop.',
    summary:
      'Natural stone rewards simple, consistent care. Here is how to keep marble looking its best.',
    bodyHtml: `<p>Marble is a living material. Light veining, subtle variation and a fine patina over time are signs of authenticity, not imperfection. With straightforward care, your table will look exceptional for decades.</p>
<h2>Daily use</h2>
<p>Use coasters under glasses and placemats under hot items. Wipe spills promptly, especially from wine, coffee or citrus, which can etch the surface if left standing.</p>
<h2>Cleaning</h2>
<p>Dust with a soft cloth and clean with a pH-neutral stone cleaner or mild soap diluted in warm water. Avoid vinegar, bleach and abrasive pads. Dry the surface after cleaning to prevent water marks.</p>
<h2>Protection</h2>
<p>Professional sealing can reduce porosity depending on the finish. In high-use settings, consider felt pads under decorative objects and rotate styling pieces occasionally to avoid uneven wear.</p>
<h2>Embrace character</h2>
<p>Small marks and a gentle evolution of the surface are part of living with real stone. That honesty is what separates mass-produced furniture from premium marble pieces crafted in our workshop.</p>`,
  },
  {
    handle: 'bespoke-marble-furniture-guide',
    title: 'Custom Marble Furniture: From Brief to Delivery',
    tags: ['Custom', 'Marble', 'Commissions'],
    seoTitle: 'Custom Marble Furniture Guide | NEROCASA Journal',
    seoDescription:
      'Commission custom marble furniture with NEROCASA: stone selection, dimensions, design adaptation and white-glove delivery explained.',
    summary:
      'How custom marble commissions work, from first conversation to installation.',
    bodyHtml: `<p>Beyond our catalog, NEROCASA creates custom marble furniture for private clients, designers and hospitality projects. Commissions may adapt an existing design, resize a piece for a specific room or develop something entirely new in stone.</p>
<h2>Start with the space</h2>
<p>Share floor plans, reference images and the mood you want the piece to create. If you love a catalog silhouette, designs such as <a href="/products/cft-1">Soglia</a> or <a href="/products/cs-3">Atrio</a> can often be reinterpreted in a different marble or dimension.</p>
<h2>Stone selection</h2>
<p>We source premium marbles from Italy and beyond. Ibiza White, Armani Grey, Travertine and Rosso Levanto are among our most requested finishes, but custom projects can explore other slabs based on availability and your brief.</p>
<h2>Process and delivery</h2>
<p>Once the configuration is confirmed, our workshop handles cutting, finishing and quality control in house. Delivery is coordinated with white-glove care. For custom enquiries, visit our <a href="/pages/custom">custom page</a> or reach us on WhatsApp to begin.</p>`,
  },
  {
    handle: 'italian-marble-in-modern-interiors',
    title: 'Why Italian Marble Belongs in Modern Interiors',
    tags: ['Interior Design', 'Marble', 'Luxury Living'],
    seoTitle: 'Italian Marble in Modern Interiors | NEROCASA Journal',
    seoDescription:
      'Why Italian marble remains the ultimate luxury material for modern interiors. Design ideas for coffee tables, consoles and side tables by NEROCASA.',
    summary:
      'Marble is ancient. In modern rooms, it feels more relevant than ever.',
    bodyHtml: `<p>Modern interiors often chase novelty. Marble does the opposite. It connects a room to permanence, craft and the natural world, which is exactly why it continues to define luxury furniture.</p>
<h2>Material honesty</h2>
<p>In an era of synthetic surfaces, real stone stands out. Veining, tone shift and tactile depth give each piece individuality. That is particularly powerful in minimal spaces where every object is visible.</p>
<h2>Sculptural furniture</h2>
<p>Contemporary design favours strong silhouettes. Marble adds gravity to those forms. A monolithic coffee table such as <a href="/products/cft-3">Monolite</a> can anchor an entire seating area, while side tables like <a href="/products/sd-2">Punto</a> provide precise accents without clutter.</p>
<h2>Layering stone through a home</h2>
<p>Consider marble at multiple scales: a console in the entry, a coffee table in the living room and side tables beside seating. Repeating the material creates cohesion while varying the design keeps the story interesting. Explore the full <a href="/pages/collections">NEROCASA collections</a> to build a coherent stone palette throughout your home.</p>`,
  },
];

if (!store) {
  console.error('\nUsage: node scripts/setup-blog.mjs <store>.myshopify.com\n');
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
  const dir = mkdtempSync(join(tmpdir(), 'nc-blog-'));
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

function getLogoAssetUrl() {
  const themeId = '161950105824';
  const shopHost = store.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `https://${shopHost}/cdn/shop/t/${themeId}/assets/${LOGO_ASSET}`;
}

async function uploadLogoUrl() {
  const logoPath = join(__dirname, '..', 'assets', LOGO_ASSET);
  const buffer = readFileSync(logoPath);
  const staged = execute(
    `mutation Staged($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets { url resourceUrl parameters { name value } }
        userErrors { message }
      }
    }`,
    {
      input: [{
        filename: LOGO_ASSET,
        mimeType: 'image/jpeg',
        resource: 'FILE',
        fileSize: String(buffer.length),
        httpMethod: 'POST',
      }],
    },
    true,
  );
  const target = staged.stagedUploadsCreate?.stagedTargets?.[0];
  if (!target) throw new Error('Staged upload failed');

  const form = new FormData();
  for (const param of target.parameters) form.append(param.name, param.value);
  form.append('file', new Blob([buffer], { type: 'image/jpeg' }), LOGO_ASSET);
  const uploadRes = await fetch(target.url, { method: 'POST', body: form });
  if (!uploadRes.ok) throw new Error(`Logo upload failed (${uploadRes.status})`);

  const created = execute(
    `mutation FileCreate($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files {
          ... on MediaImage { image { url } }
          ... on GenericFile { url }
        }
        userErrors { message }
      }
    }`,
    {
      files: [{
        alt: 'NEROCASA',
        contentType: 'IMAGE',
        originalSource: target.resourceUrl,
      }],
    },
    true,
  );
  const errors = created.fileCreate?.userErrors || [];
  if (errors.length) throw new Error(errors.map((e) => e.message).join('; '));
  const file = created.fileCreate?.files?.[0];
  return file?.image?.url || file?.url || null;
}

async function main() {
console.log(`Setting up Journal blog on ${store} ...\n`);
ensureAuth();

let blogId;
const blogs = execute(`query { blogs(first: 20) { nodes { id handle title } } }`).blogs.nodes;
const existing = blogs.find((b) => b.handle === BLOG_HANDLE);
if (existing) {
  blogId = existing.id;
  console.log(`  ✓ blog "${BLOG_HANDLE}" already exists`);
} else {
  const created = execute(
    `mutation CreateBlog($blog: BlogCreateInput!) {
      blogCreate(blog: $blog) {
        blog { id handle title }
        userErrors { message }
      }
    }`,
    {
      blog: {
        title: 'Journal',
        handle: BLOG_HANDLE,
        commentPolicy: 'CLOSED',
      },
    },
    true,
  );
  const errors = created.blogCreate?.userErrors || [];
  if (errors.length) {
    console.error(`  ✗ blog create: ${errors.map((e) => e.message).join('; ')}`);
    process.exit(1);
  }
  blogId = created.blogCreate.blog.id;
  console.log(`  + blog "${BLOG_HANDLE}" created`);
}

const existingArticles = execute(`query($id: ID!) {
  blog(id: $id) { articles(first: 50) { nodes { handle title id } } }
}`, { id: blogId }).blog.articles.nodes;

const articleCreateMutation = `mutation CreateArticle($article: ArticleCreateInput!) {
  articleCreate(article: $article) {
    article { id handle title }
    userErrors { message }
  }
}`;

const seoMutation = `mutation ArticleSeo($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields { key namespace value }
    userErrors { message }
  }
}`;

const articleImageMutation = `mutation ArticleImage($id: ID!, $article: ArticleUpdateInput!) {
  articleUpdate(id: $id, article: $article) {
    article { handle image { url } }
    userErrors { message }
  }
}`;

const logoAssetUrl = getLogoAssetUrl();
let articleImageUrl = logoAssetUrl;
try {
  const uploaded = await uploadLogoUrl();
  if (uploaded) {
    articleImageUrl = uploaded;
    console.log(`  → article image uploaded: ${uploaded}`);
  } else {
    console.log('  ! logo upload returned no URL; theme displays nerocasa-brand-logo.jpg on articles');
    articleImageUrl = '';
  }
} catch (error) {
  console.log(`  ! logo upload skipped: ${error.message}`);
  console.log('  → theme displays nerocasa-brand-logo.jpg on articles');
  articleImageUrl = '';
}

for (const article of ARTICLES) {
  let articleId;
  const found = existingArticles.find((a) => a.handle === article.handle);
  if (found) {
    articleId = found.id;
    console.log(`  ✓ article "${article.handle}" already exists`);
  } else {
    const created = execute(
      articleCreateMutation,
      {
        article: {
          blogId,
          title: article.title,
          handle: article.handle,
          body: article.bodyHtml,
          summary: article.summary,
          tags: article.tags,
          isPublished: true,
          author: { name: 'NEROCASA' },
        },
      },
      true,
    );
    const errors = created.articleCreate?.userErrors || [];
    if (errors.length) {
      console.log(`  ✗ article ${article.handle}: ${errors.map((e) => e.message).join('; ')}`);
      continue;
    }
    articleId = created.articleCreate.article.id;
    console.log(`  + article "${article.handle}"`);
  }

  const seoResult = execute(
    seoMutation,
    {
      metafields: [
        {
          ownerId: articleId,
          namespace: 'global',
          key: 'title_tag',
          type: 'single_line_text_field',
          value: article.seoTitle,
        },
        {
          ownerId: articleId,
          namespace: 'global',
          key: 'description_tag',
          type: 'single_line_text_field',
          value: article.seoDescription,
        },
      ],
    },
    true,
  );
  const seoErrors = seoResult.metafieldsSet?.userErrors || [];
  if (seoErrors.length) {
    console.log(`  ✗ SEO ${article.handle}: ${seoErrors.map((e) => e.message).join('; ')}`);
  }

  if (!articleImageUrl) continue;

  const imageResult = execute(
    articleImageMutation,
    {
      id: articleId,
      article: {
        image: {
          url: articleImageUrl,
          altText: 'NEROCASA',
        },
      },
    },
    true,
  );
  const imageErrors = imageResult.articleUpdate?.userErrors || [];
  if (imageErrors.length) {
    console.log(`  ✗ image ${article.handle}: ${imageErrors.map((e) => e.message).join('; ')}`);
  } else if (articleImageUrl.includes('cdn.shopify.com/s/files/')) {
    console.log(`  + image ${article.handle}`);
  }
}

const blogSeo = execute(
  seoMutation,
  {
    metafields: [
      {
        ownerId: blogId,
        namespace: 'global',
        key: 'title_tag',
        type: 'single_line_text_field',
        value: 'NEROCASA Journal | Luxury Marble & Design',
      },
      {
        ownerId: blogId,
        namespace: 'global',
        key: 'description_tag',
        type: 'single_line_text_field',
        value:
          'Guides on luxury marble furniture, Italian stone finishes, interior styling and custom commissions from NEROCASA.',
      },
    ],
  },
  true,
);
const blogSeoErrors = blogSeo.metafieldsSet?.userErrors || [];
if (blogSeoErrors.length) {
  console.log(`  ✗ blog SEO: ${blogSeoErrors.map((e) => e.message).join('; ')}`);
} else {
  console.log('  + blog SEO updated');
}

console.log(`\nDone. Journal live at /blogs/${BLOG_HANDLE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
