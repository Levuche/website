import { Breadcrumbs, type Crumb } from '@/components/content/entry-page';
import { EntryList, FolderList } from '@/components/content/entry-list';
import type { EntryLink, FolderNode } from '@/lib/content';

/**
 * A Buildbase folder's own page: its name, its sub-folders and its posts.
 * Docs show the pages filed directly in the folder; the blog shows every
 * post in the folder and the folders under it, newest first.
 */
export function FolderPage({
  folder,
  entries,
  base,
  crumbs,
}: {
  folder: FolderNode;
  entries: EntryLink[];
  base: '/blog' | '/docs';
  crumbs: Crumb[];
}) {
  const isBlog = base === '/blog';
  return (
    <div className="max-w-layout px-gutter mx-auto flex w-full min-w-0 flex-col gap-8 pt-7 pb-16">
      <div className="flex flex-col gap-2.5">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="text-h1 m-0">{folder.name}</h1>
      </div>
      {folder.folders.length > 0 ? (
        <FolderList
          folders={folder.folders}
          base={base}
          noun={
            isBlog
              ? { one: 'post', many: 'posts' }
              : { one: 'page', many: 'pages' }
          }
        />
      ) : null}
      {entries.length > 0 ? (
        <EntryList items={entries} base={base} showDate={isBlog} />
      ) : null}
    </div>
  );
}
