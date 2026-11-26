'use client';

import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui ToggleGroup, drawn as Levuche's segmented control: a pill with
 * one option pressed at a time when type="single".
 */
function ToggleGroup({
  className,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn(
        'bg-secondary inline-flex w-fit gap-1 rounded-full p-1',
        className
      )}
      {...props}
    />
  );
}

function ToggleGroupItem({
  className,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        'text-lv-text-2 data-[state=on]:bg-card data-[state=on]:text-foreground focus-visible:outline-lv-accent min-h-control cursor-pointer rounded-full border-0 bg-transparent px-4 font-[inherit] text-sm outline-none focus-visible:outline-3 focus-visible:outline-offset-2 data-[state=on]:font-semibold',
        className
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
