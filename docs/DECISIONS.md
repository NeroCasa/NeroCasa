# Decisions Log

> A dated, append-only log of non-obvious technical or design decisions and why they were made.
> This exists so future sessions (and future you) don't re-litigate or accidentally reverse a
> deliberate choice. Newest entries at the top.

### 2026-09-17 — Name URLs, Gmail, README index
**Context:** Owner asked to finish Admin leftovers, use `nerocasamarbles@gmail.com` everywhere, asked why GitHub showed `AGENTS.md` as the repo index, and why `/products/cft-1` did not match the product name Soglia.
**Decision:** Change product handles to the piece names and 301 the SKU URLs. Keep SKUs as variant SKUs. Theme dual-matches both handles. Add `README.md` as the GitHub homepage; leave `AGENTS.md` as agent instructions. `.shopifyignore` so those files never upload as theme assets.
**Alternatives considered:** Keep SKU handles and only change the visible title (URL would still say cft-1). Rename AGENTS.md (would break the agent system).
**Consequences:** Public URLs are `/products/soglia` etc. Search still finds `cft-1`. GitHub shows README. Wallets remain an Admin Payments setting.

### 2026-09-17 — Collections index: The 9 only, keep hero
**Context:** Owner asked to return collections to only The 9 after the Step 10 featured split, but keep the marble hero.
**Decision:** Index renders only `the-9`. Do not pass `quiet: true`. Keep the existing 480px only-child tile CSS. Type tiles stay on `/collections/the-9`.
**Alternatives considered:** Keep coffee/side as extra tiles; quiet compact heading without slabs.
**Consequences:** `/collections` looks like the compact The 9 card again, with the full marble hero behind the heading.

### 2026-09-17 — Engineering leftovers, including Step 10
**Context:** Owner asked to execute every leftover in `docs/TODO.md`, including optional engineering and the previously gated collections grid split. Password wall and Payments stay Admin-only. Atelier is not deleted.
**Decision:** Self-host latin woff2 and drop Google Fonts. Concatenate additions + luxury into `nerocasa.css.liquid` and delete the two source CSS files. Move catalog search JS into `nerocasa.js`. Put chrome strings in `locales/en.default.json`. Fill journal cards with rotating slab assets when Admin has no featured image. On `/collections`, drop `quiet: true` and show The 9 + coffee + side in a featured grid. Add `scripts/test-storefront.mjs` with no extra packages.
**Alternatives considered:** Keep additions/luxury as rebuild sources; fake journal photography; disable password from the theme.
**Consequences:** One render-blocking stylesheet instead of two plus Google Fonts. Historical `!important` remains inside the unified file. Collections index is no longer a single 480px The 9 card when coffee and side exist.

### 2026-09-17 — Always use skills; design closed
**Context:** Owner said design is done and should not have to type “use your skills” every chat. `AGENTS.md` already pointed at skills, but Cursor only always-injects what is in always-on rules.
**Decision:** Add `.cursor/rules/always-use-skills.mdc` with `alwaysApply: true`, track `.cursor/rules/` in git, and add AGENTS.md golden rule 8. Treat storefront design as complete in `docs/TODO.md`; leftover items are Admin or optional debt.
**Alternatives considered:** User-level Cursor rules only (would not travel with the repo); stuffing the full skill index into the always-on rule (too long).
**Consequences:** New chats in this repo get the rule automatically. Skills still live in `.cursor/skills/<name>/SKILL.md` and must actually be read.

### 2026-09-17 — Fill interiors; restore last-word gold
**Context:** Owner liked the review pass but B2B, Why Nerocasa, Terms, Privacy, and Refunds were a left-hand strip with empty black to the right. Last-word gold had been scoped to CASA/9 only.
**Decision:** B2B copy sits in two columns, form centered underneath at the same width as the copy and not taller. Why restores 2×2 framed value cards, a framed logo on the right, and a 2-col manifesto — not the reverted magazine layout. Legal/track use two reading columns across the 8vw gutters. `nc-title-gold` golds the last word of every multi-word title again; outline/ghost CTAs match; fill CTAs stay gold chips with dark text so last-word gold is readable.
**Alternatives considered:** Keep B2B as a single 760px stack; CSS columns only on legal; gold last word on fill buttons (invisible on gold).
**Consequences:** Why is framed again, but still not the magazine layout. Custom WhatsApp-only buy, cart AJAX, CASA, and PDP `contain` stay.

### 2026-09-17 — Review pass: rows, handles, warmth
**Context:** Owner found stacked stone/size boxes, printed handles (read as codes like VFT-2 / CFT-1), a grey PDP panel, missing social logos, a white-slab Custom visual, a buried water-jet line, a split B2B form, and a flat/antiseptic feel.
**Decision:** Keep named stones, but in a wrapping row. Size modes as a text row, not boxed columns. Hide handles. Gold piece names. Match PDP frame to collection cards without changing image size or `contain`. Restore social SVGs. Custom visual uses `nc-brand-visual`. Water-jet is a gold Coming soon panel. B2B is one column with fuller copy. Warmth via grain, gold-tinted card rules, and gold names — not a second type system.
**Alternatives considered:** Empty-circle swatches again; keeping the grey gallery as a “display panel.”
**Consequences:** Gold is now also used on product names, not only CASA/9. Custom size remains WhatsApp-only.

### 2026-09-17 — Material ledger on Atelier
**Context:** Owner approved the forensic redesign and confirmed custom size hiding Add to cart is intentional (WhatsApp).
**Decision:** Named stone selectors (sample + name); gold only on CASA, numeral 9, selected stone, fill CTA, and the header rule; Inter body 400; one hairline; no button shadow; no card lift; home heading The 9; Custom/B2B process ledgers. Implement on `atelier/material-ledger` and unpublished Atelier only — not live, not `main`.
**Alternatives considered:** Keep empty-circle swatches; last-word gold on every title; showing Add to cart in custom mode.
**Consequences:** Custom size remains WhatsApp-only. Live theme stays on the previous luxury pass until an explicit publish/live-push.

### 2026-09-17 — One card, one title, unboxed interiors
**Context:** Owner asked for a luxury pass across every page after the collections tile landed.
**Decision:** Treat The 9 index card as the master card; compact titles except home; unbox Why Nerocasa; restore outline/ghost buttons; PDP marble as swatches with a slower fade; keep `object-fit: contain`.
**Alternatives considered:** 3D configurator; putting all nine products on home; replaying the reverted Why magazine layout.
**Consequences:** Hover lift is desktop/fine-pointer only. Journal still needs photography in Admin to fill the 4:5 media slot.

### 2026-09-16 — Collections index compact title + single-tile width
**Context:** `/collections` looked empty (no heading, The 9 locked to 1/3 of a 3-up grid). Editorial and large-hero layouts were reverted.
**Decision:** Use the same compact quiet page hero as search/The 9 (“Our collections”). Keep the 4:5 card. When it is the only tile, cap width at 480px; two or more tiles stay on the 3-up grid. Do not pass tile subtitles. Leave `/collections/the-9` type tiles unchanged.
**Alternatives considered:** Full-width editorial feature; 16:10 banner; restoring 1/3 lock.
**Consequences:** Future extra collections fill the remaining columns. Do not revive reverted magazine/banner layouts unless asked.

### 2026-09-16 — Scroll reveal plays once
**Context:** Luxury CSS expected `.is-visible` and an 18% clip-path, while JS set inline opacity and reversed on leave, so revealed blocks could stay cropped.
**Decision:** JS adds `.is-visible` once and unobserves. CSS uses opacity/transform only. `prefers-reduced-motion` still forces visible.
**Alternatives considered:** Keep reverse-on-leave; animate clip-path.
**Consequences:** Reveal is a one-way entrance. Cart AJAX, cursor, and loader were not changed.

### 2026-09-16 — Track agent skills in git
**Context:** Skills lived under `.cursor/skills/` but `.gitignore` ignored all of `.cursor/`, so clones and other sessions would not get them.
**Decision:** Ignore `.cursor/*` except `.cursor/skills/`. Keep `.cursor/settings.json` and similar editor files local.
**Alternatives considered:** Un-ignore all of `.cursor/`; leave skills local-only.
**Consequences:** The 21 SKILL.md files version with the theme. Cursor editor settings stay untracked.

### 2026-09-16 — Docs accepted as project memory
**Context:** Owner reviewed the initialization write-up in `docs/`.
**Decision:** Treat those files as the baseline for future agent work. Do not start the proposed improvements until they are requested.
**Alternatives considered:** Implementing TODO items immediately.
**Consequences:** Next session can skip re-deriving stack/constraints from scratch; still verify against code if docs and code diverge.

### 2026-09-16 — Initialize Cursor Agent System without functional theme edits
**Context:** User installed the portable agent package and ran the initialization prompt.
**Decision:** Copy `AGENTS.md`, `.cursor/skills/`, and `docs/` into the theme repo root; populate docs from inspection only.
**Alternatives considered:** Changing storefront code during init.
**Consequences:** Skills originally sat under `.cursor/skills/` which was gitignored via `.cursor/`; `AGENTS.md` and `docs/` were not ignored. Superseded the same day: skills are now tracked.

### 2026-09-15 — Collections index remains a small The 9 tile
**Context:** `/collections` looked empty; an editorial index and later a large-image/title layout were built then reverted on request.
**Decision:** Keep shipping the previous 3-column-width card index (The 9 only, no page heading on index).
**Alternatives considered:** Full-width editorial feature; compact page-hero + 420px card.
**Consequences:** One collection still occupies a third of a 3-up grid visually. Future collections would fill the remaining columns. Do not revive reverted layouts unless asked.

### Observed in code (dates unknown — recorded at init)
**Context:** These are implemented in the current codebase, not invented.
**Decision / pattern:**
- `/collections` is canonical (`nc-collections-index-url` → `routes.collections_url`); `page.collections` is canonicalised in `nc-meta-tags`.
- The 9 collection template uses `ncs-collections-index` with type tiles (coffee/side/console), not `ncs-collection`.
- Type collections are skipped on the list-collections index so they are not top-level alongside The 9.
- PDP images use contain; card tiles use cover.
- Header gold bottom line is always on (not only when scrolled).
- Contact/B2B use native Shopify `{% form 'contact' %}`; custom work is routed to WhatsApp.
**Alternatives considered:** Unknown (pre-init).
**Consequences:** Changing The 9 template or skip-handles changes store IA. Changing object-fit on PDP/cards is a known visual landmine.
