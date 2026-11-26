import { getContentTree } from '@/lib/content';
import { BLOG_FEED } from '@/lib/metadata';
import { absoluteUrl, site } from '@/lib/site';

// Lists the published posts in Buildbase, so it is built per request (the SDK
// client caches the reads, and the content webhook clears that cache).
export const dynamic = 'force-dynamic';

const DESCRIPTION = 'News, guides and stories from Levuche.';

/** Text made safe for an XML element or attribute. */
function xml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** An RSS date (RFC 822), or null when the value isn't a date. */
function rssDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toUTCString();
}

/**
 * /blog/rss.xml: the blog's published posts as an RSS 2.0 feed, newest first,
 * as Buildbase lists them. Every page links it in its head, and the blog page
 * links it too. With no posts (or no Buildbase) it is a valid empty feed.
 */
export async function GET() {
  const tree = await getContentTree('blogs');
  const posts = tree.all.slice(0, 50);
  const blogUrl = absoluteUrl('/blog');
  const feedUrl = absoluteUrl(BLOG_FEED.url);
  const newest = posts
    .map((post) => rssDate(post.publishedAt ?? post.updatedAt))
    .find((date): date is string => date !== null);

  const items = posts.map((post) => {
    const url = absoluteUrl(`/blog/${post.path}`);
    const date = rssDate(post.publishedAt ?? post.updatedAt);
    return [
      '    <item>',
      `      <title>${xml(post.title)}</title>`,
      `      <link>${xml(url)}</link>`,
      `      <guid isPermaLink="true">${xml(url)}</guid>`,
      post.description
        ? `      <description>${xml(post.description)}</description>`
        : null,
      date ? `      <pubDate>${date}</pubDate>` : null,
      '    </item>',
    ]
      .filter((line): line is string => line !== null)
      .join('\n');
  });

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${xml(BLOG_FEED.title)}</title>`,
    `    <link>${xml(blogUrl)}</link>`,
    `    <description>${xml(DESCRIPTION)}</description>`,
    '    <language>en</language>',
    `    <copyright>${xml(`© ${site.owner.name}`)}</copyright>`,
    `    <atom:link href="${xml(feedUrl)}" rel="self" type="application/rss+xml"/>`,
    newest ? `    <lastBuildDate>${newest}</lastBuildDate>` : null,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ]
    .filter((line): line is string => line !== null)
    .join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
  });
}
