import type { Metadata } from 'next';
import { SearchPage } from '@/components/content/search-page';
import { SiteShell } from '@/components/site-shell';
import { pageMetadata } from '@/lib/metadata';
import { searchContent } from '@/lib/search';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const first = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? '';

export const metadata: Metadata = {
  ...pageMetadata({
    path: '/blog/search',
    title: 'Search the blog',
    description: 'Search Levuche blog posts, tags and folders.',
    image: '/og/blog.png',
  }),
  // Result pages stay out of search engines; the posts themselves are listed.
  robots: { index: false, follow: true },
};

/** /blog/search?q=…, ?tag=<slug> and ?in=<folder path>. */
export default async function BlogSearch({ searchParams }: Props) {
  const params = await searchParams;
  const result = await searchContent('blogs', {
    query: first(params.q),
    tag: first(params.tag),
    folder: first(params.in),
  });
  return (
    <SiteShell>
      <SearchPage result={result} base="/blog" />
    </SiteShell>
  );
}
