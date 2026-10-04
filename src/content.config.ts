import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every file name keeps its locale suffix as the entry id (e.g. "linden-honey.ru"),
// which is the layout Sveltia CMS writes with i18n structure "multiple_files".
const keepId = ({ entry }: { entry: string }) => entry.replace(/\.(ya?ml|md)$/, '');

const text = z.string().default('');
const image = z.string().optional().nullable();

const home = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/home', generateId: keepId }),
  schema: z.object({
    meta: z.object({ title: text, description: text }),
    nav: z.object({ home: text, shop: text, location: text, news: text, reviews: text, gallery: text }),
    ui: z.object({
      order_honey: text, order_message: text, photo_soon: text, all_news: text, back: text,
      menu: text, close: text, coming_soon: text, price_on_request: text, language: text,
      placeholder_note: text, to_top: text,
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
      starter_title: text, starter_parts: z.array(text).default([]), starter_cta: text,
    }),
    location: z.object({
      title: text, address: text, text: text, visit_note: text, route_cta: text,
      stops: z.array(text).default([]), here: text,
    }),
    news: z.object({ title: text }),
    reviews: z.object({ title: text, placeholder: text }),
    gallery: z.object({
      title: text, text: text,
      photos: z.array(z.object({ caption: text, image })).default([]),
    }),
    footer: z.object({ text: text }),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/products', generateId: keepId }),
  schema: z.object({
    category: z.enum(['honey', 'colonies', 'hives']),
    title: text,
    text: text,
    size: text,
    price: text,
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
    // site.yaml
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    telegram: z.string().optional(),
    email: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    google_maps: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    // reviews.yaml
    reviews: z.array(z.object({
      quote: text, author: text, place: text, lang: text,
    })).optional(),
  }),
});

export const collections = { home, products, news, settings };
