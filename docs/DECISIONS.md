# Decisions Log

> A dated, append-only log of non-obvious technical or design decisions and why they were made.
> This exists so future sessions (and future you) don't re-litigate or accidentally reverse a
> deliberate choice. Newest entries at the top.

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
