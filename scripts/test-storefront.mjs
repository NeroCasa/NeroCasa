/**
 * Storefront integrity checks. No extra packages.
 * Run: node scripts/test-storefront.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let failed = 0;

function ok(cond, msg) {
  if (cond) console.log('ok  ' + msg);
  else {
    failed += 1;
    console.error('FAIL ' + msg);
  }
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

const theme = read('layout/theme.liquid');
ok(!/fonts\.googleapis\.com/.test(theme), 'theme.liquid does not load Google Fonts');
ok(!/nerocasa-additions\.css/.test(theme), 'theme.liquid does not load additions.css');
ok(!/nerocasa-luxury\.css/.test(theme), 'theme.liquid does not load luxury.css');
ok(/nerocasa\.css/.test(theme), 'theme.liquid loads unified nerocasa.css');
ok(/content_for_header/.test(theme), 'theme.liquid keeps content_for_header');

ok(exists('assets/nerocasa.css.liquid'), 'unified CSS liquid exists');
ok(!exists('assets/nerocasa-additions.css'), 'additions.css removed');
ok(!exists('assets/nerocasa-luxury.css'), 'luxury.css removed');

[
  'cormorant-garamond-latin-300-normal.woff2',
  'cormorant-garamond-latin-400-normal.woff2',
  'cormorant-garamond-latin-500-normal.woff2',
  'cormorant-garamond-latin-300-italic.woff2',
  'cormorant-garamond-latin-400-italic.woff2',
  'inter-latin-400-normal.woff2',
  'inter-latin-500-normal.woff2',
].forEach(function (file) {
  ok(exists('assets/' + file), 'font ' + file);
});

const css = read('assets/nerocasa.css.liquid');
ok(/object-fit:\s*contain/.test(css), 'PDP contain remains in CSS');
ok(/--nc-gold/.test(css), 'gold token remains');

const b2b = read('sections/ncs-b2b.liquid');
ok(/b2b-enquiry/.test(b2b), 'B2B form tag b2b-enquiry');
ok(/form 'contact'/.test(b2b), 'B2B uses native contact form');

const js = read('assets/nerocasa.js');
ok(/\/cart\/add\.js/.test(js), 'AJAX cart add remains');

const locales = JSON.parse(read('locales/en.default.json'));
ok(locales.nav && locales.nav.custom === 'Custom', 'locales keep Custom nav label');
ok(locales.actions && locales.actions.our_collection === 'Our collection', 'locales keep Our collection');

const product = read('sections/ncs-product.liquid');
ok(/buy\.hidden=!!isCustom/.test(product) || /isCustom/.test(product), 'custom size still referenced on PDP');

const collections = read('sections/ncs-collections-index.liquid');
ok(!/ncs-collections-list--featured/.test(collections), 'collections index is not the featured 3-up split');
ok(!/quiet:\s*true/.test(collections), 'collections index keeps marble hero');
ok(/the_9_coll/.test(collections), 'collections index still renders The 9');
const indexElse = collections.split('{%- else -%}')[1] || '';
ok(/the_9_coll/.test(indexElse) && !/coffee_coll/.test(indexElse), 'index else branch is The 9 only');

const blog = read('sections/ncs-blog.liquid');
ok(/fallback_slabs/.test(blog), 'journal cards have media fallback');

ok(exists('.cursor/rules/always-use-skills.mdc'), 'always-use-skills rule exists');

if (failed) {
  console.error('\n' + failed + ' check(s) failed');
  process.exit(1);
}
console.log('\nall checks passed');
