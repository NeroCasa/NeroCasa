# NeroCasa — Shopify store setup

Complete these steps in **Shopify Admin** after uploading the theme. Takes about 15 minutes.

## 1. Theme settings

Go to **Online Store → Themes → Customize → Theme settings**.

| Setting | What to enter |
|---------|----------------|
| Brand name / tagline | Your public copy |
| Logo / Hero image | Upload when ready (optional — placeholders work until then) |
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
| Dining Tables | `dining-tables` |
| Best Sellers | `best-sellers` (manual collection, add featured products) |

Add products to each collection. The home page and collections index link to these automatically.

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

- Edit **Terms** and **Refunds** page body in Shopify (or keep theme section copy and replace in code).
- Set **Settings → Policies** for Privacy and Terms of Service (footer links use Shopify policy URLs).

## 5. Contact forms

B2B and Custom forms use Shopify's **contact form** — submissions go to the store notification email (**Settings → Notifications**).

**Note:** Custom page file upload is UI-only. For real file attachments, connect a form app (e.g. Shopify Forms, HulkForm) or a custom endpoint later.

## 6. Product metafields (optional)

For dimensions on product pages, add metafields under **Settings → Custom data → Products**:

| Namespace & key | Type | Example |
|-----------------|------|---------|
| `custom.height` | Single line text | `45 cm` |
| `custom.length` | Single line text | `120 cm` |
| `custom.width` | Single line text | `60 cm` |
| `custom.materials` | Multi-line text | Stone description |
| `custom.production_info` | Multi-line text | Lead time copy |

## 7. Publish checklist

- [ ] Homepage loads with hero and collections
- [ ] All nav links work (no 404s)
- [ ] Contact email and WhatsApp open correctly
- [ ] Test add-to-cart on a product
- [ ] Submit test B2B / custom enquiry
- [ ] Replace placeholder legal copy before launch

## Fallback URLs

If a page is not created yet, the theme still works via alternate templates:

`/ ?view=about` · `contact` · `custom` · `b2b` · `terms` · `refunds` · `track`

Creating the pages in step 3 removes these query-string URLs from navigation.
