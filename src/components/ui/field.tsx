import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';

/*
 * shadcn/ui Field: a label, a control, and a description or error under it.
 * Give the control aria-describedby pointing at the description's or error's
 * id, and aria-invalid when there is an error, so both are announced.
 */
function FieldGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-group"
      className={cn('flex flex-col gap-4', className)}
      {...props}
    />
  );
}

function Field({
  className,
  orientation = 'vertical',
  ...props
}: ComponentProps<'div'> & { orientation?: 'vertical' | 'horizontal' }) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        orientation === 'horizontal'
          ? 'flex min-h-10 items-center gap-2 text-sm pointer-coarse:min-h-11 [&>[data-slot=label]]:font-normal'
          : 'flex flex-col gap-1.5',
        className
      )}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn('cursor-pointer', className)}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-description"
      className={cn('text-muted-foreground m-0 text-[13px]', className)}
      {...props}
    />
  );
}

function FieldError({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-error"
      className={cn(
        'text-destructive m-0 text-[13px] font-semibold',
        className
      )}
      {...props}
    />
  );
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel };
