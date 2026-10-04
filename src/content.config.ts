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
    nav: z.object({
      concept: text, shop: text, gallery: text, reviews: text,
      news: text, location: text, contact: text,
    }),
    ui: z.object({
      order_honey: text, order_message: text, photo_soon: text, read_more: text, all_news: text,
      back: text, menu: text, close: text, coming_soon: text, price_on_request: text,
      language: text, placeholder_note: text,
    }),
    hero: z.object({
      title: text, subtitle: text, text: text, cta_primary: text, cta_secondary: text,
      polaroids: z.array(z.object({ caption: text, image })).default([]),
    }),
    concept: z.object({
      history_title: text, history_text: text, history_source: text,
      family_title: text, family_text: text,
      facts: z.array(text).default([]),
      photos: z.array(z.object({ caption: text, image })).default([]),
    }),
    shop: z.object({
      title: text, subtitle: text, cta: text,
      honey_title: text, honey_text: text,
      colonies_title: text, colonies_text: text, colonies_cta: text,
      hives_title: text, hives_text: text, hives_cta: text,
      starter_title: text, starter_text: text, starter_parts: z.array(text).default([]), starter_cta: text,
      seasons: z.array(text).default([]),
    }),
    gallery: z.object({ title: text, text: text }),
    reviews: z.object({ title: text, cta: text, placeholder: text }),
    news: z.object({ title: text }),
    location: z.object({
      title: text, text: text, address: text, hours: text, visit_note: text,
      route_cta: text, stops: z.array(text).default([]), here: text,
    }),
    contact: z.object({
      title: text,
      columns: z.array(z.object({ title: text, text: text, channel: text })).default([]),
      footer: text,
    }),
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
      quote: text, author: text, place: text, lang: text, example: z.boolean().default(false),
    })).optional(),
    // gallery.yaml
    photos: z.array(z.object({
      image, alt: text, tall: z.boolean().default(false),
    })).optional(),
  }),
});

export const collections = { home, products, news, settings };
