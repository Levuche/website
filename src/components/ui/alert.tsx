import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/*
 * shadcn/ui Alert. Destructive alerts are announced at once (role="alert");
 * the others politely (role="status").
 */
const alertVariants = cva(
  'flex w-full flex-wrap items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm font-semibold [&>svg]:size-[18px] [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-lv-accent-soft text-lv-on-accent-soft',
        success: 'bg-lv-success-bg text-lv-success',
        destructive: 'border-lv-danger-border text-destructive border-2',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

function Alert({
  className,
  variant,
  role,
  ...props
}: ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role={role ?? (variant === 'destructive' ? 'alert' : 'status')}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('font-bold', className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('flex-1', className)}
      {...props}
    />
  );
}

/** Where a link or button sits at the end of an alert, such as "Open policy". */
function AlertAction({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-action"
      className={cn('ml-auto shrink-0', className)}
      {...props}
    />
  );
}

export { Alert, AlertAction, AlertDescription, AlertTitle };
