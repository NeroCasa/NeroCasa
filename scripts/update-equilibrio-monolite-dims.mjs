#!/usr/bin/env node
/**
 * Update Equilibrio + Monolite dimension metafields.
 * Usage: node scripts/update-equilibrio-monolite-dims.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || 'zhjbdz-yw.myshopify.com';
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-dims-'));
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
        env: { ...process.env, SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:1|p:cursor|m:dims' },
      }),
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const products = execute(
  `query { products(first: 50) { nodes { id handle metafields(first: 20, namespace: "custom") { nodes { id key } } } } }`,
).products?.nodes || [];

const equilibrio = products.find((p) => p.handle === 'cft-2');
const monolite = products.find((p) => p.handle === 'cft-3');
if (!equilibrio || !monolite) throw new Error('cft-2 or cft-3 not found');

const setResult = execute(
  `mutation Set($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { key value }
      userErrors { message }
    }
  }`,
  {
    metafields: [
      { ownerId: equilibrio.id, namespace: 'custom', key: 'height', type: 'single_line_text_field', value: '42' },
      { ownerId: equilibrio.id, namespace: 'custom', key: 'length', type: 'single_line_text_field', value: '120' },
      { ownerId: equilibrio.id, namespace: 'custom', key: 'width', type: 'single_line_text_field', value: '120' },
      { ownerId: monolite.id, namespace: 'custom', key: 'height', type: 'single_line_text_field', value: '45' },
      { ownerId: monolite.id, namespace: 'custom', key: 'length', type: 'single_line_text_field', value: '190' },
      { ownerId: monolite.id, namespace: 'custom', key: 'width', type: 'single_line_text_field', value: '60' },
    ],
  },
  true,
);
const setErrs = setResult.metafieldsSet?.userErrors || [];
if (setErrs.length) throw new Error(setErrs.map((e) => e.message).join('; '));
console.log('Updated Equilibrio H42 L120 W120 and Monolite piece 1 H45 L190 W60');

const depth = (equilibrio.metafields?.nodes || []).find((m) => m.key === 'depth');
if (depth) {
  const del = execute(
    `mutation Del($metafields: [MetafieldIdentifierInput!]!) {
      metafieldsDelete(metafields: $metafields) {
        deletedMetafields { key }
        userErrors { message }
      }
    }`,
    { metafields: [{ ownerId: equilibrio.id, namespace: 'custom', key: 'depth' }] },
    true,
  );
  const delErrs = del.metafieldsDelete?.userErrors || [];
  if (delErrs.length) console.log('Depth delete:', delErrs.map((e) => e.message).join('; '));
  else console.log('Removed Equilibrio depth (D)');
}

console.log('Done.');
