import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { DocsNav } from '@/components/content/docs-nav';
import { EntryPage, folderCrumbs } from '@/components/content/entry-page';
import { FolderPage } from '@/components/content/folder-page';
import { SiteShell } from '@/components/site-shell';
import { findFolder, getContentTree, getEntry } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ path: string[] }> };

const DESCRIPTION = 'How to set up and run your Levuche site.';

/**
 * A path under /docs names a page (`folder/slug`) or a folder (`folder`), as
 * filed in Buildbase. Cached per request, so the metadata and the page share
 * one read.
 */
const load = cache(async (path: string) => {
  const tree = await getContentTree('docs');
  const item = await getEntry('docs', path, tree);
  const folder = item ? null : findFolder(tree, path);
  const parent = path.split('/').slice(0, -1).join('/');
  const above = parent ? findFolder(tree, parent) : null;
  const parents = above ? [...above.parents, above.folder] : [];
  return { tree, item, folder, parents };
});

async function pathOf(params: Props['params']) {
  return (await params).path.map(decodeURIComponent).join('/');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = await pathOf(params);
  const { item, folder } = await load(path);
  if (item) {
    return pageMetadata({
      path: `/docs/${path}`,
      title: item.seo?.title || item.title,
      description: item.seo?.description || item.description || DESCRIPTION,
    });
  }
  if (folder) {
    return pageMetadata({
      path: `/docs/${path}`,
      title: `${folder.folder.name} · Docs`,
      description: DESCRIPTION,
    });
  }
  return {};
}

export default async function DocsEntry({ params }: Props) {
  const path = await pathOf(params);
  const { tree, item, folder, parents } = await load(path);
  if (!item && !folder) notFound();
  return (
    <SiteShell>
      <div className="max-w-layout md:px-gutter mx-auto grid grid-cols-1 items-start md:grid-cols-[240px_minmax(0,1fr)] md:gap-6">
        <aside className="max-md:border-lv-border max-md:px-gutter pt-7 max-md:order-last max-md:border-t max-md:pb-14">
          <DocsNav tree={tree} current={path} />
        </aside>
        {item ? (
          <EntryPage
            item={item}
            path={path}
            base="/docs"
            crumbs={folderCrumbs('/docs', 'Docs', parents)}
          />
        ) : folder ? (
          <FolderPage
            folder={folder.folder}
            entries={folder.folder.entries}
            base="/docs"
            crumbs={folderCrumbs('/docs', 'Docs', folder.parents)}
          />
        ) : null}
      </div>
    </SiteShell>
  );
}
