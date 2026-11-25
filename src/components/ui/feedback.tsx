import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon } from './icons';

export type AlertTone = 'success' | 'notice' | 'danger';

/**
 * Alerts board. Success and notice are announced politely (role="status");
 * danger is announced at once (role="alert").
 */
export function Alert({
  tone = 'notice',
  action,
  children,
  className,
}: {
  tone?: AlertTone;
  /** A link or button at the end, such as "Open policy". */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const tones: Record<AlertTone, string> = {
    success: 'bg-lv-success-bg text-lv-success',
    notice: 'bg-lv-accent-soft text-lv-on-accent-soft',
    danger: 'border-lv-danger-border text-lv-danger border-2',
  };
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn(
        'flex flex-wrap items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm font-semibold',
        action && 'justify-between',
        tones[tone],
        className
      )}
    >
      <span className="flex items-center gap-2.5">
        {tone === 'success' ? <CheckIcon size={18} /> : null}
        {children}
      </span>
      {action}
    </div>
  );
}

/** Empty state: a dashed box with a title, a line of help and one action. */
export function EmptyState({
  title,
  children,
  action,
  className,
}: {
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'border-lv-border flex flex-col items-center gap-2.5 rounded-2xl border-2 border-dashed p-6 text-center',
        className
      )}
    >
      <p className="m-0 font-bold">{title}</p>
      {children ? (
        <p className="text-lv-text-2 m-0 text-sm">{children}</p>
      ) : null}
      {action}
    </div>
  );
}
