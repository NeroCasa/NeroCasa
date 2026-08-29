# Checkout setup (NeroCasa)

Shopify **checkout and thank you** are **not theme pages**. Configure them in **Admin → Settings → Checkout**, not in the theme editor.

Run the setup guide anytime:

```powershell
node scripts/setup-guest-checkout.mjs zhjbdz-yw.myshopify.com
```

## What the customer sees

| Step | Where | Guest? |
|------|--------|--------|
| Cart | Your theme (`/cart`) | Yes |
| Checkout | Shopify hosted | Yes — no login |
| Thank you | Shopify hosted | Yes |
| **Bill / receipt** | Order confirmation **email** | Yes — no account needed |
| Track order | Email link or `/pages/track-order` | Order # + email |

---

## 1. Guest checkout

**Admin → Settings → Customer accounts**

- Choose **Don't allow customers to create accounts** for pure guest checkout  
- Or **Optional** (current) — customers can check out without logging in; account is only if they choose later

Confirm **Login required at checkout** is **off**.

---

## 2. Thank you page

**Admin → Settings → Checkout → Customize** → switch preview to **Thank you**

Add or edit a text block with:

```
Thank you. Your order is confirmed.

We make every piece when you order. Production and delivery usually take 3 to 7 working days after confirmation.

We will contact you on WhatsApp if we need to confirm marble, size, or delivery details.

Your order confirmation email is your receipt. It includes your order number, what you bought, and the total paid (VAT included). Keep it for tracking and warranty.

Questions? WhatsApp us or email info@nerocasa.com
```

**Branding:** background `#080807`, accent `#A57B00`, NeroCasa logo.

**Phone:** Customer information → **Phone number → Required**  
Banner text: *Use your WhatsApp number in the phone field so we can reach you about your order.*

---

## 3. The bill (receipt / invoice)

Guests get a bill **without an account**:

1. **At checkout** — order summary shows products, free shipping, **total in AED**
2. **Order confirmation email** — sent automatically; this is the **receipt** (order number, date, items, total)
3. **VAT** — product prices include standard VAT (`taxes included` is enabled for the store)
4. **Formal PDF invoice** — you can send from **Admin → Orders → [order] → Send invoice** if a client asks

**Set notification email:**

- **Settings → Store details** → contact email: `info@nerocasa.com`
- **Settings → Notifications** → Order confirmation — add: *This email is your receipt. Total includes VAT where applicable.*

---

## 4. Free shipping

**Admin → Settings → Shipping and delivery**

- Rate: **0.00 AED**
- Name: **Free delivery (3 to 7 working days)**

Or run (if API works on your plan):

```powershell
node scripts/setup-free-shipping.mjs zhjbdz-yw.myshopify.com
```

---

## 5. Payments

**Admin → Settings → Payments** — deactivate **PayPal** until you are ready.

---

## 6. Product images in checkout

Checkout uses **product media** in Shopify Admin, not theme assets. Upload via **Products → Media** or:

```powershell
node scripts/upload-catalog-images.mjs zhjbdz-yw.myshopify.com
```

Storefront catalog pages still use theme assets; this is mainly for Admin and checkout thumbnails.

---

## Theme-controlled pages

| Page | Template |
|------|----------|
| Cart | `sections/ncs-cart.liquid` |
| Track order | `page.track` → `/pages/track-order` |
