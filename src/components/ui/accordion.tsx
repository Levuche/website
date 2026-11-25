'use client';

import { ChevronDownIcon } from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui Accordion: questions that open and close, from the keyboard too.
 * Closed answers stay in the page (hidden), so search engines and find-in-page
 * still see them.
 */
function Accordion({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('bg-muted rounded-2xl px-4', className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="m-0 flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'text-foreground focus-visible:outline-lv-accent min-h-control-md text-ui flex flex-1 cursor-pointer items-center justify-between gap-3 border-0 bg-transparent py-2.5 text-left font-[inherit] font-semibold outline-none focus-visible:outline-3 focus-visible:outline-offset-2 [&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          aria-hidden
          className="text-muted-foreground size-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      forceMount
      className="data-[state=open]:animate-accordion-down overflow-hidden text-sm data-[state=closed]:hidden motion-reduce:animate-none"
      {...props}
    >
      <div className={cn('text-lv-text-2 pb-3.5', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
