#!/usr/bin/env node
/**
 * Require phone number at Shopify checkout (use for WhatsApp contact).
 * Usage: node scripts/setup-checkout-contact.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || 'zhjbdz-yw.myshopify.com';
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';

function runShopify(args) {
  const out = execFileSync(shopifyCmd, [...args, '--json'], {
    encoding: 'utf8',
    env: { ...process.env, SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:1|p:cursor|m:checkout' },
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: isWin,
  });
  return JSON.parse(out);
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-checkout-'));
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

async function main() {
  console.log(`Checkout contact settings — ${store}\n`);

  const profiles = execute(`
    query {
      checkoutProfiles(first: 5) {
        nodes {
          id
          name
          isPublished
        }
      }
    }
  `);

  const published = (profiles.checkoutProfiles?.nodes || []).find((p) => p.isPublished);
  if (!published) {
    console.log('No published checkout profile found.');
    console.log('Set phone manually: Admin → Settings → Checkout → Customer information → Phone number → Required');
    return;
  }

  const mutation = `
    mutation UpdateCheckout($checkoutProfileId: ID!, $checkoutConfiguration: CheckoutConfigurationInput!) {
      checkoutProfileUpdate(checkoutProfileId: $checkoutProfileId, checkoutConfiguration: $checkoutConfiguration) {
        checkoutProfile { id name }
        userErrors { field message }
      }
    }
  `;

  try {
    const result = execute(
      mutation,
      {
        checkoutProfileId: published.id,
        checkoutConfiguration: {
          contactInfo: {
            phoneRequired: true,
          },
        },
      },
      true,
    );
    const errors = result.checkoutProfileUpdate?.userErrors || [];
    if (errors.length) {
      console.log('API update not available:', errors.map((e) => e.message).join('; '));
    } else {
      console.log('  ✓ Phone number required at checkout');
    }
  } catch (err) {
    console.log('  · Could not update via API:', (err.message || err).split('\n')[0]);
  }

  console.log(`
Manual steps (if needed):
  1. Admin → Settings → Checkout → Customize
  2. Customer information → Phone number → Required
  3. Email is always collected at checkout for order confirmation
  4. Add checkout message: "Use your WhatsApp number in the phone field"
  5. Settings → Payments → deactivate PayPal
`);
}

main().catch((err) => {
  console.error('\nFailed:\n', err.message || err);
  process.exit(1);
});
