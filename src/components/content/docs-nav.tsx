import Link from 'next/link';
import type { ContentTree, EntryLink, FolderNode } from '@/lib/content';
import { cn } from '@/lib/utils';

function PageLink({ entry, current }: { entry: EntryLink; current: string }) {
  const active = entry.path === current;
  return (
    <Link
      href={`/docs/${entry.path}`}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'rounded-tile px-3 py-2.5 no-underline',
        active
          ? 'bg-lv-surface-2 text-lv-text font-semibold'
          : 'text-lv-text-2 hover:text-lv-text'
      )}
    >
      {entry.title}
    </Link>
  );
}

function FolderSection({
  folder,
  current,
  depth,
}: {
  folder: FolderNode;
  current: string;
  depth: number;
}) {
  const active = folder.path === current;
  return (
    <div
      className={cn(
        'flex flex-col gap-0.5',
        depth === 0
          ? 'mt-3.5 first:mt-0'
          : 'border-lv-border ml-3 border-l pl-2'
      )}
    >
      <Link
        href={`/docs/${folder.path}`}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'no-underline',
          depth === 0
            ? 'text-lv-text-3 hover:text-lv-text mb-2 text-xs font-bold tracking-wide uppercase'
            : 'text-lv-text-2 hover:text-lv-text mt-1 px-3 py-1.5 text-sm font-semibold',
          active && 'text-lv-text'
        )}
      >
        {folder.name}
      </Link>
      {folder.entries.map((entry) => (
        <PageLink key={entry.id} entry={entry} current={current} />
      ))}
      {folder.folders.map((child) => (
        <FolderSection
          key={child.id}
          folder={child}
          current={current}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

/**
 * Side navigation for the docs, following the Buildbase folder tree: pages
 * outside a folder first, then each folder with its pages and sub-folders.
 */
export function DocsNav({
  tree,
  current,
}: {
  tree: Pick<ContentTree, 'folders' | 'entries'>;
  current: string;
}) {
  return (
    <nav aria-label="Docs" className="text-ui flex flex-col gap-0.5">
      {tree.entries.map((entry) => (
        <PageLink key={entry.id} entry={entry} current={current} />
      ))}
      {tree.folders.map((folder) => (
        <FolderSection
          key={folder.id}
          folder={folder}
          current={current}
          depth={0}
        />
      ))}
    </nav>
  );
}
