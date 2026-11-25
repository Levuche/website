import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EntryPage } from '@/components/content/entry-page';
import { SiteShell } from '@/components/site-shell';
import { getEntry } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ path: string[] }> };

async function load(params: Props['params']) {
  const path = (await params).path.map(decodeURIComponent).join('/');
  return { path, item: await getEntry('docs', path) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path, item } = await load(params);
  if (!item) return {};
  return pageMetadata({
    path: `/docs/${path}`,
    title: item.seo?.title || item.title,
    description:
      item.seo?.description ||
      item.description ||
      'How to set up and run your Levuche site.',
  });
}

export default async function DocsEntry({ params }: Props) {
  const { path, item } = await load(params);
  if (!item) notFound();
  return (
    <SiteShell>
      <EntryPage item={item} path={path} base="/docs" backLabel="All docs" />
    </SiteShell>
  );
}
