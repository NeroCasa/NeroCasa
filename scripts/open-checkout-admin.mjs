#!/usr/bin/env node
/**
 * Open Shopify Admin pages for guest checkout + thank-you setup.
 * Checkout cannot be changed from theme code; API needs Plus for branding.
 *
 * Usage: node scripts/open-checkout-admin.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { platform } from 'node:os';

const store = process.argv[2] || 'zhjbdz-yw.myshopify.com';
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';

const pages = [
  ['Customer accounts (guest)', `https://${store}/admin/settings/customer_accounts`],
  ['Checkout editor (thank you + phone)', `https://${store}/admin/settings/checkout/editor`],
  ['Notifications (order receipt email)', `https://${store}/admin/settings/notifications/customer/order_confirmation`],
  ['Shipping (free delivery label)', `https://${store}/admin/settings/shipping`],
  ['Store contact email', `https://${store}/admin/settings/general`],
];

console.log(`Open these Admin pages for checkout setup — ${store}\n`);
pages.forEach(([label, url], i) => {
  console.log(`${i + 1}. ${label}\n   ${url}\n`);
});

try {
  execFileSync(shopifyCmd, ['store', 'open', '--store', store], {
    stdio: 'inherit',
    shell: isWin,
  });
} catch {
  console.log('Run: shopify store open --store', store);
}

console.log(`\nThank-you page copy is in CHECKOUT-SETUP.md or run:\n  node scripts/setup-guest-checkout.mjs ${store}\n`);
