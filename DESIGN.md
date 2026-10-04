# Aum Aurum — design system (v2, approved 2026-10-04)

**Reference implementation:** [`demos/d-combined.html`](demos/d-combined.html) — the approved
style. The Astro site in `src/` still has the old v1 look and must be rebuilt to match it.

**Idea:** the world of the logo — soot black, honey gold, comb cream — carried through a family
apiary on the road to Kazbegi. Built from what the family liked in demos A–C:

| Piece | Came from |
|---|---|
| Logo, Cinzel wordmark, soot/gold world | demo C |
| Apiary animation in Home (hives, flying bees, lid lifts) | new |
| Shop as hive frames | demo A |
| Location: mountain at night + road to Navazi | demo B + stage-1 site |
| Bee on the scroll rail | demo B rail, bee instead of a dot |
| Gallery as polaroids on strings | stage-1 site hero |

## Sections and backgrounds (in this order)
| # | Section | Background | Text |
|---|---|---|---|
| 1 | Home | soot | gold wordmark, cream text |
| 2 | Shop | paper (beige) | soot |
| 3 | Location | soot, night scene | cream |
| 4 | News | paper | soot, wine dates/links |
| 5 | Reviews | soot | cream, gold quote marks |
| 6 | Gallery | paper | soot |
| — | Footer | soot | cream-soft |

Header: logo mark only (no wordmark — it duplicates the hero), nav in section order, language switch.

## Colour tokens
| Token | Hex | Use |
|---|---|---|
| `--soot` | #14110E | dark sections, header, footer, night sky |
| `--soot-2` / `--soot-3` | #1D1914 / #2A241D | placeholders, depth |
| `--gold` | #E7B649 | wordmark, primary buttons, accents on dark |
| `--gold-deep` | #C9932E | comb cells, photo placeholders |
| `--wood` | #B98535 | hive-frame wood |
| `--cream` | #EDE1C7 | text on dark, comb, snow, moon |
| `--cream-soft` | #C9BEA6 | secondary text on dark |
| `--paper` | #F6F0E2 | light sections |
| `--wine` | #6E1F2E | dates/links on paper, hive bodies, placeholders |
| `--olive` | #55693A | meadow, grass line, hive bodies |
| `--ridge` / `--ridge-far` | #4D4436 / #2F2821 | mountains |
| `--earth` | #3A3027 | ground under the hives |
| roofs | #B8692F, rim #F0A862, shadow #8C4A1E | copper hive lids |

**Contrast rules:** gold is for dark backgrounds only — never gold text on paper (≈1.6:1); on paper
use wine or soot. Cream on soot, soot on paper, cream on wine all pass AA.

## Type
- **Cinzel 500** — the AUM AURUM wordmark only (same face as the logo). Latin only.
- **Forum** — headings, nav, buttons and labels (uppercase, letter-spacing ~0.12–0.14em). Has Cyrillic.
- **PT Serif** — body text, italic for quotes. Has Cyrillic.
- **Noto Serif Georgian** — Georgian fallback for both Forum and PT Serif. No uppercase for `:lang(ka)`.
- To self-host via @fontsource in the Astro build (pin exact versions; ask before installing).

## Components
- **Buttons:** rectangular, uppercase Forum; gold fill (primary), gold outline (secondary on dark),
  soot fill / soot outline on paper.
- **Hero apiary:** SVG scene, five hives of 2–3 painted bodies (gold, cream, wine, olive, gold-deep,
  slate-blue) with copper roofs, earth ground with a grass line. ~16 bees fly between entrances
  and the sky; hover / click / Enter on a hive lifts its lid and releases a swarm. Scene height
  leaves sky above the tallest hive so the lifted lid is never clipped.
- **Shop frames:** wooden hive frame with a black top bar (lugs stick out), comb-pattern photo slot,
  cream panel. Honey frame is the widest and carries the price list (dotted leaders, tabular
  numbers, "по запросу" when no price). Frame lifts on hover. "Start beekeeping" band in soot.
- **Location scene:** black sky with a cream crescent moon and faint stars, two warm ridges,
  cream snow caps, olive meadow; the road runs along the meadow with stops
  Tbilisi → Mtskheta → **Navazi** (gold hex + drop, "we are here") → … → Kazbegi.
  A gold line draws from Tbilisi to Navazi when the section scrolls into view.
- **News:** ruled list on paper — wine date, Forum title, excerpt, "example" tag.
- **Reviews:** three italic PT Serif quotes on soot with gold quote marks.
- **Gallery:** two strings of polaroids (white frame, wooden pin, caption), gentle sway.
- **Scroll rail:** dotted line at the left, filled gold up to the bee; the bee faces the scroll
  direction (down/up) and flaps while scrolling. Hidden below 900px.

## Motion
Apiary bees, lid lift, frame lift, road draw, polaroid sway, bee rail. All of it stops or becomes
static under `prefers-reduced-motion`.

## Layout
Max content width 1200px, gutter `clamp(16px, 4vw, 56px)`, left offset for the scroll rail on
desktop. First screen (logo, title, buttons, apiary) fits in ~540px of a 1440×900 window.
Phone: one column, three hives visible, road labels rotated, four polaroids per string → three.
