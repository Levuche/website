import type { MetadataRoute } from 'next';
import { legalPages } from '@/lib/legal';
import { absoluteUrl } from '@/lib/site';

/** sitemap.xml: every public page, on the site's own host only. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/pricing',
    '/contact',
    ...legalPages.map((page) => `/${page.slug}`),
  ];
  return paths.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path === '/pricing' ? 0.8 : 0.5,
  }));
}
