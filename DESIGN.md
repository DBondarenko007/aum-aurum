# Aum Aurum — design system (v1, 2026-10-04)

**Idea:** a family honey stall on the road to Kazbegi. Two signature moments carry it:
polaroids pinned to a string in the first screen (from the sister's draft and the
pottery1.com reference), and the road line Tbilisi → Navazi → Stepantsminda, where a honey
line drives up to Navazi when the section scrolls into view.

## Colour — full palette, whole fields, not accents
| Token | Hex | Owns |
|---|---|---|
| `--blush` | #F7EBEC | page ground, header, concept, shop, news |
| `--olive` | #626B2F | hero, location (fields); subtitles on blush |
| `--plum` | #663366 | headings on blush, reviews field, primary buttons on blush |
| `--honey` | #EFCB68 | big type on olive/plum/ink, honey card, route, marquee |
| `--ink` | #111111 | body text, gallery + contact fields, footer |
| derived | `--paper` #FFFAF6 polaroid frame · `--olive-deep` #4F5725 · `--plum-deep` #4E264E · `--ink-2` #1C1B1A |

Contrast: ink/blush 16.2 · plum/blush 8.1 · honey/plum 6.0 · blush/olive 4.9 · honey/olive 3.7 (large only) · honey/blush 1.35 (never).

## Type
- Inter Variable 300 for display/headings, 400 body; Noto Sans Georgian Variable fills Georgian glyphs.
- Display `clamp(3.25rem … 6rem)`, tracking +0.04em (the sister's airy look); H2 `clamp(2.25rem … 4.5rem)`.
- Georgian (`:lang(ka)`): smaller display/H2, tracking 0.01em, labels without uppercase.
- Labels: 13px, 500, +0.14em, uppercase (not for ka).

## Components
- Buttons: rectangular, 1.5px outline + text arrow →; filled variants honey / ink / plum.
- Photo placeholders: tone field + line pictogram + "photo coming soon" (replaced by real photos via the admin).
- Polaroid: paper frame 9px, caption under photo, wooden pin, slow sway (off with reduced motion).
- Facts strip: full-bleed row with 1px rules between items.
- Price list: name · dotted leader · size · price (tabular numbers), "price on request" when empty.
- No eyebrow labels above headings, no card shadows, no gradients except the tiny pin shading.

## Motion
One sway on the polaroids, one route animation, one slow marquee; all disabled by `prefers-reduced-motion`.
