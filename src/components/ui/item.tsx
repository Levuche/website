import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** shadcn/ui Item: a list row with a picture, title, detail and an end part. */
function Item({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="item"
      className={cn(
        'border-border flex min-h-16 items-center gap-3.5 border-b py-3 last:border-b-0',
        className
      )}
      {...props}
    />
  );
}

function ItemMedia({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-media"
      className={cn('shrink-0', className)}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-content"
      className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-title"
      className={cn('truncate font-semibold', className)}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="item-description"
      className={cn('text-lv-text-2 m-0 truncate text-sm', className)}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-actions"
      className={cn('shrink-0', className)}
      {...props}
    />
  );
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
};
