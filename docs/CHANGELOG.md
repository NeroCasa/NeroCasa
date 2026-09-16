# Changelog

> Dated, human-readable log of what the agent actually changed, session by session. This is for
> project memory, not a marketing changelog — be specific about files and behavior touched.

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
