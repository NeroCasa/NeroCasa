# Changelog

> Dated, human-readable log of what the agent actually changed, session by session. This is for
> project memory, not a marketing changelog — be specific about files and behavior touched.

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
