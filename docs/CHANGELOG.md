# Changelog

> Dated, human-readable log of what the agent actually changed, session by session. This is for
> project memory, not a marketing changelog — be specific about files and behavior touched.

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
