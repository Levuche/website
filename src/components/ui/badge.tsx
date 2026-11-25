import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'live' | 'draft' | 'neutral' | 'failed';

const tones: Record<BadgeTone, string> = {
  live: 'bg-lv-success-bg text-lv-success',
  draft: 'bg-lv-accent-soft text-lv-on-accent-soft',
  neutral: 'bg-lv-surface-2 text-lv-text-2',
  failed: 'border-lv-danger-border text-lv-danger border py-1',
};

/** A small status pill: Live, Draft, Handled, Failed. */
export function Badge({
  tone = 'neutral',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-[5px] text-[13px] leading-none font-semibold',
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
