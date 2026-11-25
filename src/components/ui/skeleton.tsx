import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** shadcn/ui Skeleton: a grey placeholder while something loads. */
function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'bg-secondary animate-pulse rounded-md motion-reduce:animate-none',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
