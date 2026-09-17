# Project Context

> Populate this file by inspecting the actual repository. Do not guess. Update it whenever
> something here becomes outdated.

## What This Project Is
- **Project name:** NeroCasa (theme name in `config/settings_schema.json`: `NeroCasa` v2.0.0)
- **One-line description:** Custom Shopify Online Store 2.0 theme for a Dubai marble-furniture house selling nine made-to-order stone tables.
- **Primary users / audience:** End customers (residential) and trade/B2B enquiries; English storefront.
- **Business domain / vertical:** Luxury marble furniture. Legal entity named in the about section: AL SOURAH AL THAHABIA MARBLE & GRANITE L.L.C, Trade Licence 1253846.

## Detected Stack
> Filled in by AGENTS.md Step 0 ("Detect the Project").
- **Platform:** Shopify theme (`config/settings_schema.json`, `layout/theme.liquid`, JSON templates). No `.theme-check.yml` or `shopify.theme.toml` in the repo.
- **Language(s):** Liquid, CSS, vanilla JavaScript, JSON. Node `.mjs` scripts for Admin/CLI catalog setup (not a storefront runtime).
- **Framework(s)/libraries in active use:** No React/Vue/Next. No `package.json`. No Three.js/WebGL. Self-hosted Cormorant Garamond + Inter woff2 in `assets/`, referenced from `nerocasa.css.liquid`.
- **Package manager:** None for the theme. Shopify CLI (`shopify theme push`, `shopify theme check`) used operationally.
- **Build/dev tooling:** CSS is authored in `assets/nerocasa.css.liquid`. Integrity checks: `node scripts/test-storefront.mjs`. Theme Check still reports split hero-shell snippets and RemoteAsset warnings.
- **Hosting / deployment target:** Shopify Online Store. Store domain observed in scripts/docs: `zhjbdz-yw.myshopify.com`. Public site: `www.nerocasa.com` (from prior operational use; not hardcoded as canonical in `theme.liquid`). GitHub: `https://github.com/NeroCasa/NeroCasa` (from theme_info).
- **Repository layout notes:** Custom `ncs-*` sections and `nc-*` snippets rather than Dawn. Extra top-level `scripts/`, `SETUP.md`, `CHECKOUT-SETUP.md`, `MANUAL-ADMIN-SETUP.md`. Agent system lives at repo root: `AGENTS.md`, `docs/`, `.cursor/skills/` (skills are tracked; other `.cursor/` files stay gitignored).

## Environments
| Environment | URL / target | Notes |
|---|---|---|
| Production | Live theme historically named NeroCasa/main (Shopify theme id observed: `#161950105824`) | Push only with `--live --allow-live` when explicitly requested |
| Staging / unpublished | Atelier draft historically `#162217230560`; other unpublished themes may exist | Prefer `--theme <id>` or `--unpublished` |
| Local dev | This repo | Edit files; Shopify CLI push to a theme to preview |

## Key Constraints
- Brand gold `#A57B00`, background `#080807`. Do not restyle gold CASA / “Custom” wording / nav labels unless asked.
- Product gallery `.ncs-main-product-image img` must stay natural ratio / `object-fit: contain` (never cover-crop). Card tiles `.ncs-fit-img img` use `object-fit: cover`.
- Catalog of 9 products (`cft-1` Soglia, `cft-2` Equilibrio, `cft-3` Monolite; `cs-1` Galleria, `cs-2` Passaggio, `cs-3` Atrio; `sd-1` Nodo, `sd-2` Punto, `sd-3` Scalino) and collections `coffee-tables`, `side-tables`, `console-tables`, `the-9`. Do not restructure catalog or The 9 membership unless asked.
- Locked public copy observed in code/settings: hero “Furniture in stone”; home heading “The 9”; CTAs “Our collection”; collection “The 9”.
- Contacts in theme settings defaults: WhatsApp `+971 56 878 8789`, phone `+971 50 858 8828`, email `nerocasamarbles@gmail.com`.
- Cart/checkout is Shopify native plus theme AJAX add-to-cart in `assets/nerocasa.js`. Do not change payment/checkout unless asked.
- `/collections` lists The 9 only; type collections coffee/side/console are tiles on The 9 collection template (`templates/collection.the-9.json`). Only-child index tile caps at 480px. Marble hero stays on.
- `templates/*.json` are merchant-editable; do not overwrite carelessly.

## Ownership / Stakeholders
- Theme author in schema: NeroCasa. Support URL: GitHub issues on NeroCasa/NeroCasa.
- Payments, legal pages, pricing, and catalog membership should be confirmed with the store owner before edits.

## Summary of Current State
A custom, production Shopify theme with a dark gold-on-black luxury visual layer in one stylesheet (`assets/nerocasa.css.liquid`), JSON templates, and a small catalog of nine marble products. Storefront design was accepted and published live 2026-09-17 (NeroCasa/main `#161950105824`). Storefront JS is two deferred files (header/cart/cursor/parallax + catalog search + scroll reveal). No theme-level analytics pixels were found; apps may still inject via `{{ content_for_header }}`. `/collections` uses a marble hero and a single The 9 tile. Agent system: `AGENTS.md`, `docs/`, `.cursor/skills/`, always-on rule `.cursor/rules/always-use-skills.mdc`.
