import { getCollection, getEntry } from 'astro:content';

/** Site-relative URL with the deploy base (e.g. "/aum-aurum") in front; external links pass through. */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (p = '/') => (/^(https?:|mailto:|tel:|#|data:)/.test(p) ? p : `${BASE}/${p.replace(/^\//, '')}`);

export const LOCALES = ['ka', 'ru', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABEL: Record<Locale, string> = { ka: 'ქარ', ru: 'рус', en: 'eng' };
export const LOCALE_NAME: Record<Locale, string> = { ka: 'ქართული', ru: 'Русский', en: 'English' };
export const HTML_LANG: Record<Locale, string> = { ka: 'ka', ru: 'ru', en: 'en' };

const splitId = (id: string) => {
  const dot = id.lastIndexOf('.');
  return { slug: id.slice(0, dot), locale: id.slice(dot + 1) };
};

export async function getHome(lang: Locale) {
  const entry = (await getEntry('home', lang)) ?? (await getEntry('home', 'en'));
  if (!entry) throw new Error('src/content/home/en.yaml is missing');
  return entry.data;
}

/** Entries for one locale; a slug missing in that locale falls back to English. */
async function localized<C extends 'products' | 'news'>(collection: C, lang: Locale) {
  const all = await getCollection(collection);
  const bySlug = new Map<string, (typeof all)[number]>();
  for (const e of all) {
    const { slug, locale } = splitId(e.id);
    if (locale === lang || (locale === 'en' && !bySlug.has(slug))) bySlug.set(slug, e);
  }
  return [...bySlug.entries()].map(([slug, e]) => ({ slug, ...e }));
}

export async function getProducts(lang: Locale) {
  const list = await localized('products', lang);
  return list.sort((a, b) => a.data.order - b.data.order);
}

export async function getNews(lang: Locale) {
  const list = await localized('news', lang);
  return list.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getSettings() {
  const [site, reviews] = await Promise.all([
    getEntry('settings', 'site'),
    getEntry('settings', 'reviews'),
  ]);
  return {
    site: site?.data ?? {},
    reviews: reviews?.data.reviews ?? [],
  };
}

type Site = Awaited<ReturnType<typeof getSettings>>['site'];

/** Contact link for a channel; null when the channel is not filled in yet. */
export function channelLink(site: Site, channel: string, message = '') {
  const digits = (v?: string) => (v ?? '').replace(/[^\d]/g, '');
  switch (channel) {
    case 'whatsapp':
      return digits(site.whatsapp)
        ? { href: `https://wa.me/${digits(site.whatsapp)}${message ? `?text=${encodeURIComponent(message)}` : ''}`, label: 'WhatsApp' }
        : null;
    case 'telegram':
      return site.telegram ? { href: `https://t.me/${site.telegram.replace(/^@/, '')}`, label: 'Telegram' } : null;
    case 'phone':
      return digits(site.phone) ? { href: `tel:+${digits(site.phone)}`, label: site.phone! } : null;
    case 'email':
      return site.email ? { href: `mailto:${site.email}`, label: site.email } : null;
    default:
      return null;
  }
}

export function formatDate(d: Date, lang: Locale) {
  return new Intl.DateTimeFormat(HTML_LANG[lang], { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}
