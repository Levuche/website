import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** A phone outline to show a creator site in, as on the home page. */
export function PhoneFrame({
  scheme = 'dark',
  label,
  caption,
  children,
  className,
}: {
  scheme?: 'light' | 'dark';
  /** Accessible name, such as "Example creator site on Levuche". */
  label: string;
  /** Shown under the screen, such as the site's address. */
  caption?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure
      data-site={scheme}
      aria-label={label}
      className={cn(
        'border-lv-text bg-site-bg text-site-text shadow-lv m-0 box-border flex w-[min(100%,320px)] flex-col gap-3.5 rounded-[40px] border-[10px] px-5 py-[26px]',
        className
      )}
    >
      {children}
      {caption ? (
        <figcaption className="text-site-text-2 text-center text-xs">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
