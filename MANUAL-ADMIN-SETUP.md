# NeroCasa — Manual Shopify Admin setup (no API token needed)

**Your admin:** https://admin.shopify.com/store/zhjbdz-yw

---

## Part 1 — Import all 9 products (5 minutes)

1. Go to **Products** → **Import**
2. Choose: `scripts/nerocasa-products-import.csv`
3. **Upload and preview** → **Import products**

Products use Italian names (Soglia, Equilibrio, Monolite, etc.) and handles:

| Title | Handle |
|-------|--------|
| Soglia | `cft-1` |
| Equilibrio | `cft-2` |
| Monolite | `cft-3` |
| Galleria | `cs-1` |
| Passaggio | `cs-2` |
| Atrio | `cs-3` |
| Nodo | `sd-1` |
| Punto | `sd-2` |
| Scalino | `sd-3` |

Each has **Marble** variants: Ibiza White, Armani Grey, Travertine (+ Rosso Levanto on Monolite).

**If products already exist with old titles**, run:

```powershell
node scripts/rename-catalog-titles.mjs zhjbdz-yw.myshopify.com
```

---

## Part 2 — Collections (3 minutes)

| Collection | Handle |
|------------|--------|
| Coffee Tables | `coffee-tables` |
| Side Tables | `side-tables` |
| Console Tables | `console-tables` |

Add 3 products per collection.

---

## Part 3 — Pages (5 minutes)

| Title | Handle | Theme template |
|-------|--------|----------------|
| Why Nerocasa | `why-nerocasa` | `page.about` |
| Contact | `contact` | `page.contact` |
| Custom | `custom` | `page.custom` |
| B2B | `b2b` | `page.b2b` |
| Terms & Conditions | `terms` | `page.terms` |
| Refunds | `refunds` | `page.refunds` |
| Track Order | `track-order` | `page.track` |
| Collections | `collections` | `page.collections` |

**Editable from admin:** Terms, Refunds, and Track Order page **body content** appears on the storefront. About, Contact layout, and B2B use theme sections.

Set each page to **Visible**.

---

## Part 4 — Theme

1. **Online Store → Themes**
2. Upload or sync the NeroCasa theme
3. **Preview** to test (publish when ready for clients)
4. **Theme settings → Brand → Logo** — optional upload; default is `nerocasa-logo-user.png`

---

## Part 5 — Before going live

- [ ] Fill **Terms**, **Refunds**, and **Track order** page content in admin
- [ ] Set contact email, phone, WhatsApp in **Theme settings**
- [ ] Configure **Settings → Payments** when ready to accept orders
- [ ] Publish NeroCasa theme (replace default theme)
- [ ] Remove storefront password if enabled
