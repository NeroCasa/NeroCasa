# NeroCasa — Shopify store setup

Complete these steps in **Shopify Admin** after uploading the theme. Takes about 15 minutes.

## 1. Theme settings

Go to **Online Store → Themes → Customize → Theme settings**.

| Setting | What to enter |
|---------|----------------|
| Brand name / tagline | Your public copy |
| Logo / Hero image | Optional — default logo is `nerocasa-logo-user.png` in theme assets |
| Accent gold | Keep `#A57B00` unless you intentionally change it |
| Contact email / phone / WhatsApp | Real contact details |
| Collection handles | Match your collection URL handles (see step 2) |
| Page handles | Use defaults below unless you prefer different URLs |

## 2. Create collections

Go to **Products → Collections → Create collection**.

Create each collection and set the **URL handle** exactly as below (or update handles in theme settings):

| Collection | Suggested handle |
|------------|------------------|
| Coffee Tables | `coffee-tables` |
| Side Tables | `side-tables` |
| Console Tables | `console-tables` |

Add **3 products per collection** (see step 2b).

## 2b. Create the 9 catalog products

Create **9 products** in **Products → Add product**. Each needs a **URL handle** and a **Marble** option with color variants (prices you set in Shopify).

### Coffee Tables — collection `coffee-tables`

| Product title | Handle | Marble variants (option name: **Marble**) |
|---------------|--------|-------------------------------------------|
| Soglia | `cft-1` | Ibiza White, Armani Grey, Travertine |
| Equilibrio | `cft-2` | Ibiza White, Armani Grey, Travertine |
| Monolite | `cft-3` | Ibiza White, Travertine, Rosso Levanto |

### Console Tables — collection `console-tables`

| Product title | Handle | Marble variants |
|---------------|--------|-----------------|
| Galleria | `cs-1` | Ibiza White, Armani Grey, Travertine |
| Passaggio | `cs-2` | Ibiza White, Armani Grey, Travertine |
| Atrio | `cs-3` | Ibiza White, Armani Grey, Travertine |

### Side Tables — collection `side-tables`

| Product title | Handle | Marble variants |
|---------------|--------|-----------------|
| Nodo | `sd-1` | Ibiza White, Armani Grey, Travertine |
| Punto | `sd-2` | Ibiza White, Armani Grey, Travertine |
| Scalino | `sd-3` | Ibiza White, Armani Grey, Travertine |

**Color names must match exactly** (the theme maps images to these):

- **Ibiza White** (White)
- **Armani Grey** (Dgrey)
- **Travertine** (Trav)
- **Rosso Levanto** (Red — Coffee Table 3 only)

For each variant, set its **price** in Shopify. The theme switches image + price when the customer picks a marble color. Product photos are bundled in the theme `assets/` folder — assign variant images in Shopify admin if you prefer, or the theme uses the bundled images automatically.

Add each product to its collection (3 per collection).

## 3. Create pages (clean URLs)

Go to **Online Store → Pages → Add page**.

For each page, set the **Title**, **Handle**, and **Theme template** as shown:

| Page title | Handle | Theme template |
|------------|--------|----------------|
| Why Nerocasa | `why-nerocasa` | `page.about` |
| Contact | `contact` | `page.contact` |
| Custom | `custom` | `page.custom` |
| B2B | `b2b` | `page.b2b` |
| Terms & Conditions | `terms` | `page.terms` |
| Refunds | `refunds` | `page.refunds` |
| Track Order | `track-order` | `page.track` |

**How to assign a template:** On the page editor, open **Theme template** in the sidebar (or "Change template") and pick the matching `page.*` template.

Once pages exist, navigation links switch from `/?view=about` to `/pages/why-nerocasa` automatically.

## 4. Legal & policy content

- Edit **Terms**, **Refunds**, and **Track order** page body in **Online Store → Pages** — content appears on the storefront automatically.
- Set **Settings → Policies** for Privacy and Terms of Service (footer links use Shopify policy URLs).

## 5. Contact forms

Contact, B2B, and Custom forms use Shopify's **contact form** — submissions go to the store notification email (**Settings → Notifications**).

**Note:** Custom page file upload is UI-only. For real file attachments, connect a form app (e.g. Shopify Forms, HulkForm) or a custom endpoint later.

## 6. Standard dimensions (editable in Shopify)

Dimensions are stored as **product metafields** (`custom.height`, `custom.length`, `custom.width`, `custom.depth`) and editable under **Products → [product] → Metafields**.

Seed definitions and default values once:

```powershell
node scripts/seed-product-metafields.mjs zhjbdz-yw.myshopify.com
node scripts/rename-catalog-titles.mjs zhjbdz-yw.myshopify.com
```

**Product photos:** upload in **Products → Media** or assign per variant. Theme uses Shopify images when present; bundled JPG assets are fallback only.

**Marble options:** managed as product **Marble** variants in Shopify (already wired).

**About / Home copy:** edit in **Theme customize** → About or Home section settings. Optional extra About body via **Pages → Why Nerocasa → Content**.

Optional product metafields for extra copy:

| Namespace & key | Type | Use |
|-----------------|------|-----|
| `custom.materials` | Multi-line text | Materials accordion |
| `custom.production_info` | Multi-line text | Production & delivery accordion |

## 7. Publish checklist

- [ ] Homepage loads with hero and collections
- [ ] All nav links work (no 404s)
- [ ] Contact email and WhatsApp open correctly
- [ ] Test add-to-cart → cart page → checkout preview
- [ ] Run `node scripts/rename-catalog-titles.mjs zhjbdz-yw.myshopify.com` if products still have old titles
- [ ] Submit test B2B / custom enquiry
- [ ] Replace placeholder legal copy before launch

## Fallback URLs

If a page is not created yet, the theme still works via alternate templates:

`/ ?view=about` · `contact` · `custom` · `b2b` · `terms` · `refunds` · `track`

Creating the pages in step 3 removes these query-string URLs from navigation.
