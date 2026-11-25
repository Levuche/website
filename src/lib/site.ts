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
 * Only a production build on the production host is indexed. Preview and
 * staging builds send noindex (see next.config.ts and scripts/cf-build.mjs).
 */
export const isIndexable =
  siteUrl === PRODUCTION_URL &&
  process.env.NEXT_PUBLIC_SITE_ENV?.trim() !== 'preview';

export const site = {
  name: 'Levuche',
  wordmark: 'levuche',
  description:
    'Levuche turns your Instagram link into a small website that sells your packs, prompts and guides.',
  owner: {
    name: 'Jagodana LLC',
    url: 'https://jagodana.com',
    founder: 'Dharmendra Jagodana',
  },
  themeColor: '#24257A',
} as const;

/** Absolute URL on this site for a path such as `/pricing`. */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return suffix === '/' ? siteUrl : `${siteUrl}${suffix}`;
}
