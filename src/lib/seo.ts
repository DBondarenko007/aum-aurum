// Machine-readable description of the business (schema.org JSON-LD) for search engines and
// AI assistants. Everything comes from the admin content; empty fields are left out.
import { HTML_LANG, type Locale } from './site';

type Site = Record<string, any>;
type Home = Record<string, any>;
type Product = { slug: string; data: { category: string; title: string; text: string; size: string; price: number | null; badge: string; available: boolean } };

const DAY = { Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' } as const;

const clean = <T extends Record<string, any>>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0))) as T;

export function businessJsonLd(opts: { lang: Locale; home: Home; site: Site; products: Product[]; pageUrl: string; homeUrl: string; image: string }) {
  const { lang, home, site, products, pageUrl, homeUrl, image } = opts;
  const digits = (site.phone ?? '').replace(/[^\d+]/g, '');
  const offers = products
    .filter((p) => p.data.available && p.data.badge !== 'sold_out')
    .map((p) => clean({
      '@type': 'Offer',
      itemOffered: clean({ '@type': 'Product', name: [p.data.title, p.data.size].filter(Boolean).join(', '), description: p.data.text, category: p.data.category }),
      price: p.data.price ?? undefined,
      priceCurrency: p.data.price != null ? 'GEL' : undefined,
      availability: p.data.badge === 'preorder' ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock',
    }));
  // Bee colonies and hives are offered even without a price list.
  for (const [cat, name, text] of [
    ['colonies', home.shop.colonies_title, home.shop.colonies_text],
    ['hives', home.shop.hives_title, home.shop.hives_text],
  ]) {
    if (!products.some((p) => p.data.category === cat)) {
      offers.push(clean({ '@type': 'Offer', itemOffered: clean({ '@type': 'Product', name, description: text, category: cat }) }) as any);
    }
  }

  const business = clean({
    '@type': ['LocalBusiness', 'Store'],
    '@id': `${homeUrl}#business`,
    name: 'Aum Aurum',
    description: home.meta.description,
    url: homeUrl,
    image,
    logo: image,
    telephone: digits || undefined,
    email: site.email || undefined,
    address: { '@type': 'PostalAddress', addressLocality: 'Navazi', addressRegion: 'Mtskheta-Mtianeti', addressCountry: 'GE' },
    geo: site.lat && site.lng ? { '@type': 'GeoCoordinates', latitude: site.lat, longitude: site.lng } : undefined,
    hasMap: site.google_maps || (site.lat ? `https://www.google.com/maps?q=${site.lat},${site.lng}` : undefined),
    sameAs: [site.facebook, site.instagram, site.google_maps].filter(Boolean),
    openingHoursSpecification: (site.hours ?? [])
      .filter((h: any) => h.days?.length && h.opens && h.closes)
      .map((h: any) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days.map((d: keyof typeof DAY) => DAY[d]), opens: h.opens, closes: h.closes })),
    foundingDate: site.founded || undefined,
    knowsLanguage: site.languages,
    areaServed: { '@type': 'Country', name: 'Georgia' },
    currenciesAccepted: 'GEL',
    makesOffer: offers,
  });

  const faq = (home.faq ?? []).filter((f: any) => !f.hidden && f.q && f.a);
  const graph: object[] = [
    clean({ '@type': 'WebSite', '@id': `${homeUrl}#website`, url: homeUrl, name: 'Aum Aurum', inLanguage: HTML_LANG[lang], publisher: { '@id': `${homeUrl}#business` } }),
    business,
  ];
  if (faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      inLanguage: HTML_LANG[lang],
      mainEntity: faq.map((f: any) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
