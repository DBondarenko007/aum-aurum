// /robots.txt — search engines and AI crawlers are welcome; the admin is not indexed.
// Note: crawlers read robots.txt only at the domain root, so this takes effect once a custom
// domain is connected. Until then, submit the sitemap in Google Search Console / Bing Webmaster.
import type { APIRoute } from 'astro';
import { url } from '../lib/site';

const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bingbot'];

export const GET: APIRoute = ({ site }) => {
  const admin = url('/admin/');
  const body = [
    'User-agent: *',
    'Allow: /',
    `Disallow: ${admin}`,
    '',
    ...AI_BOTS.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', `Disallow: ${admin}`, '']),
    `Sitemap: ${new URL(url('/sitemap.xml'), site).href}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
