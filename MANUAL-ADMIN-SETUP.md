# NeroCasa — Manual Shopify Admin setup (no API token needed)

Use this if you only have a `shpss_` token. That token is **not** for creating products — you do not need any token for this guide.

**Your admin:** https://admin.shopify.com/store/zhjbdz-yw

---

## Part 1 — Import all 9 products (5 minutes)

1. Go to **Products** → **Import**
2. Click **Add file**
3. Choose: `scripts/nerocasa-products-import.csv` from this project folder
4. Click **Upload and preview** → **Import products**
5. Wait until finished

This creates:
- `cft-1`, `cft-2`, `cft-3` (Coffee Tables)
- `cs-1`, `cs-2`, `cs-3` (Console Tables)
- `sd-1`, `sd-2`, `sd-3` (Side Tables)

Each with **Marble** option: Ibiza White, Armani Grey, Travertine (+ Rosso Levanto on cft-3).

**After import — fix URL handles (important for theme images):**

For each product → **Search engine listing** → edit **URL handle** to match exactly:

| Product | Handle must be |
|---------|----------------|
| Coffee Table 1 | `cft-1` |
| Coffee Table 2 | `cft-2` |
| Coffee Table 3 | `cft-3` |
| Console Table 1 | `cs-1` |
| Console Table 2 | `cs-2` |
| Console Table 3 | `cs-3` |
| Side Table 1 | `sd-1` |
| Side Table 2 | `sd-2` |
| Side Table 3 | `sd-3` |

---

## Part 2 — Fix collection handles (3 minutes)

Go to **Products → Collections**. Edit each collection URL handle:

| Collection title | Handle must be |
|------------------|----------------|
| Coffee Tables | `coffee-tables` |
| Side Tables | `side-tables` |
| Console Tables | `console-tables` |

Create one more (optional, for home page Best Sellers):

| Title | Handle |
|-------|--------|
| Best Sellers | `best-sellers` |

Add all 9 products to **Best Sellers** manually.

---

## Part 3 — Create pages (5 minutes)

Go to **Online Store → Pages → Add page**. For each:

| Title | Handle | Theme template (sidebar) |
|-------|--------|--------------------------|
| Why Nerocasa | `why-nerocasa` | `page.about` |
| Contact | `contact` | `page.contact` |
| Custom | `custom` | `page.custom` |
| B2B | `b2b` | `page.b2b` |
| Terms & Conditions | `terms` | `page.terms` |
| Refunds | `refunds` | `page.refunds` |
| Track Order | `track-order` | `page.track` |
| Collections | `collections` | `page.collections` |

Leave body empty — the theme sections provide the layout.

Set each page to **Visible** / Published.

---

## Part 4 — Sync theme

1. **Online Store → Themes**
2. Make sure the latest NeroCasa theme is **Published**
3. Open your storefront → **Ctrl+F5** hard refresh

---

## About your `shpss_` token

- `shpss_` = Storefront / session style token (for headless storefronts)
- `shpat_` = Admin API token (only from **Settings → Apps → App development → Create app**)

You do **not** need either token for the steps above.

If you want automated setup later, create a custom app in Admin and copy the **`shpat_`** token once.
