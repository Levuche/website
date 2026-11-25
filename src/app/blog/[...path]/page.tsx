import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { EntryPage, folderCrumbs } from '@/components/content/entry-page';
import { FolderPage } from '@/components/content/folder-page';
import { SiteShell } from '@/components/site-shell';
import {
  entriesUnder,
  findFolder,
  getContentTree,
  getEntry,
} from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ path: string[] }> };

const DESCRIPTION = 'News, guides and stories from Levuche.';

/**
 * A path under /blog names a post (`folder/slug`) or a folder (`folder`), as
 * filed in Buildbase. Cached per request, so the metadata and the page share
 * one read.
 */
const load = cache(async (path: string) => {
  const tree = await getContentTree('blogs');
  const item = await getEntry('blogs', path, tree);
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
      path: `/blog/${path}`,
      title: item.seo?.title || item.title,
      description: item.seo?.description || item.description || DESCRIPTION,
    });
  }
  if (folder) {
    return pageMetadata({
      path: `/blog/${path}`,
      title: `${folder.folder.name} · Blog`,
      description: DESCRIPTION,
    });
  }
  return {};
}

export default async function BlogEntry({ params }: Props) {
  const path = await pathOf(params);
  const { tree, item, folder, parents } = await load(path);
  if (item) {
    return (
      <SiteShell>
        <EntryPage
          item={item}
          path={path}
          base="/blog"
          crumbs={folderCrumbs('/blog', 'Blog', parents)}
        />
      </SiteShell>
    );
  }
  if (!folder) notFound();
  // Newest first, in the order the full list already has.
  const ids = new Set(entriesUnder(folder.folder).map((entry) => entry.id));
  const entries = tree.all.filter((entry) => ids.has(entry.id));
  return (
    <SiteShell>
      <FolderPage
        folder={folder.folder}
        entries={entries}
        base="/blog"
        crumbs={folderCrumbs('/blog', 'Blog', folder.parents)}
      />
    </SiteShell>
  );
}
