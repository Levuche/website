import type { BlogPost, DocPage } from '@buildbase/sdk/server';
import Link from 'next/link';
import { contentPath } from '@/lib/content';

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
  items: (BlogPost | DocPage)[];
  base: '/blog' | '/docs';
  showDate: boolean;
}) {
  return (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5 p-0">
      {items.map((item) => {
        const date = showDate ? formatDate(item.publishedAt) : null;
        return (
          <li key={item._id} className="m-0">
            <Link
              href={`${base}/${contentPath(item)}`}
              className="bg-lv-card border-lv-border text-lv-text hover:border-lv-brand flex h-full flex-col gap-2 rounded-[20px] border p-6 no-underline"
            >
              {date ? (
                <span className="text-lv-text-3 text-sm">{date}</span>
              ) : null}
              <span className="text-xl font-bold">{item.title}</span>
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
