'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { legalPages, type LegalGroup } from '@/lib/legal';
import { cn } from '@/lib/utils';

const groups: { label: string; group: LegalGroup }[] = [
  { label: 'LEGAL', group: 'Legal' },
  { label: 'TRUST', group: 'Trust' },
];

export function LegalNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Legal and security"
      className="text-ui flex flex-col gap-0.5"
    >
      {groups.map(({ label, group }, i) => (
        <div key={group} className="flex flex-col gap-0.5">
          <p
            className={cn(
              'text-lv-text-3 mb-2 text-xs font-bold tracking-wide',
              i > 0 && 'mt-3.5'
            )}
          >
            {label}
          </p>
          {legalPages
            .filter((page) => page.group === group)
            .map((page) => {
              const current = pathname === `/${page.slug}`;
              return (
                <Link
                  key={page.slug}
                  href={`/${page.slug}`}
                  aria-current={current ? 'page' : undefined}
                  className={cn(
                    'rounded-tile px-3 py-2.5 no-underline',
                    current
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
