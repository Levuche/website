import Link from 'next/link';
import type { DocGroup } from '@/lib/content';
import { cn } from '@/lib/utils';

/** Side navigation for the docs, grouped by Buildbase folder. */
export function DocsNav({
  groups,
  current,
}: {
  groups: DocGroup[];
  current: string;
}) {
  return (
    <nav aria-label="Docs" className="flex flex-col gap-0.5 text-[15px]">
      {groups.map((group, i) => (
        <div key={group.name ?? ''} className="flex flex-col gap-0.5">
          {group.name ? (
            <p
              className={cn(
                'text-lv-text-3 mb-2 text-xs font-bold tracking-[0.5px] uppercase',
                i > 0 && 'mt-3.5'
              )}
            >
              {group.name}
            </p>
          ) : null}
          {group.pages.map((page) => {
            const active = page.path === current;
            return (
              <Link
                key={page.path}
                href={`/docs/${page.path}`}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-[10px] px-3 py-2.5 no-underline',
                  active
                    ? 'bg-lv-surface-2 text-lv-text font-semibold'
                    : 'text-lv-text-2 hover:text-lv-text'
                )}
              >
                {page.title}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
