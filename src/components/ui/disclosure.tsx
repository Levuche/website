import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from './icons';

/**
 * One question and its answer, built on <details> so it opens with the
 * keyboard and works before any JavaScript loads.
 */
export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  className,
}: {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      open={defaultOpen}
      className={cn('group bg-lv-surface rounded-2xl px-4 py-3.5', className)}
    >
      <summary className="flex min-h-6 cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDownIcon
          size={20}
          className="text-lv-text-3 flex-none transition-transform group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div className="mt-2.5">{children}</div>
    </details>
  );
}

/** A stack of accordion items. */
export function Accordion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2.5', className)}>{children}</div>
  );
}

/**
 * A list row (Molecules board): optional thumbnail, a title with a detail
 * line, and something at the end such as a price, badge or link.
 */
export function ListRow({
  title,
  detail,
  thumbnail,
  end,
  className,
}: {
  title: ReactNode;
  detail?: ReactNode;
  thumbnail?: ReactNode;
  end?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'border-lv-border flex items-center gap-3 border-b py-3 last:border-b-0',
        className
      )}
    >
      {thumbnail}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-semibold">{title}</span>
        {detail ? (
          <span className="text-lv-text-3 text-[13px]">{detail}</span>
        ) : null}
      </span>
      {end}
    </div>
  );
}
