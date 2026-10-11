import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every file name keeps its locale suffix as the entry id (e.g. "linden-honey.ru"),
// which is the layout Sveltia CMS writes with i18n structure "multiple_files".
const keepId = ({ entry }: { entry: string }) => entry.replace(/\.(ya?ml|md)$/, '');

const text = z.string().nullish().transform((v) => v ?? '');
const image = z.string().optional().nullable();
// A section or list the admin saved as empty (null) reads as {} / [] instead of breaking the build.
const orEmpty = <T extends z.ZodTypeAny>(fallback: unknown, schema: T) => z.preprocess((v) => v ?? fallback, schema);
const list = orEmpty([], z.array(text));
const section = <S extends z.ZodRawShape>(shape: S) => orEmpty({}, z.object(shape));

// Site texts: one file per page section and locale, src/content/texts/<section>.<locale>.yaml
// (CMS "Тексты сайта"). getHome() in src/lib/site.ts merges them and checks them with homeSchema.
const texts = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/texts', generateId: keepId }),
  schema: z.record(z.string(), z.unknown()).nullish(),
});

export const homeSchema = z.object({
  meta: section({ title: text, description: text }),
  nav: section({ home: text, shop: text, location: text, news: text, reviews: text, gallery: text }),
  ui: section({
    order_honey: text, order_message: text, photo_soon: text, all_news: text, back: text,
    menu: text, close: text, coming_soon: text, price_on_request: text, language: text,
    placeholder_note: text, to_top: text, cart: text, contact_us: text, privacy: text,
  }),
  hero: section({
    title: text, lead: text, cta_primary: text, cta_secondary: text,
    apiary_label: text, open_hive: text,
  }),
  story: section({ number: text, text: text }),
  shop: section({
    title: text, subtitle: text,
    starter_title: text, starter_parts: list, starter_cta: text,
    add_to_cart: text, added: text, preorder: text, order: text, message: text,
    all_products: text, page_title: text, page_text: text, prev: text, next: text,
    badges: section({ in_stock: text, new_harvest: text, preorder: text, sold_out: text }),
    categories: section({ honey: text, colonies: text, hives: text, other: text }),
  }),
  location: section({
    title: text, address: text, text: text, visit_note: text, route_cta: text,
    stops: list, here: text, hours_title: text, days: list,
  }),
  news: section({ title: text }),
  reviews: section({
    title: text, placeholder: text, google_cta: text, write_cta: text, faq_title: text,
    form: section({
      name: text, city: text, text: text, consent: text, submit: text,
      sending: text, success: text, error: text,
    }),
  }),
  faq: orEmpty([], z.array(section({ q: text, a: text, hidden: z.boolean().catch(false) }))),
  gallery: section({
    title: text, text: text,
    photos: orEmpty([], z.array(section({ caption: text, image }))),
  }),
  cart: section({
    title: text, empty: text, back: text, qty: text, remove: text, total: text,
    total_note: text, form_title: text, name: text, phone: text, delivery: text,
    delivery_options: list, address: text, comment: text, submit: text,
    via: text, copied: text, sending: text, success: text, error: text,
    no_channel: text, order_title: text,
  }),
  privacy: section({ title: text, text: text }),
  notfound: section({ title: text, text: text, cta: text }),
  footer: section({ text: text }),
});

// Price is a number in GEL; empty means "price on request".
const price = z
  .union([z.number(), z.string()])
  .optional()
  .nullable()
  .transform((v) => (typeof v === 'number' ? v : v && !Number.isNaN(Number(v)) ? Number(v) : null));

// One card per variety; honey lists its sizes (0.5 kg, 1 kg…) with a price each.
// action: cart = "+" add to cart, preorder / order = button that opens a message to us.
const products = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/products', generateId: keepId }),
  schema: z.object({
    category: z.enum(['honey', 'colonies', 'hives', 'other']).catch('other'),
    title: text,
    text: text,
    variants: z.array(z.object({ size: z.coerce.string().default(''), price })).default([]),
    badge: z.enum(['none', 'in_stock', 'new_harvest', 'preorder', 'sold_out']).catch('none'),
    action: z.enum(['cart', 'preorder', 'order']).catch('cart'),
    cta: text,
    image,
    order: z.coerce.number().catch(10),
    available: z.boolean().catch(true),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/news', generateId: keepId }),
  schema: z.object({
    title: text,
    date: z.coerce.date().catch(() => new Date()),
    excerpt: text,
    image,
    example: z.boolean().catch(false),
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/settings', generateId: keepId }),
  schema: z.object({
    // site.yaml — contacts
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    telegram: z.string().optional(),
    email: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    google_maps: z.string().optional(),
    google_review_url: z.string().optional(),
    lat: z.number().optional().catch(undefined),
    lng: z.number().optional().catch(undefined),
    // site.yaml — business facts (search engines, AI assistants)
    hours: z.array(z.object({
      days: z.array(z.enum(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'])).catch([]),
      opens: z.string().default(''),
      closes: z.string().default(''),
    })).optional(),
    founded: z.string().optional(),
    hives_count: z.string().optional(),
    languages: z.array(z.string()).optional(),
    // site.yaml — orders and forms
    order_channel: z.enum(['auto', 'whatsapp', 'telegram', 'email', 'webhook']).optional().catch('auto'),
    order_webhook: z.string().optional(),
    forms_key: z.string().optional(),
    // reviews.yaml
    reviews: z.array(z.object({
      quote: text, author: text, place: text, lang: text,
    })).optional(),
  }),
});

export const collections = { texts, products, news, settings };
