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
  return { path, item: await getEntry('blogs', path) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path, item } = await load(params);
  if (!item) return {};
  return pageMetadata({
    path: `/blog/${path}`,
    title: item.seo?.title || item.title,
    description:
      item.seo?.description ||
      item.description ||
      'News, guides and stories from Levuche.',
  });
}

export default async function BlogEntry({ params }: Props) {
  const { path, item } = await load(params);
  if (!item) notFound();
  return (
    <SiteShell>
      <EntryPage item={item} path={path} base="/blog" backLabel="All posts" />
    </SiteShell>
  );
}
