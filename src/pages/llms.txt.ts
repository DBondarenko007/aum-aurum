// /llms.txt — a plain-language summary of the apiary for AI assistants (llmstxt.org format).
// Built from the admin content on every deploy, so it updates itself.
import type { APIRoute } from 'astro';
import { LOCALES, getHome, getProducts, getSettings, formatPrice, url, LOCALE_NAME } from '../lib/site';

export const GET: APIRoute = async ({ site: siteUrl }) => {
  const abs = (p: string) => new URL(url(p), siteUrl).href;
  const { site } = await getSettings();
  const en = await getHome('en');
  const lines: string[] = [];
  const push = (...l: string[]) => lines.push(...l);

  push('# Aum Aurum', '', `> ${en.meta.description}`, '');
  push(
    'Aum Aurum is a family apiary in the village of Navazi (Mtskheta municipality, Georgia), right on the',
    'Georgian Military Road (Mtskheta — Stepantsminda highway), the main route from Tbilisi to Ananuri,',
    'Gudauri and Kazbegi. The family sells honey (main product), raises bee colonies for sale and builds',
    'beehives by hand.',
    '',
  );

  push('## Facts', '');
  push(`- Location: Navazi village, Mtskheta municipality, Mtskheta-Mtianeti, Georgia`);
  if (site.lat && site.lng) push(`- Coordinates: ${site.lat}, ${site.lng} (https://www.google.com/maps?q=${site.lat},${site.lng})`);
  const hours = (site.hours ?? []).filter((h) => h.days.length && h.opens && h.closes);
  if (hours.length) push(`- Opening hours: ${hours.map((h) => `${h.days.join(',')} ${h.opens}-${h.closes}`).join('; ')}`);
  if (site.phone) push(`- Phone: ${site.phone}`);
  if (site.whatsapp) push(`- WhatsApp: ${site.whatsapp}`);
  if (site.telegram) push(`- Telegram: @${site.telegram.replace(/^@/, '')}`);
  if (site.email) push(`- E-mail: ${site.email}`);
  if (site.founded) push(`- Apiary since: ${site.founded}`);
  if (site.hives_count) push(`- Number of hives: ${site.hives_count}`);
  push(`- Languages spoken: ${(site.languages ?? ['ka', 'ru', 'en']).map((l) => LOCALE_NAME[l as keyof typeof LOCALE_NAME] ?? l).join(', ')}`);
  push(`- How to order: add products to the cart on the website (${abs('/en/cart/')}) or message us; visits by phone arrangement.`, '');

  push('## Products', '');
  const products = await getProducts('en');
  for (const p of products.filter((p) => p.data.available)) {
    const sizes = p.data.variants.map((v) => `${v.size ? `${v.size} ` : ''}${formatPrice(v.price, 'en') ?? 'price on request'}`).join('; ');
    const note = p.data.badge !== 'none' ? ` (${p.data.badge.replace('_', ' ')})` : '';
    push(`- ${en.shop.categories[p.data.category]}: ${p.data.title}${p.data.text ? ` — ${p.data.text}` : ''}${sizes ? ` — ${sizes}` : ' — price on request'}${note}`);
  }
  push(`- All products: ${abs('/en/shop/')}`, '');

  for (const lang of LOCALES) {
    const home = lang === 'en' ? en : await getHome(lang);
    const faq = home.faq.filter((f) => !f.hidden && f.q && f.a);
    push(`## ${LOCALE_NAME[lang]}`, '', home.meta.description, '', `- Website: ${abs(`/${lang}/`)}`);
    for (const f of faq) push(`- Q: ${f.q}`, `  A: ${f.a}`);
    push('');
  }

  push('## Pages', '');
  for (const lang of LOCALES) push(`- [${LOCALE_NAME[lang]}](${abs(`/${lang}/`)})`);
  push(`- [News](${abs('/en/news/')})`);

  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
