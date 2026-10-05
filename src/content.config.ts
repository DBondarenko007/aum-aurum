import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every file name keeps its locale suffix as the entry id (e.g. "linden-honey.ru"),
// which is the layout Sveltia CMS writes with i18n structure "multiple_files".
const keepId = ({ entry }: { entry: string }) => entry.replace(/\.(ya?ml|md)$/, '');

const text = z.string().default('');
const image = z.string().optional().nullable();
const list = z.array(text).default([]);

const home = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/home', generateId: keepId }),
  schema: z.object({
    meta: z.object({ title: text, description: text }),
    nav: z.object({ home: text, shop: text, location: text, news: text, reviews: text, gallery: text }),
    ui: z.object({
      order_honey: text, order_message: text, photo_soon: text, all_news: text, back: text,
      menu: text, close: text, coming_soon: text, price_on_request: text, language: text,
      placeholder_note: text, to_top: text, cart: text, contact_us: text, privacy: text,
    }),
    hero: z.object({
      title: text, lead: text, cta_primary: text, cta_secondary: text,
      apiary_label: text, open_hive: text,
    }),
    story: z.object({ number: text, text: text }),
    shop: z.object({
      title: text, subtitle: text,
      honey_title: text, honey_image: image,
      colonies_title: text, colonies_text: text, colonies_cta: text, colonies_image: image,
      hives_title: text, hives_text: text, hives_cta: text, hives_image: image,
      starter_title: text, starter_parts: list, starter_cta: text,
      add_to_cart: text, added: text,
      badges: z.object({ in_stock: text, new_harvest: text, preorder: text, sold_out: text }).default({}),
    }),
    location: z.object({
      title: text, address: text, text: text, visit_note: text, route_cta: text,
      stops: list, here: text, hours_title: text, days: list,
    }),
    news: z.object({ title: text }),
    reviews: z.object({
      title: text, placeholder: text, google_cta: text, write_cta: text, faq_title: text,
      form: z.object({
        name: text, city: text, text: text, consent: text, submit: text,
        sending: text, success: text, error: text,
      }).default({}),
    }),
    faq: z.array(z.object({ q: text, a: text, hidden: z.boolean().default(false) })).default([]),
    gallery: z.object({
      title: text, text: text,
      photos: z.array(z.object({ caption: text, image })).default([]),
    }),
    cart: z.object({
      title: text, empty: text, back: text, qty: text, remove: text, total: text,
      total_note: text, form_title: text, name: text, phone: text, delivery: text,
      delivery_options: list, address: text, comment: text, submit: text,
      via: text, copied: text, sending: text, success: text, error: text,
      no_channel: text, order_title: text,
    }).default({}),
    privacy: z.object({ title: text, text: text }).default({}),
    notfound: z.object({ title: text, text: text, cta: text }).default({}),
    footer: z.object({ text: text }),
  }),
});

// Price is a number in GEL; empty means "price on request".
const price = z
  .union([z.number(), z.string()])
  .optional()
  .nullable()
  .transform((v) => (typeof v === 'number' ? v : v && !Number.isNaN(Number(v)) ? Number(v) : null));

const products = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/products', generateId: keepId }),
  schema: z.object({
    category: z.enum(['honey', 'colonies', 'hives']),
    title: text,
    text: text,
    size: text,
    price,
    badge: z.enum(['none', 'in_stock', 'new_harvest', 'preorder', 'sold_out']).default('none'),
    image,
    order: z.number().default(10),
    available: z.boolean().default(true),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/news', generateId: keepId }),
  schema: z.object({
    title: text,
    date: z.coerce.date(),
    excerpt: text,
    image,
    example: z.boolean().default(false),
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
    lat: z.number().optional(),
    lng: z.number().optional(),
    // site.yaml — business facts (search engines, AI assistants)
    hours: z.array(z.object({
      days: z.array(z.enum(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'])).default([]),
      opens: z.string().default(''),
      closes: z.string().default(''),
    })).optional(),
    founded: z.string().optional(),
    hives_count: z.string().optional(),
    languages: z.array(z.string()).optional(),
    // site.yaml — orders and forms
    order_channel: z.enum(['auto', 'whatsapp', 'telegram', 'email', 'webhook']).optional(),
    order_webhook: z.string().optional(),
    forms_key: z.string().optional(),
    // reviews.yaml
    reviews: z.array(z.object({
      quote: text, author: text, place: text, lang: text,
    })).optional(),
  }),
});

export const collections = { home, products, news, settings };
