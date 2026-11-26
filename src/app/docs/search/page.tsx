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
    path: '/docs/search',
    title: 'Search the docs',
    description: 'Search the Levuche docs, their tags and folders.',
    image: '/og/docs.png',
  }),
  // Result pages stay out of search engines; the pages themselves are listed.
  robots: { index: false, follow: true },
};

/** /docs/search?q=…, ?tag=<slug> and ?in=<folder path>. */
export default async function DocsSearch({ searchParams }: Props) {
  const params = await searchParams;
  const result = await searchContent('docs', {
    query: first(params.q),
    tag: first(params.tag),
    folder: first(params.in),
  });
  return (
    <SiteShell>
      <SearchPage result={result} base="/docs" />
    </SiteShell>
  );
}
