#!/usr/bin/env node
/**
 * Replace leftover Gmail addresses in Admin page HTML with info@nerocasa.com
 * Usage: node scripts/replace-store-email.mjs zhjbdz-yw.myshopify.com
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || 'zhjbdz-yw.myshopify.com';
const OLD = 'nerocasamarbles@gmail.com';
const NEXT = 'info@nerocasa.com';
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';

function runShopify(args, { parseJson = true } = {}) {
  const finalArgs = parseJson ? [...args, '--json'] : args;
  const out = execFileSync(shopifyCmd, finalArgs, {
    encoding: 'utf8',
    shell: isWin,
    env: { ...process.env, SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:none|p:none|m:cursor-grok-4.6' },
  });
  return parseJson ? JSON.parse(out) : out;
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-email-'));
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

const data = execute(`query {
  shop { email contactEmail }
  pages(first: 50) { nodes { id handle body } }
}`);

console.log('shop.email', data.shop.email);
console.log('shop.contactEmail', data.shop.contactEmail);

for (const page of data.pages.nodes) {
  if (!page.body || !page.body.includes(OLD)) {
    continue;
  }
  const body = page.body.split(OLD).join(NEXT);
  const result = execute(
    `mutation PageEmail($id: ID!, $page: PageUpdateInput!) {
      pageUpdate(id: $id, page: $page) {
        page { handle }
        userErrors { message }
      }
    }`,
    { id: page.id, page: { body } },
    true,
  );
  const errs = result.pageUpdate?.userErrors || [];
  if (errs.length) console.log('  x', page.handle, errs.map((e) => e.message).join('; '));
  else console.log('  + page', page.handle);
}

try {
  const shopResult = execute(
    `mutation ShopEmail($input: ShopInput!) {
      shopUpdate(input: $input) {
        shop { email contactEmail }
        userErrors { message field }
      }
    }`,
    { input: { email: NEXT, contactEmail: NEXT } },
    true,
  );
  console.log('shopUpdate', JSON.stringify(shopResult, null, 2));
} catch (err) {
  console.log('shopUpdate not available:', (err.message || err).split('\n')[0]);
}
