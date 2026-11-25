import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsNav } from '@/components/content/docs-nav';
import { EntryPage } from '@/components/content/entry-page';
import { SiteShell } from '@/components/site-shell';
import { getDocPages, getEntry, groupDocs } from '@/lib/content';
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
  const [{ path, item }, docs] = await Promise.all([
    load(params),
    getDocPages(),
  ]);
  if (!item) notFound();
  const groups = groupDocs(docs);
  return (
    <SiteShell>
      <div className="mx-auto grid max-w-[1184px] grid-cols-1 items-start md:grid-cols-[240px_minmax(0,1fr)] md:gap-6 md:px-[clamp(16px,3vw,32px)]">
        <aside className="hidden pt-7 md:block">
          <DocsNav groups={groups} current={path} />
        </aside>
        <EntryPage item={item} path={path} base="/docs" backLabel="All docs" />
      </div>
    </SiteShell>
  );
}
