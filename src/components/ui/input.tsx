import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/**
 * Shared by Input, Textarea and NativeSelect: 40 px (44 px on touch
 * screens), 2 px border. Text is 16 px on phones so iOS does not zoom.
 */
export const fieldControl = cn(
  'bg-background text-foreground placeholder:text-muted-foreground border-input min-h-control-sm w-full min-w-0 rounded-xl border-2 px-3 font-[inherit] text-base sm:text-sm',
  'focus-visible:border-primary focus-visible:outline-lv-accent-soft focus-visible:outline-3 focus-visible:outline-offset-0',
  'disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed',
  'aria-invalid:border-destructive'
);

/** shadcn/ui Input. */
function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldControl, className)}
      {...props}
    />
  );
}

export { Input };
