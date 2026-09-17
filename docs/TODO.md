# TODO

> Open follow-ups, deferred work, and known gaps. Not a task tracker for the whole business —
> just what's relevant to keep the codebase healthy and what was consciously deferred.

Storefront **design is complete** and live on NeroCasa/main (`#161950105824`) as of 2026-09-17.
Engineering leftovers below were executed 2026-09-17 after the owner asked to do all remaining items, including optional work.

## Design — done
- [x] Collections index presentation — compact quiet heading + ~480px only-child The 9 card. Live 2026-09-16
- [x] Why Nerocasa fill — 2-col framed values + logo panel; not the reverted magazine. Live 2026-09-17
- [x] Material ledger — named stones, last-word gold, Custom WhatsApp-only buy, filled B2B/legal pages. Live 2026-09-17
- [x] Always-on agent skills — `AGENTS.md` + `.cursor/rules/always-use-skills.mdc` so agents load skills without being asked. 2026-09-17
- [x] `/collections` marble hero kept; tiles reverted to The 9 only (~480px only-child). Coffee/side/console stay on `/collections/the-9`. 2026-09-17

## Owner / Shopify Admin (theme cannot do these)
Verified against Admin GraphQL + live `www.nerocasa.com` on 2026-09-17.

**Catalog / pages:** 9 active products with name URLs (`/products/soglia` …). Legacy SKU URLs redirect. The 9 + type collections, SKUs, VAT-included AED, `CONTINUE` inventory (made-to-order). Pages/templates match. Journal has 6 posts with featured images.

- [x] Duplicate collections URL unpublished; `/pages/collections` redirects to `/collections`. 2026-09-17
- [x] Empty **News** blog deleted. Journal remains `/blogs/journal`. 2026-09-17
- [x] Journal posts given product-slab featured images. 2026-09-17
- [x] Shipping method renamed to **Free delivery (3 to 7 working days)** (AED 0, Domestic UAE). 2026-09-17
- [ ] Payments / wallets: Shop Pay / Apple Pay / Google Pay cannot be enabled from this API — owner enables them in Admin → Payments after Shopify Payments is on.
- [x] Storefront password wall — live homepage returns the storefront (not a password gate) as of 2026-09-17
- [x] Theme inventory: NeroCasa/main `#161950105824` live; Atelier `#162217230560` unpublished
- [x] Theme-authored GA4 / Meta / TikTok pixels — **not** on the live homepage (`content_for_header` still may inject Shopify analytics)


## Engineering debt — done 2026-09-17
- [x] Duplicate CSS removed: single `assets/nerocasa.css.liquid` (Shopify compiles to `nerocasa.css`)
- [x] Theme Check: `nc-title-gold` args assigned before render; search script moved to `nerocasa.js`; gift card img/scripts patched; page hero is one balanced `nc-page-hero-shell` snippet. Remaining: RemoteAsset warnings on brand visual / product images
- [x] Chrome copy in `locales/en.default.json` (`nav`, `actions`, `cart`, `search`, `errors`)
- [x] Automated storefront checks: `node scripts/test-storefront.mjs` (no extra packages)
- [x] Self-hosted latin woff2 (Cormorant + Inter) on Shopify CDN; Google Fonts links removed
- [x] Journal cards rotate slab fallbacks when posts have no featured image

## Closed from older notes
- [x] Reveal JS vs leftover `[data-nc-reveal].is-visible` CSS — 2026-09-16
- [x] `.cursor/skills/` tracked in git — 2026-09-16
- [x] `nc-catalog-search-index` is **not** orphaned — `sections/ncs-search.liquid` renders it
