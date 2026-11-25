import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** shadcn/ui Badge: a small status pill (Live, Draft, Handled, Failed). */
const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full px-3 py-[5px] text-[13px] leading-none font-semibold whitespace-nowrap [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-lv-accent text-lv-on-accent font-bold',
        secondary: 'bg-secondary text-lv-text-2',
        success: 'bg-lv-success-bg text-lv-success',
        warning: 'bg-lv-accent-soft text-lv-on-accent-soft',
        destructive: 'border-lv-danger-border text-destructive border py-1',
        outline: 'border-border text-foreground border py-1',
      },
    },
    defaultVariants: { variant: 'secondary' },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
