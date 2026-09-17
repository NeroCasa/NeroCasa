# Changelog

> Dated, human-readable log of what the agent actually changed, session by session. This is for
> project memory, not a marketing changelog — be specific about files and behavior touched.

### 2026-09-18
- Changed: Applied SEO audit. Titles/descriptions use UAE + Sharjah factory (not Dubai showroom). FurnitureStore schema, CollectionPage ItemList, PreOrder + MerchantReturnNotPermitted, noindex on `/policies/*` and `/collections/all`. Contact/Track/About/B2B/Custom H1s and factory copy. Footer type-collection links. Admin SEO via `scripts/optimize-store-seo.mjs`.
- Verified: `node scripts/test-storefront.mjs`; live titles after theme push.
- Follow-up: Owner must submit Search Console, Bing, Google Business Profile (Industrial Area 15, Sharjah; service area UAE).

### 2026-09-17
- Changed: SEO and listings audit of live `www.nerocasa.com` (titles, descriptions, canonicals, JSON-LD, robots, sitemap) plus Google/web presence. Findings in `docs/TODO.md`. Storefront files not edited.
- Verified: HTTP GET of 28 URLs; Admin product/collection SEO fields; Google `site:www.nerocasa.com` (no hits); apex `nerocasa.com` 301 to www.
- Follow-up: Indexing, GBP, geo titles, policy duplicates, LocalBusiness schema — implement when asked.

### 2026-09-17
- Changed: Product URLs use piece names (`/products/soglia` not `/products/cft-1`); old SKU URLs redirect. Theme matches both handles via `nc-catalog-code`. All store/theme emails are `nerocasamarbles@gmail.com`. GitHub index is `README.md` so `AGENTS.md` is no longer the repo homepage; `.shopifyignore` keeps agent files out of the theme zip. Unpublished `/pages/collections`, deleted empty News, renamed Terms/Refunds, journal featured images, shipping label “Free delivery (3 to 7 working days)”. Shop Pay/wallets still Admin-only.
- Verified: Admin GraphQL product handles; shipping mutation; `node scripts/test-storefront.mjs`; live `/products/soglia` and `/products/cft-1` redirect.
- Follow-up: Enable Shop Pay / Apple Pay / Google Pay in Admin → Payments if wanted.

### 2026-09-17
- Changed: Admin audit of live store `zhjbdz-yw` / `www.nerocasa.com`. Catalog, collections, pages, and VAT-inclusive prices match the theme. Findings logged in `docs/TODO.md` (duplicate `/pages/collections`, empty News blog, journal images, shipping name, wallets). Password wall is off. No theme GA4/Meta/TikTok on the homepage.
- Verified: Admin GraphQL products/collections/pages/blogs/markets/delivery; live homepage fetch.
- Follow-up: Owner should decide whether to unpublish `/pages/collections`, delete News, add journal photos, rename shipping, and enable wallets.

### 2026-09-17
- Changed: `/collections` tiles reverted to The 9 only. Marble page hero stays. Coffee/side/console remain on `/collections/the-9`. Featured 3-up CSS removed.
- Verified: Integrity tests for index else-branch The 9 only and no `quiet: true`. Pushed Atelier `#162217230560` and live `#161950105824`.
- Follow-up: Live now matches The 9-only index with marble hero.

### 2026-09-17
- Changed: Executed remaining TODO including optional work. Self-hosted Cormorant/Inter woff2; removed Google Fonts. Unified CSS into `assets/nerocasa.css.liquid` and deleted `nerocasa-additions.css` / `nerocasa-luxury.css`. Collections index featured The 9 + coffee + side with marble hero. Journal cards use slab fallbacks. Chrome copy in `locales/en.default.json`. Catalog search lives in `assets/nerocasa.js`. Gift card img dimensions + deferred scripts. Page heroes use one `nc-page-hero-shell` snippet. Integrity suite `scripts/test-storefront.mjs`. CLI theme list: live + Atelier only. Password wall, Payments, and Atelier deletion untouched. Cart AJAX, CASA, Custom wording, PDP `contain` unchanged.
- Verified: `node scripts/test-storefront.mjs` passed. Theme Check: 0 errors, 4 RemoteAsset warnings. Pushed unpublished Atelier `#162217230560` and live NeroCasa/main `#161950105824`. Cart AJAX, `content_for_header`, Custom wording, and PDP `contain` unchanged. Password wall and Payments not touched. Git not committed.
- Follow-up: Admin still owns apps/pixels, real journal photos, password, and Payments.

### 2026-09-17
- Changed: Design marked complete in `docs/TODO.md`. Added always-on Cursor rule `.cursor/rules/always-use-skills.mdc` and AGENTS.md golden rule 8 so agents load `.cursor/skills/` without being asked. `.gitignore` now tracks `.cursor/rules/`. `nc-catalog-search-index` is used by search — removed from “orphaned” notes.
- Verified: Compared `docs/TODO.md`, INTEGRATIONS, ARCHITECTURE, MANUAL-ADMIN-SETUP, and snippet renders against the live-shipped theme.
- Follow-up: Remaining items are Admin/owner or optional engineering debt; do not start unless asked.

### 2026-09-17
- Changed: Interior pages fill the width. B2B copy is two columns with a wider centered form under it (`ncs-b2b.liquid`). Why Nerocasa restores framed 2-col values, a framed logo panel, and a split manifesto (`ncs-about.liquid`) — not the reverted magazine. Terms/Privacy/Refunds/Track use two reading columns (`ncs-legal-shell`). `nc-title-gold` golds the last word of multi-word titles again, including CTA labels. Contact form tag `b2b-enquiry` unchanged. Custom size still hides Add to cart.
- Verified: Owner approved Atelier. Publishing to live NeroCasa/main `#161950105824` and git `main`.
- Follow-up: Live and git now match this pass.

### 2026-09-17
- Changed: Owner review pass on Atelier. Stones and Standard/Custom sit in horizontal rows. Product handles (CFT-1 / CS-2 / SD-2) removed from the PDP — they were printed by `ncs-product-handle`. Piece names are gold. Grey gallery panel removed; image stays contain at the same size inside a card-like frame. Footer WhatsApp/Instagram logos restored. Custom uses the brand mark instead of the white slab; water-jet is a gold Coming soon callout. B2B form stacks under expanded copy. Custom size still hides Add to cart.
- Verified: Draft push to unpublished Atelier `#162217230560` only.
- Follow-up: Owner preview; do not publish until asked.

### 2026-09-17
- Changed: Material ledger pass on branch `atelier/material-ledger`. Named marble selectors (`snippets/nc-marble-choice.liquid`) on cards and PDP; `nc-title-gold` golds only the numeral 9; home heading The 9; spec grid; Custom 3-step process; B2B ledger; empty cart The 9 card + Our collection; 404 stacked actions; Track copy without “new store”; Inter 400; hairline `0.14`; no button shadow; card hover scale 1.02; sticky mobile buy. Custom size still hides Add to cart for WhatsApp. Cart AJAX, checkout, CASA, password, and PDP `contain` unchanged.
- Verified: Source review of protected paths; draft push to unpublished Atelier `#162217230560` (not live, not git `main`).
- Follow-up: Owner preview on Atelier across breakpoints; do not publish until asked.

### 2026-09-17
- Changed: Luxury pass across the storefront. Unified framed cards and hover (home/collection/search/journal). Compact titles except home; last-word gold only on multi-word titles. Product marble as stone swatches with a slower image fade; PDP main image unfiltered. Custom / B2B / Contact compact enquiry layout; Why Nerocasa unboxed; legal/track body set in ink. Restored outline/ghost buttons. Cart/checkout AJAX, CASA, Custom wording, password, and PDP `object-fit: contain` unchanged.
- Verified: Atelier preview of coffee cards, Custom, Why (unboxed), PDP contain + Rosso Levanto fade, B2B, Contact (outline vs gold), 404, Privacy ink 16px, Journal frames. Live push follows this entry.
- Follow-up: Journal posts have no featured images yet; hover lift needs a real pointer device.

### 2026-09-16
- Changed: Scroll reveal now plays once via `.is-visible` (`assets/nerocasa-v20.js`); removed the 18% clip-path CSS override in `assets/nerocasa-luxury.css`. `/collections` index shows a compact “Our collections” heading and a 480px The 9 card when it is the only tile (`sections/ncs-collections-index.liquid`, additions + luxury CSS). `/collections/the-9`, cart, CASA, Custom, password, and PDP `object-fit: contain` were not changed.
- Verified: Source review of reveal CSS/JS and index Liquid; pushed to unpublished Atelier draft only (not live).
- Follow-up: Owner preview on draft `/collections`, home, about; publish live only if approved.

### 2026-09-16
- Changed: Versioned Cursor agent skills with the repo. `.gitignore` now ignores `.cursor/*` except `.cursor/skills/`. Updated PROJECT_CONTEXT, ARCHITECTURE, DECISIONS, TODO. Storefront files untouched.
- Verified: Skills remain loadable from `.cursor/skills/<name>/SKILL.md`; `.cursor/settings.json` stays untracked.
- Follow-up: Push when asked so clones receive the skills.

### 2026-09-16
- Changed: Owner reviewed and accepted the initialized `docs/` as the project baseline. No storefront files were edited in this confirmation.
- Verified: Verbal confirmation that PROJECT_CONTEXT, ARCHITECTURE, DESIGN_SYSTEM, INTEGRATIONS, DECISIONS, TODO, and CHANGELOG match the live theme as inspected.
- Follow-up: See `docs/TODO.md`. Functional work waits for an explicit request.

### 2026-09-16
- Changed: Installed Cursor Agent System into the NeroCasa theme repo. Copied `AGENTS.md`, `.cursor/skills/*` (21 skills), and `docs/` templates into the project root. Populated all `docs/*.md` files from repository inspection.
- Verified: Did **not** modify Liquid/CSS/JS storefront behavior, templates, catalog, or Shopify live/draft themes in this initialization pass.
- Follow-up: See `docs/TODO.md` (collections presentation, apps unknown, CSS duplication).
