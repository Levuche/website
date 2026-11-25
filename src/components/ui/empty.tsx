import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** shadcn/ui Empty: a dashed box with a title, a line of help and an action. */
function Empty({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty"
      className={cn(
        'border-border flex flex-col items-center gap-2.5 rounded-2xl border-2 border-dashed p-6 text-center',
        className
      )}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="empty-title"
      className={cn('m-0 font-bold', className)}
      {...props}
    />
  );
}

function EmptyDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="empty-description"
      className={cn('text-lv-text-2 m-0 text-sm', className)}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-content"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  );
}

export { Empty, EmptyContent, EmptyDescription, EmptyTitle };
