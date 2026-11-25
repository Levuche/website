import type { MetadataRoute } from 'next';
import { absoluteUrl, isIndexable } from '@/lib/site';

/** robots.txt: open on levuche.com, closed on previews and staging. */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
