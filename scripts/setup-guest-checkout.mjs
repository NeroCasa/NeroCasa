#!/usr/bin/env node
/**
 * Print (and optionally apply) guest checkout + thank-you + billing setup.
 * Checkout/thank-you are edited in Shopify Admin, not the theme.
 *
 * Usage: node scripts/setup-guest-checkout.mjs zhjbdz-yw.myshopify.com
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
    env: { ...process.env, SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:1|p:cursor|m:guest-checkout' },
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: isWin,
  });
  return JSON.parse(out);
}

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-guest-co-'));
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

const THANK_YOU_COPY = `Thank you. Your order is confirmed.

We make every piece when you order. Production and delivery usually take 3 to 7 working days after confirmation.

We will contact you on WhatsApp if we need to confirm marble, size, or delivery details.

Your order confirmation email is your receipt. It includes your order number, what you bought, and the total paid (VAT included). Keep it for tracking and warranty.

Questions? WhatsApp us or email info@nerocasa.com`;

const CHECKOUT_BANNER = `Use your WhatsApp number in the phone field so we can reach you about your order.`;

async function main() {
  console.log(`NeroCasa guest checkout setup — ${store}\n`);

  let shop = {};
  try {
    const data = execute(`
      query {
        shop {
          name
          email
          currencyCode
          taxesIncluded
          customerAccounts
          customerAccountsV2 {
            customerAccountsVersion
            loginRequiredAtCheckout
          }
        }
      }
    `);
    shop = data.shop || {};
  } catch (err) {
    console.log('Could not read shop settings:', (err.message || err).split('\n')[0]);
  }

  console.log('Current store settings:');
  console.log(`  Currency: ${shop.currencyCode || '?'}`);
  console.log(`  Prices include VAT: ${shop.taxesIncluded ? 'yes' : 'no'}`);
  console.log(`  Customer accounts: ${shop.customerAccounts || '?'}`);
  console.log(`  Login required at checkout: ${shop.customerAccountsV2?.loginRequiredAtCheckout ? 'yes' : 'no'}`);
  console.log('');

  console.log('='.repeat(72));
  console.log('STEP 1 — Guest checkout (no account required)');
  console.log('='.repeat(72));
  console.log(`
1. Admin → Settings → Customer accounts
2. Choose: "Don't allow customers to create accounts"  (guest checkout only)
   OR keep "Optional" if you want sign-up later — login is already NOT required.
3. Save

Direct link: https://${store}/admin/settings/customer_accounts
`);

  console.log('='.repeat(72));
  console.log('STEP 2 — Checkout branding + phone (WhatsApp)');
  console.log('='.repeat(72));
  console.log(`
1. Admin → Settings → Checkout → Customize
2. Branding: logo, background #080807, accent #A57B00
3. Customer information → Phone number → Required
4. Add banner / policy text (checkout message):

${CHECKOUT_BANNER}

Direct link: https://${store}/admin/settings/checkout/editor
`);

  console.log('='.repeat(72));
  console.log('STEP 3 — Thank you page (paste this copy)');
  console.log('='.repeat(72));
  console.log(`
1. In the same Checkout editor, open the Thank you page (top preview dropdown)
2. Add a Text block or edit the main message area
3. Paste:

${THANK_YOU_COPY}
`);

  console.log('='.repeat(72));
  console.log('STEP 4 — The bill (receipt / invoice for guests)');
  console.log('='.repeat(72));
  console.log(`
Guests do not need an account to get a bill. Shopify sends it automatically.

What the customer receives:
  • Checkout order summary — line items, shipping (free), total in AED
  • Order confirmation email — this IS the receipt (order #, date, products, total)
  • VAT — your prices already include standard VAT (taxesIncluded: ${shop.taxesIncluded ? 'on' : 'off'})

What you should set in Admin:
  1. Settings → Store details → Store contact email: info@nerocasa.com
  2. Settings → Notifications → Order confirmation — review template
     Add a line: "Total includes VAT where applicable. This email is your receipt."
  3. Optional: from any order in Admin → Send invoice (PDF) if a client asks formally

Free shipping label:
  Settings → Shipping and delivery → rate name: "Free delivery (3 to 7 working days)" at 0.00 AED
`);

  console.log('='.repeat(72));
  console.log('STEP 5 — Payments (optional cleanup)');
  console.log('='.repeat(72));
  console.log(`
Admin → Settings → Payments → deactivate PayPal if you are not using it yet.
`);

  console.log('Done. Copy the thank-you text above into the Checkout editor.\n');
}

main().catch((err) => {
  console.error('\nFailed:\n', err.message || err);
  process.exit(1);
});
