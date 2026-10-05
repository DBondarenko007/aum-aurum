// /sitemap.xml with hreflang alternates for every language version.
import type { APIRoute } from 'astro';
import { LOCALES, HTML_LANG, getNews, url } from '../lib/site';

export const GET: APIRoute = async ({ site }) => {
  const abs = (p: string) => new URL(url(p), site).href;
  const paths = ['', 'news/', 'privacy/'];
  const slugs = new Set<string>();
  for (const lang of LOCALES) for (const n of await getNews(lang)) slugs.add(n.slug);
  for (const s of slugs) paths.push(`news/${s}/`);

  const entries = paths.flatMap((path) =>
    LOCALES.map((lang) => {
      const alts = LOCALES.map((l) => `<xhtml:link rel="alternate" hreflang="${HTML_LANG[l]}" href="${abs(`/${l}/${path}`)}"/>`).join('');
      return `<url><loc>${abs(`/${lang}/${path}`)}</loc>${alts}<xhtml:link rel="alternate" hreflang="x-default" href="${abs(`/en/${path}`)}"/></url>`;
    }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
