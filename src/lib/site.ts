/**
 * Site identity and addresses. One place for the name, the canonical host
 * and the ownership lines, so pages, metadata and JSON-LD agree.
 */

/** The production host. Only this host is indexed by search engines. */
export const PRODUCTION_URL = 'https://levuche.com';

/** The site's own address, without a trailing slash. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || PRODUCTION_URL
).replace(/\/+$/, '');

/**
 * Only the production host is indexed. The dev site (dev.levuche.com) and any
 * other host send noindex (see next.config.ts).
 */
export const isIndexable = siteUrl === PRODUCTION_URL;

/**
 * The dashboard (the Levuche app), where signed-in people go:
 * https://app.levuche.com in production, https://app-dev.levuche.com for dev.
 */
export const appUrl = (
  process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://app.levuche.com'
).replace(/\/+$/, '');

export const site = {
  name: 'Levuche',
  wordmark: 'levuche',
  description:
    'Levuche turns your Instagram link into a small website that sells your packs, prompts and guides.',
  owner: {
    name: 'Jagodana LLC',
    url: 'https://jagodana.com',
    founder: 'Dharmendra Jagodana',
    address: '1021 E Lincolnway, 7463 Cheyenne, WY 82001',
  },
  themeColor: '#24257A',
} as const;

/** Absolute URL on this site for a path such as `/pricing`. */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return suffix === '/' ? siteUrl : `${siteUrl}${suffix}`;
}
