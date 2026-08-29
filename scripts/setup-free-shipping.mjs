#!/usr/bin/env node
/**
 * Set all shipping rates to free and rename to "Free delivery (3-7 working days)".
 * Usage: node scripts/setup-free-shipping.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || 'zhjbdz-yw.myshopify.com';
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';
const SHIPPING_NAME = 'Free delivery (3-7 working days)';

function runShopify(args) {
  const out = execFileSync(shopifyCmd, [...args, '--json'], {
    encoding: 'utf8',
    env: { ...process.env, SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:1|p:cursor|m:shipping' },
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: isWin,
  });
  return JSON.parse(out);
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-shipping-'));
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

function collectMethods(profile) {
  const methods = [];
  for (const group of profile.profileLocationGroups || []) {
    for (const zoneNode of group.locationGroupZones?.nodes || []) {
      const zone = zoneNode.zone?.name || 'Zone';
      for (const method of zoneNode.methodDefinitions?.nodes || []) {
        if (method.id && !method.id.includes('?')) {
          methods.push({ id: method.id, zone, name: method.name });
        }
      }
    }
  }
  return methods;
}

async function main() {
  console.log(`Setting free shipping — ${store}\n`);

  const data = execute(`
    query {
      deliveryProfiles(first: 10) {
        nodes {
          id
          name
          profileLocationGroups {
            locationGroupZones(first: 20) {
              nodes {
                zone { name }
                methodDefinitions(first: 20) {
                  nodes { id name }
                }
              }
            }
          }
        }
      }
      shop {
        currencyCode
      }
    }
  `);

  const currency = data.shop?.currencyCode || 'AED';
  const methods = (data.deliveryProfiles?.nodes || []).flatMap(collectMethods);
  if (!methods.length) {
    console.error('No shipping methods found. Set up shipping in Admin first.');
    process.exit(1);
  }

  const mutation = `
    mutation UpdateShipping($id: ID!, $input: DeliveryMethodDefinitionInput!) {
      deliveryMethodDefinitionUpdate(id: $id, methodDefinition: $input) {
        methodDefinition {
          id
          name
          rateProvider {
            ... on DeliveryRateDefinition {
              price { amount currencyCode }
            }
          }
        }
        userErrors { field message }
      }
    }
  `;

  for (const method of methods) {
    const result = execute(
      mutation,
      {
        id: method.id,
        input: {
          name: SHIPPING_NAME,
          rateDefinition: {
            price: { amount: 0, currencyCode: currency },
          },
        },
      },
      true,
    );
    const errors = result.deliveryMethodDefinitionUpdate?.userErrors || [];
    if (errors.length) {
      console.log(`  ✗ ${method.zone} / ${method.name}: ${errors.map((e) => e.message).join('; ')}`);
      continue;
    }
    const updated = result.deliveryMethodDefinitionUpdate?.methodDefinition;
    console.log(`  ✓ ${method.zone}: ${updated?.name} (${updated?.rateProvider?.price?.amount} ${currency})`);
  }

  console.log('\nDone. Shipping should show as free at checkout.\n');
}

main().catch((err) => {
  console.error('\nFailed:\n', err.message || err);
  process.exit(1);
});
