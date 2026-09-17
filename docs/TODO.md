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
- [ ] **Notifications** — In Admin → Notifications → **Customize**: logo + accent `#A57B00`. Do not replace Shopify’s 3k-line templates. Optional copy search-replace in `CHECKOUT-SETUP.md` §3.
- [x] Google tag `GT-PJ46R9SC` in `layout/theme.liquid` (after `<head>`). No Meta / TikTok. Shopify analytics still via `content_for_header`. 2026-09-18
- [x] **Google Search Console** — owner submitted sitemap + requested indexing (home, coffee-tables, Soglia, Why). Tag `GT-PJ46R9SC` is live. Public `site:www.nerocasa.com` still empty 2026-09-18 — wait for Google, do not re-request those URLs.
- [ ] **Bing Webmaster** — same sitemap
- [ ] **Google Business Profile** — NEROCASA, factory Industrial Area 15 Sharjah, service area all UAE
- [ ] Recrawl homepage so the old GoDaddy “Elegance Redefined” listing dies
- [ ] Instagram handle vs brand name (`@ncmarbles`) — rename or add a NeroCasa profile if wanted
- [x] Storefront password wall — live homepage returns the storefront (not a password gate) as of 2026-09-17
- [x] Theme inventory: NeroCasa/main `#161950105824` live; Atelier `#162217230560` unpublished

## SEO / listings
Theme and Admin SEO implemented 2026-09-18: UAE/Sharjah titles, FurnitureStore schema, policy/all noindex, type-collection footer links, factory NAP. Google still has to index the site.

- [x] Add UAE / Sharjah / made-to-order to titles and descriptions
- [x] Canonical/noindex `/policies/*` and `/collections/all`
- [x] FurnitureStore JSON-LD; CollectionPage ItemList; made-to-order return schema
- [x] Contact showroom copy, Track Order international copy, ampersand titles
- [x] Footer links to coffee / side / console collections
- [x] Google tag `GT-PJ46R9SC` in theme `<head>`
- [x] Search Console: sitemap + inspect/request already done by owner. Google has not listed pages in public search yet (normal lag).
- [ ] Bing Webmaster — same sitemap
- [ ] Google Business Profile: NEROCASA, Industrial Area 15 Sharjah, service area all UAE
- [ ] Recrawl homepage so the old GoDaddy “Elegance Redefined” listing dies
- [ ] Instagram `@ncmarbles` vs brand name — optional rename


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
