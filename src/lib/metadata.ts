import type { Metadata } from 'next';
import { absoluteUrl, site } from '@/lib/site';

/** The brand share image (brand kit social/levuche-og-1200x630.png). */
const SHARE_IMAGE = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: 'Levuche',
  type: 'image/png',
};

/** The blog's RSS feed (src/app/blog/rss.xml), linked in every page's head. */
export const BLOG_FEED = {
  url: '/blog/rss.xml',
  title: `${site.name} Blog`,
} as const;

/**
 * Full metadata for one page: title, description, canonical URL, Open Graph
 * and Twitter card. Next.js does not deep-merge `openGraph`, `twitter` or
 * `alternates` from the layout, so every page sets the whole shape here.
 */
export function pageMetadata({
  path,
  title,
  description,
  absoluteTitle = false,
}: {
  /** Path on the site, such as `/pricing`. */
  path: string;
  /** Page name. The layout adds `| Levuche` unless `absoluteTitle`. */
  title: string;
  description: string;
  absoluteTitle?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      types: { 'application/rss+xml': [BLOG_FEED] },
    },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: 'en_US',
      url,
      title: fullTitle,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [{ url: SHARE_IMAGE.url, alt: SHARE_IMAGE.alt }],
    },
  };
}
