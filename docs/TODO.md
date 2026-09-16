# TODO

> Open follow-ups, deferred work, and known gaps. Not a task tracker for the whole business —
> just what's relevant to keep the codebase healthy and what was consciously deferred.

## Deferred From Recent Work
- [ ] Collections index presentation (`/collections` looks empty with only The 9) — user reverted two layout attempts; wait for a new explicit direction
- [ ] Why Nerocasa editorial recomposition — implemented then reverted; do not reapply unless asked
- [ ] Step 10 gated collection grid split (featured + 2 supporting, drop `quiet: true`) — never approved

## Known Gaps / Risks Not Yet Addressed
- [ ] Confirm which Shopify apps/pixels actually inject via `content_for_header` (not visible in theme files)
- [ ] Duplicate CSS (additions vs luxury) and Theme Check Liquid errors on unrelated templates
- [ ] Reveal JS vs leftover `[data-nc-reveal].is-visible` CSS
- [x] `.gitignore` ignores all of `.cursor/`, so agent skills are not versioned — resolved 2026-09-16: `.cursor/skills/` is tracked; other `.cursor/` files stay ignored
- [ ] Unpublished Shopify themes from experiments may still exist in Admin (e.g. “NeroCasa Editorial Pages”)
- [ ] `locales/en.default.json` almost unused; copy is hardcoded
- [ ] No automated storefront test suite in the repo

## Nice-to-Haves (explicitly not urgent)
- [ ] Self-host Google Fonts to drop render-blocking third-party CSS
- [ ] Unify CSS into one cascade without `!important` wars
- [ ] Inventory unused snippets (Theme Check warned `nc-catalog-search-index` as orphaned)
