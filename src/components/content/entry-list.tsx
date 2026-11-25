import Link from 'next/link';
import type { EntryLink, FolderNode } from '@/lib/content';
import { entriesUnder } from '@/lib/content';

export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      });
}

/** Cards for the blog and docs index pages. */
export function EntryList({
  items,
  base,
  showDate,
}: {
  items: EntryLink[];
  base: '/blog' | '/docs';
  showDate: boolean;
}) {
  return (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5 p-0">
      {items.map((item) => {
        const date = showDate ? formatDate(item.publishedAt) : null;
        return (
          <li key={item.id} className="m-0">
            <Link
              href={`${base}/${item.path}`}
              className="bg-lv-card border-lv-border text-lv-text hover:border-lv-brand flex h-full flex-col gap-2 rounded-[20px] border p-6 no-underline"
            >
              {date ? (
                <span className="text-lv-text-3 text-sm">{date}</span>
              ) : null}
              <span className="text-lg font-bold">{item.title}</span>
              {item.description ? (
                <span className="text-lv-text-2 text-base leading-relaxed">
                  {item.description}
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Links to folders, named as in Buildbase, with how many posts each holds. */
export function FolderList({
  folders,
  base,
  noun,
}: {
  folders: FolderNode[];
  base: '/blog' | '/docs';
  noun: { one: string; many: string };
}) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
      {folders.map((folder) => {
        const count = entriesUnder(folder).length;
        return (
          <li key={folder.id} className="m-0">
            <Link
              href={`${base}/${folder.path}`}
              className="bg-lv-card border-lv-border text-lv-text hover:border-lv-brand inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[15px] font-semibold no-underline"
            >
              {folder.name}
              <span className="text-lv-text-3 font-normal">
                {count} {count === 1 ? noun.one : noun.many}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
