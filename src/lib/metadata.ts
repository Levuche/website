import type { Metadata } from 'next';
import { absoluteUrl, site } from '@/lib/site';

/** The brand share image (brand kit social/levuche-og-1200x630.png). */
const SHARE_IMAGE = '/og.png';

/**
 * A page's share image: one of the site's own (public/og.png, or a page's in
 * public/og/, made by scripts/share-images/make.py) or an https image from
 * Buildbase, such as a blog post's thumbnail. The site's own are 1200x630
 * PNGs; a Buildbase image's size is left for the reader to find.
 */
function shareImage(image: string, alt: string) {
  return image.startsWith('/')
    ? { url: image, width: 1200, height: 630, alt, type: 'image/png' }
    : { url: image, alt };
}

/** A blog post's or doc's own image when it is an https URL, else `fallback`. */
export function entryImage(image: string | undefined, fallback: string) {
  return /^https:\/\//.test(image ?? '') ? (image as string) : fallback;
}

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
  image = SHARE_IMAGE,
}: {
  /** Path on the site, such as `/pricing`. */
  path: string;
  /** Page name. The layout adds `| Levuche` unless `absoluteTitle`. */
  title: string;
  description: string;
  absoluteTitle?: boolean;
  /**
   * The share image: a path on this site (`/og/pricing.png`) or an https URL.
   * The brand image when left out.
   */
  image?: string;
}): Metadata {
  const share = shareImage(image, title);
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
      images: [share],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [{ url: share.url, alt: share.alt }],
    },
  };
}
