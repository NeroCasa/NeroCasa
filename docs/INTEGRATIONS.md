# Integrations

> Every external app, API, webhook, tracking script, and service this project depends on.
> Discovered by inspection — never invented. Mark status honestly.

## Apps / Plugins / Embeds
| Name | Purpose | Where it's wired in | Status | Notes |
|---|---|---|---|---|
| Shopify Online Store / `content_for_header` | Platform scripts, possible app embeds | `layout/theme.liquid`, `layout/password.liquid` | Active | Installed Admin apps are **not listed in the theme repo**. Treat anything injected here as protected. |
| Shopify themes (CLI 2026-09-17) | Live + draft | Admin, not theme files | Active | NeroCasa/main `#161950105824` live; NeroCasa Atelier `#162217230560` unpublished. No extra themes. |

## APIs (Inbound & Outbound)
| Name | Direction | Endpoint(s) | Auth method | Used by | Notes |
|---|---|---|---|---|---|
| Shopify Ajax Cart | Outbound from storefront | `/cart/add.js`, `/cart.js`, `/cart/update.js` | Session cookie | `assets/nerocasa.js`, `sections/ncs-cart.liquid` | Native cart JSON |
| Shopify Admin / CLI | Outbound from `scripts/*.mjs` | Shopify CLI / Admin (not storefront) | CLI auth or `SHOPIFY_ADMIN_TOKEN` | Catalog setup scripts | Not used at runtime on the site |
| WhatsApp | Outbound link | `wa.me` via `nc-whatsapp-link` / `nc-contact-whatsapp` | None | Header/footer/contact/custom | Phone from settings |
| Store email | Outbound mailto | `info@nerocasa.com` | None | Theme settings, legal pages, checkout copy | Admin `contactEmail` is this address. Admin `shop.email` (notification sender) is still the old Gmail — GraphQL has no `shopUpdate`; change it in Settings → Store details if it should match. |
| Shopify customer notifications | Outbound email | Admin → Settings → Notifications | Merchant Admin | Order/shipping/invoice mail | Not in the theme. Brand via Customize (logo + `#A57B00`). Admin GraphQL cannot write templates. |
| NAP / schema | Outbound JSON-LD | FurnitureStore + Organization + Product Offer in `nc-meta-tags` | None | Home + PDPs | Factory Industrial Area 15, Sharjah; areaServed UAE. Product shipping/return defined once (`#shipping-policy`, `#return-policy`); later variants reference that `@id`. Reviews only if metafields exist. |

## Webhooks
| Name | Trigger | Handler location | Notes |
|---|---|---|---|
| **Unknown** | — | Not in theme | No webhook handlers in this repository |

## Analytics & Tracking
| Tool | Where loaded | Events tracked | Notes |
|---|---|---|---|
| Google tag `GT-PJ46R9SC` | `layout/theme.liquid` immediately after `<head>` | Search Console / Google destinations on this tag | Owner snippet 2026-09-18. `async`. Do **not** add a second gtag, GTM, or the same ID in Shopify Admin pixels. Gift card + password layouts do not load it. |
| Theme-authored Meta / TikTok | **Not found** | — | No `fbq` / `ttq`. |
| Shopify analytics | `content_for_header` | Platform default | Protected |

## Forms & Submission Handlers
| Form | Location | Submits to | Validation | Notes |
|---|---|---|---|---|
| Contact | `sections/ncs-contact.liquid` | `{% form 'contact' %}` | HTML required | tag `contact-enquiry` |
| B2B | `sections/ncs-b2b.liquid` | `{% form 'contact' %}` | HTML required | tag `b2b-enquiry` |
| Search | — | — | Removed | No header overlay, footer link, catalog JS, or SearchAction. `/search` stays a Shopify route but shows The 9 browse, noindex. |
| Add to cart | product forms | `/cart/add` intercepted by AJAX | Shopify | `data-nc-ajax-cart='false'` can opt out |
| Cart update | `ncs-cart.liquid` | `/cart/update.js` | — | Qty changes |
| Checkout | cart | Shopify checkout | Shopify | **Do not modify** unless asked |

## Payment-Related Functionality
| Component | Location | Provider | Notes |
|---|---|---|---|
| Checkout button / cart | `ncs-cart.liquid` | Shopify Payments / store config | Theme only posts to Shopify cart/checkout |
| Gift card template | `templates/gift_card.liquid` | Shopify | Stock-style gift card page |

## Metafields / Metaobjects / Custom Data
| Name | Type | Used by | Purpose |
|---|---|---|---|
| `custom.height` | product metafield | `nc-product-field`, `nc-catalog-dimensions` | Dimension chip |
| `custom.length` | product metafield | same | Dimension chip |
| `custom.width` | product metafield | same | Dimension chip |
| `custom.depth` | product metafield | same | Dimension chip |
| `custom.materials` | product metafield | `ncs-product.liquid` | Optional copy |
| `custom.production_info` | product metafield | `ncs-product.liquid` | Optional copy |
| `reviews.rating` / `reviews.rating_count` | product metafields | `nc-meta-tags.liquid` JSON-LD | Only if present |
| Theme catalog fallbacks | snippets `nc-catalog-meta` etc. | cards/PDP | When Shopify fields empty |
| Metaobjects | **Not found** in Liquid | — | |

## External Services
| Service | Purpose | Where configured | Notes |
|---|---|---|---|
| Shopify CDN | Assets/images | `asset_url`, `image_url`, `asset_img_url` | |
| GitHub | Theme source | schema theme_documentation_url | https://github.com/NeroCasa/NeroCasa |
| Instagram / Pinterest | Footer/contact links | theme settings URLs | Optional; empty until set |
| WhatsApp | Custom/enquiry | theme settings | |

## Environment Variables / Secrets (names only — never values)
| Variable | Purpose | Required in |
|---|---|---|
| `SHOPIFY_FLAG_STORE` / `SHOPIFY_STORE` | Store domain for scripts | `scripts/*.mjs` |
| `SHOPIFY_ADMIN_TOKEN` | Admin API token for some scripts | `setup-shopify-catalog-token.mjs` |
| `SHOPIFY_CLI_THEME_TOKEN` | Theme Access (CLI docs) | CLI if used |
| `NC_SKIP_SHOPIFY_AUTH` | Skip auth in some scripts | `update-store-settings.mjs`, `optimize-store-seo.mjs` |
| `SHOPIFY_CLI_AGENT_INFO` | CLI agent telemetry prefix | several scripts |

---
**Rule:** nothing on this page gets removed, disconnected, or replaced without it being an
explicit part of the user's request, and without first explaining the impact.
