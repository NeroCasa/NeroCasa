# Checkout and shipping setup (NeroCasa)

Shopify **checkout is not part of your theme**. After `/cart`, customers go to Shopify’s secure checkout (`checkout.shopify.com`). You can brand it and configure payments/shipping in Admin, but you cannot replace the full checkout page with `ncs-*` theme files unless you are on **Shopify Plus**.

## What the theme controls

| Step | Controlled by |
|------|----------------|
| Product page | NeroCasa theme |
| Cart page (`/cart`) | NeroCasa theme — email + WhatsApp collected here |
| Checkout | **Shopify Admin** (hosted checkout) |
| Order confirmation email | **Shopify Admin** → Notifications |

## 1. Brand checkout (match NeroCasa)

1. **Admin → Settings → Checkout → Customize**
2. Upload your logo
3. Set colors: background `#080807`, accent `#A57B00`
4. Save

## 2. Order emails → info@nerocasa.com

1. **Admin → Settings → Store details** → Store contact email: `info@nerocasa.com`
2. **Admin → Settings → Notifications** → Customer notifications → Order confirmation (verify sender/recipient settings)

Checkout always collects **email** for order confirmation. The cart also saves **Email** and **WhatsApp** as order attributes for your team.

## 3. Remove PayPal

1. **Admin → Settings → Payments**
2. Deactivate **PayPal** (and any wallet you are not ready to use)
3. Leave **Shopify Payments** or your chosen method for when you add cards later

PayPal cannot be removed from theme code alone.

## 4. Free shipping + 3–7 working days

Run from the repo (or set manually in Admin):

```powershell
node scripts/setup-free-shipping.mjs zhjbdz-yw.myshopify.com
```

Manual alternative: **Admin → Settings → Shipping and delivery** → set rates to **0.00** and name the method **Free delivery (3-7 working days)** for all zones you serve.

## 5. Delivery address (manual vs map pin)

Standard Shopify checkout uses **manual address fields** (with autocomplete in many regions). A **map pin / drop-a-pin** selector is **not** included on standard plans. Options:

- **Recommended now:** manual address at checkout (street, area, city, UAE emirate)
- **Later:** Shopify Plus checkout extension or a delivery app with map selection

## 6. Product images missing in Admin and checkout

Catalog photos live as **theme assets** (`cft-1-ibiza-white.jpg`, etc.) but were **never uploaded to product media** in Shopify. Admin and checkout only show images attached to products.

**Fix:**

1. Add all JPG files to `assets/` in the repo (27 files: `{handle}-{marble-slug}.jpg`)
2. Run:

```powershell
node scripts/upload-catalog-images.mjs zhjbdz-yw.myshopify.com
```

Or upload images manually in **Admin → Products → each product → Media**.

## Email and WhatsApp at checkout (not on cart)

Email and phone are collected on **Shopify checkout**, not the cart page.

1. **Admin → Settings → Checkout → Customize**
2. **Customer information → Phone number → Required**
3. Email is always required at checkout for order confirmation
4. Optional checkout banner text: *Use your WhatsApp number in the phone field*

There is no separate WhatsApp field on standard Shopify checkout. The **phone** field is used for WhatsApp contact.
