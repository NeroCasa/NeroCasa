# Design System

> Document the design system that actually exists in this project's code — colors, type,
> spacing, components — not an idealized one. Reuse these tokens/components; don't create
> parallel/duplicate systems.

## Design Tokens
### Color
| Token | Value | Used for |
|---|---|---|
| `--nc-gold` / settings.gold | `#A57B00` | CASA, last word of titles, product names, selected stone, fill CTAs, header rule, Coming soon |
| `--nc-bg` / settings.background | `#080807` | Page background |
| Body text (inlined) | `#f2eee6` | Primary ink on dark |
| `--nc-line` | `rgba(242, 238, 230, 0.14)` | Hairlines |
| `--nc-ink` | `#f2eee6` (`nerocasa.css.liquid` `:root`) | Headings / primary text |
| `--nc-muted` | `#9d978d` | Secondary copy |
| `--nc-panel` | `#10100e` | Panels / PDP gallery wash |
| Hover gold | `#c49200` | Button hover |

### Typography
| Token | Font / size / weight / line-height | Used for |
|---|---|---|
| `--nc-display` | `"Cormorant Garamond", Didot, "Bodoni 72", serif` | Headings |
| `--nc-ui` | `"Inter", "Helvetica Neue", Arial, sans-serif` | Body/UI |
| Home hero h1 | `clamp(58px, 9vw, 145px)` (additions) / larger luxury overrides | Home only |
| Compact page h1 | `clamp(36px, 4.8vw, 56px) !important` | Collection/search/custom/B2B/contact/about/legal — home keeps the large hero |
| Home `.nc-casa` | italic, weight 300 | CASA in NEROCASA |

Self-hosted latin woff2: Cormorant Garamond (300/400/500 + italics), Inter (400/500). Body UI is Inter 400, 16px; UI chrome minimum 11px.

### Spacing Scale
| Token | Value |
|---|---|
| `--nc-header-h` | `82px` (header also 68px on small in additions) |
| `--nc-space-xs` | `16px` |
| `--nc-space-sm` | `32px` |
| `--nc-space-md` | `64px` |
| `--nc-space-lg` | `clamp(80px, 10vw, 140px)` |
| `--nc-space-xl` | `clamp(100px, 14vw, 180px)` |
| Horizontal gutters | `8vw` desktop, `6vw` mobile in many layouts |

### Breakpoints
| Name | Width |
|---|---|
| Mobile / stacked | `max-width: 900px` (primary theme breakpoint) |
| Desktop grid | `min-width: 901px` |
| Compact card grid | `601px` mentioned in catalog card sizes |

### Radii / Shadows / Borders
- Buttons: rectangular gold fill, no box-shadow.
- Marble selectors: 10px sample + 14px stone name in a wrapping horizontal row (`nc-marble-choice.liquid`); selected name is gold.
- Product cards, collection tiles, and journal cards: 1px gold-tinted frame; fine-pointer hover scales the image `1.02` (no lift).
- PDP gallery: same hairline frame as cards, no grey panel fill; image stays `object-fit: contain`.
- Header: gold-tinted bottom border (`rgba(165,123,0,.2)`), always-on gold line (not only when scrolled).
- Custom cursor: gold 5px dot + 28px ring.

## Core Components
| Component | Location | Variants | Notes |
|---|---|---|---|
| `.ncs-btn` | additions + luxury | default, `--outline`, `--ghost` | Gold fill CTA; outline/ghost stay transparent with gold border |
| Header | `nc-header.liquid` | desktop nav / hamburger | Search overlay, cart badge |
| Footer | `nc-footer.liquid` | | WhatsApp always; IG/Pinterest if URLs set |
| Product card | `nc-catalog-card.liquid` | | 4:5 cover tile, named stones, From price |
| Collection tile | `nc-collection-tile.liquid` | optional subtitle | Used on index and The 9 type grid |
| Page hero shell | `nc-page-hero-shell-*` | `quiet` skips marble slabs | |
| Marble slabs | `nc-hero-marble-bg.liquid` | dual / triple | Cover-fit backgrounds, CSS filters |
| Forms | contact + B2B `{% form 'contact' %}` | tags `contact-enquiry` / `b2b-enquiry` | Native Shopify contact |
| Loader | `.nc-loader` | | Dismissed on load or reduced-motion |
| Cursor | `.nc-cursor` | hidden on coarse pointer / ≤900px | |

## Motion Language
- Easing `--nc-ease`: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Scroll reveal: `[data-nc-reveal]` via `nerocasa-v20.js` (opacity + translateY, play-once `.is-visible`); `prefers-reduced-motion` forces visible.
- Home hero media parallax `translate3d(0, scrollY * 0.12px)` in `nerocasa.js` (fine pointer, not reduced-motion).
- Button hover is color-only (no lift/shadow); selected stone name turns gold.
- `prefers-reduced-motion`: reveal forced visible, loader/cursor hidden, transitions none (luxury).
- Grain: fixed SVG feTurbulence overlay, opacity 0.035, pointer-events none.

## Imagery & Iconography
- Product card tiles: `object-fit: cover`, aspect 4/5.
- PDP main image: `object-fit: contain`, `aspect-ratio: auto` — do not crop.
- Hero slabs: `object-fit: cover` with brightness/saturate/contrast filters.
- Inline SVG icons for search, cart, WhatsApp, Instagram, Pinterest.
- Bundled catalog JPGs and `hero-slab-*.jpg`, logo `nerocasa-logo-user.png`.

## States Covered
- Buttons: hover, active (luxury). Focus-visible on some social/swatch controls.
- Nav: `.is-active` current section.
- Cart: count badge; AJAX add success `[data-nc-cart-added]`.
- Forms: success/error paragraphs.
- Search: overlay open/close.
- Mobile menu: `hidden` / `.is-open`.
- Missing: **Unknown** dedicated disabled/loading skeletons beyond add-to-cart `aria-busy`. Empty blog has a message in `ncs-blog.liquid`.

## Anti-Patterns Observed
- Unified CSS still contains historical `!important` from the former two-file cascade.
- Page kickers `.ncs-page-kicker { display: none !important; }` so kicker markup is dead.
- Gold last word of multi-word titles via `snippets/nc-title-gold.liquid` (CASA markup and product names stay separate). Outline/ghost CTAs use the same last-word gold; fill CTAs stay gold chips with dark text.
- Named stone selectors via `snippets/nc-marble-choice.liquid`.
- Index collections list: a single The 9 card at 480px; two or more tiles would stay on the 3-up grid.
