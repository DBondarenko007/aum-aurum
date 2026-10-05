# Aum Aurum — project context for Claude

Personal (non-work) project: business-card website for a family apiary, built by the
user together with their sister. **BRIEF.md is the source of truth** for business, content and
decisions; **DESIGN.md is the source of truth for the look** (approved style). Read both first.

## Decisions so far (2026-10-04)
- Business: honey (main), bee colonies, hives built to order. Apiary in **Navazi village,
  Mtskheta municipality, Georgia**, on the Mtskheta–Stepantsminda highway (road to Kazbegi).
- Site languages: **ka, ru, en** (`/ka/ /ru/ /en/`; `/` redirects by saved choice → browser → en).
- Stack: **Astro 7 (static) + Sveltia CMS** admin at `/admin/`. Hosting (Cloudflare Pages) and a
  Telegram bot for orders come **later**.
- **Published (2026-10-05):** GitHub repo https://github.com/DBondarenko007/aum-aurum (public,
  personal account), live site https://dbondarenko007.github.io/aum-aurum/ via GitHub Pages
  (`.github/workflows/deploy.yml`, every push to `main` redeploys in ~1 min). Astro `base` is
  `/aum-aurum`; all links go through `url()` in `src/lib/site.ts`. Commit author in this repo:
  Dmitry Bondarenko <bondarenko.da007@gmail.com> (local git config).
- **The admin commits straight to GitHub** — always `git pull` before editing locally. Push only
  with the user's OK.
- Logo: vector version of the family's 3D render, **gold bars stay** (user's call — do not
  propose removing them again). Files in `assets/logo/`; site uses `src/components/Mark.astro`.
- **Approved style = demo D** (`demos/d-combined.html`, described in DESIGN.md): soot/gold logo
  world, Cinzel wordmark, apiary animation, hive-frame shop, night mountain + road to Navazi,
  bee scroll rail, polaroid gallery. The sister-draft look (blush/olive/plum, Inter Light) and
  pottery1.com layout are **retired**. Demos A–C stay in `demos/` as history.
- Sections: **Home, Shop, News, Location, Reviews, Gallery** (in that order); the family story
  ("5 500 years") lives in Home, contacts in the footer.
- **The Astro site in `src/` is built in style D** (2026-10-04). Demos A–C were deleted (they
  remain in git history); only `demos/d-combined.html` is kept as the visual reference.
- Georgian texts are machine drafts — a native speaker must proofread before publishing.
- Every suggestion of Claude's that changes scope must be agreed with the user first.

## Rules
- Colours, fonts, components: follow DESIGN.md. Gold text only on dark backgrounds — on paper
  use wine or soot.
- Fonts: Cinzel (wordmark only), Forum (headings/UI), PT Serif (body), Noto Serif Georgian for
  Georgian; self-host via @fontsource. No uppercase transforms for `:lang(ka)`.
- No invented facts: prices, honey varieties, reviews, years, hive counts stay empty/placeholder
  until the family provides them. Placeholder news is flagged `example: true`.
- Do not call honey "organic" without a certificate (BRIEF.md §8.1).
- Package versions are pinned (`--save-exact`); ask before installing or upgrading anything.

## Structure
- `src/content/home/{ka,ru,en}.yaml` — all page texts by section: meta, nav, ui, hero, story,
  shop, location, news, reviews, gallery (8 polaroid captions + photos), footer (CMS: "Тексты сайта")
- `src/content/products/<slug>.<locale>.yaml` — products; `src/content/news/<slug>.<locale>.md` — news
- `src/content/settings/{site,reviews}.yaml` — contacts, map, hours, business facts, order channel
  (`order_channel`, `order_webhook`), Web3Forms key (`forms_key`), reviews (not translated)
- Home yaml also holds `faq` (Q&A list, `hidden` = draft), `cart`, `privacy`, `notfound` texts
- Products: `category` honey | colonies | hives | other; `variants` [{size, price}] (one honey card
  = one variety); `action` cart | preorder | order; `cta` custom button text. Cart keys are
  `<slug>#<variant index>`. Components: HoneyFrame, HiveCard, Ribbon; page `src/pages/[lang]/shop.astro`
- Cart: `src/scripts/cart.ts` (localStorage), `src/pages/[lang]/cart.astro` (checkout → WhatsApp /
  Telegram / e-mail / Apps Script webhook); stage-2 receiver `tools/orders-apps-script.gs`
- SEO/AI: `src/lib/seo.ts` (schema.org LocalBusiness + Offers + FAQPage), `src/pages/llms.txt.ts`,
  `sitemap.xml.ts`, `robots.txt.ts` (robots only effective at a custom domain root), `public/og.png`
- Family guide for orders, review form, FAQ, hours: `docs/ORDERS.md`
- `src/content.config.ts` — schemas; `src/lib/site.ts` — locale helpers, contact links
- `src/components/` — Header, BeeRail, Home + Apiary, Shop, Location, News, Reviews, Gallery,
  Footer, Mark (logo); `src/styles/global.css` — design tokens (DESIGN.md)
- `public/admin/config.yml` — Sveltia CMS config (backend repo is a TODO placeholder)
- `public/uploads/` — images uploaded through the admin
- `demos/` — style demos; `d-combined.html` is the approved reference
- `assets/` — brief images and logo sources

## Commands
- `npm install` · `npm run dev` (http://localhost:4321) · `npm run build` (→ `dist/`) · `npm run preview`
- Demos are standalone HTML: open by double click (fonts load from Google Fonts).

## Next steps
1. Family fills real facts in the admin (contacts, hours, prices, FAQ answers, photos); then
   Umami + Google Search Console + Bing Webmaster, Google Business Profile.
2. Optional: Web3Forms key (review form), Telegram bot + Apps Script (docs/ORDERS.md).
3. Real content: photos, contacts, prices, family story, Georgian proofreading.
3. Shop sub-pages (`/shop/honey`, `/shop/bee-colonies`, `/shop/hives`), order forms.
4. Telegram bot for orders; optional one-click GitHub login for the admin.
5. Custom domain (then SITE = domain, BASE = '/'). Logo wordmark to outlines (paths) for print.
