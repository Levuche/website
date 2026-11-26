import type { MetadataRoute } from 'next';
import { notFound } from 'next/navigation';
import { allFolders, getContentTree } from '@/lib/content';
import { legalPages } from '@/lib/legal';
import { absoluteUrl, isIndexable } from '@/lib/site';

// Lists the blog posts and docs in Buildbase, so it is built per request.
export const dynamic = 'force-dynamic';

/**
 * sitemap.xml: every public page, on levuche.com only. The dev site and
 * preview links have no sitemap at all (404), so nothing lists their pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexable) notFound();
  const [blog, docs] = await Promise.all([
    getContentTree('blogs'),
    getContentTree('docs'),
  ]);
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
  // Folder pages and posts, at the paths their Buildbase folders give them.
  const folders = [
    ...allFolders(blog).map((folder) => `/blog/${folder.path}`),
    ...allFolders(docs).map((folder) => `/docs/${folder.path}`),
  ].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));
  const entries = [
    ...blog.all.map((item) => ({ item, base: '/blog' })),
    ...docs.all.map((item) => ({ item, base: '/docs' })),
  ].map(({ item, base }) => {
    const modified = item.updatedAt ?? item.publishedAt;
    return {
      url: absoluteUrl(`${base}/${item.path}`),
      ...(modified ? { lastModified: modified } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });
  return [...pages, ...folders, ...entries];
}
