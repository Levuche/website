import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { fieldControl } from './input';

/** shadcn/ui Textarea. */
function Textarea({
  className,
  rows = 5,
  ...props
}: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      rows={rows}
      className={cn(fieldControl, 'resize-y py-3', className)}
      {...props}
    />
  );
}

export { Textarea };
