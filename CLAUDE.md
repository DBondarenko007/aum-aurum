# Aum Aurum — project context for Claude

Personal (non-work) project: business-card website for a family apiary, built by the
user together with their sister. **BRIEF.md is the source of truth** (business, palette,
sections, decisions, open questions). Read it before any change.

## Decisions so far (2026-10-04)
- Business: honey (main), bee colonies, hives built to order. Apiary in **Navazi village,
  Mtskheta municipality, Georgia**, on the Mtskheta–Stepantsminda highway (road to Kazbegi).
- Site languages: **ka, ru, en** (`/ka/ /ru/ /en/`; `/` redirects by saved choice → browser → en).
- Stack: **Astro 7 (static) + Sveltia CMS** admin at `/admin/`. Hosting (Cloudflare Pages) and a
  Telegram bot for orders come **later**.
- **Local git only** (since 2026-10-04, branch `main`, no remote). Commit checkpoints when
  asked; never push. The admin's "Work with Local Repository" mode now has its `.git`.
- Logo: vector version of the family's 3D render, **gold bars stay** (user's call — do not
  propose removing them again). Files in `assets/logo/`; site uses `src/components/Mark.astro`.
- **Redesign in progress (2026-10-04):** the user rejected the sister-draft look (blush/olive/plum
  palette, Inter Light). Three style demos in `demos/` (A painted hive, B road to Kazbegi,
  C logo world) — waiting for the family to pick one. Until then the current site stays as is.
  The family then picked pieces of each → **demo D `demos/d-combined.html`** is the candidate:
  C's soot/gold world + logo + Cinzel wordmark (Forum for headings, PT Serif body), hero apiary
  animation (hives, flying bees, lid lifts on hover), A's hive-frame shop, B's mountain + stage-1
  road to Navazi in Location, bee on the scroll rail, polaroid gallery on strings.
- New section set for the redesign: **Home, Shop, News, Location, Reviews, Gallery** (in that
  order; concept/contacts fold into Home and the footer). Layout follows the chosen style,
  not pottery1.com.
- Georgian texts are machine drafts — a native speaker must proofread before publishing.
- Every suggestion of Claude's that changes scope must be agreed with the user first.

## Rules
- Palette (BRIEF.md §6.2): blush `#F7EBEC` bg, ink `#111111`, olive `#626B2F`, plum `#663366`,
  honey `#EFCB68`. **Honey on blush is unreadable (1.35:1) — never.** Honey on olive only ≥24px.
- Fonts: Inter Variable (Latin/Cyrillic) + Noto Sans Georgian Variable, self-hosted via
  @fontsource. Cinzel only inside the logo wordmark. No uppercase transforms for `:lang(ka)`.
- No invented facts: prices, honey varieties, reviews, years, hive counts stay empty/placeholder
  until the family provides them. Placeholder news is flagged `example: true`.
- Do not call honey "organic" without a certificate (BRIEF.md §8.1).
- Package versions are pinned (`--save-exact`); ask before installing or upgrading anything.

## Structure
- `src/content/home/{ka,ru,en}.yaml` — all page texts (CMS: "Главная страница")
- `src/content/products/<slug>.<locale>.yaml` — products; `src/content/news/<slug>.<locale>.md` — news
- `src/content/settings/{site,reviews,gallery}.yaml` — contacts/map, reviews, gallery (not translated)
- `src/content.config.ts` — schemas; `src/lib/site.ts` — locale helpers, contact links
- `src/components/*` — one component per page section; `src/styles/global.css` — tokens
- `public/admin/config.yml` — Sveltia CMS config (backend repo is a TODO placeholder)
- `public/uploads/` — images uploaded through the admin
- `DESIGN.md` — visual system; `assets/` — brief images and logo sources

## Commands
- `npm install` · `npm run dev` (http://localhost:4321) · `npm run build` (→ `dist/`) · `npm run preview`

## Next steps (not started)
1. `git init` (local) → test admin in Chrome/Edge via "Work with Local Repository".
2. Real content: photos, contacts, prices, family story, Georgian proofreading.
3. Shop sub-pages (`/shop/honey`, `/shop/bee-colonies`, `/shop/hives`), order forms.
4. GitHub repo + Cloudflare Pages + domain + GitHub login for the admin; Telegram bot.
5. Logo wordmark to outlines (paths) for print.
