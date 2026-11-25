import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './spinner';

/*
 * shadcn/ui Button, in Levuche's styles: pill-shaped, at least 44 px tall
 * (WCAG 2.5.8). `default` is navy on light and amber on dark; `accent` is the
 * amber call to action.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-[inherit] whitespace-nowrap no-underline transition-[box-shadow,transform,border-color] duration-150 outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-lv-accent disabled:pointer-events-none disabled:cursor-not-allowed motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground font-bold hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(20,21,74,0.28)] disabled:bg-secondary disabled:text-muted-foreground',
        accent:
          'bg-lv-accent text-lv-on-accent font-bold hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(20,21,74,0.28)] disabled:bg-secondary disabled:text-muted-foreground',
        outline:
          'border-border text-lv-link hover:border-lv-link border-2 bg-transparent font-semibold disabled:text-muted-foreground',
        destructive:
          'border-lv-danger-border text-destructive hover:border-destructive border-2 bg-transparent font-semibold disabled:opacity-60',
        ghost:
          'text-lv-link hover:bg-accent bg-transparent font-semibold disabled:text-muted-foreground',
        link: 'text-lv-link bg-transparent font-semibold underline-offset-4 hover:underline',
      },
      size: {
        default: 'min-h-11 px-5 text-[15px]',
        lg: 'min-h-[52px] px-8 text-lg',
        icon: 'border-border hover:border-lv-link size-11 rounded-xl border-2',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child (such as a Next <Link>) with the button's styles. */
    asChild?: boolean;
    /** Shows a spinner, sets aria-busy and blocks clicks. */
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={asChild ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      {...(asChild ? {} : { type: props.type ?? 'button' })}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading ? (
            <Spinner role={undefined} aria-label={undefined} aria-hidden />
          ) : null}
          {children}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
