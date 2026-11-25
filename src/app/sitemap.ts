import type { MetadataRoute } from 'next';
import { contentPath, getBlogPosts, getDocPages } from '@/lib/content';
import { legalPages } from '@/lib/legal';
import { absoluteUrl } from '@/lib/site';

// Lists the blog posts and docs in Buildbase, so it is built per request.
export const dynamic = 'force-dynamic';

/** sitemap.xml: every public page, on the site's own host only. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, docs] = await Promise.all([getBlogPosts(), getDocPages()]);
  const pages: MetadataRoute.Sitemap = [
    '/',
    '/pricing',
    '/blog',
    '/docs',
    '/contact',
    ...legalPages.map((page) => `/${page.slug}`),
  ].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === '/' || path === '/blog' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path === '/pricing' ? 0.8 : 0.5,
  }));
  const entries = [
    ...posts.map((item) => ({ item, base: '/blog' })),
    ...docs.map((item) => ({ item, base: '/docs' })),
  ].map(({ item, base }) => {
    const modified = (item.updatedAt as string | undefined) ?? item.publishedAt;
    return {
      url: absoluteUrl(`${base}/${contentPath(item)}`),
      ...(modified ? { lastModified: modified } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });
  return [...pages, ...entries];
}
