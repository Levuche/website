import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './icons';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'danger';
export type ButtonSize = 'md' | 'lg';

const base =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-[inherit] no-underline transition-[box-shadow,transform] duration-150 motion-reduce:transition-none disabled:cursor-not-allowed aria-disabled:cursor-not-allowed';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-lv-primary text-lv-on-primary border-0 font-bold hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(20,21,74,0.28)] disabled:bg-lv-surface-2 disabled:text-lv-text-3 disabled:translate-y-0 disabled:shadow-none',
  accent:
    'bg-lv-accent text-lv-on-accent border-0 font-bold hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(20,21,74,0.28)] disabled:bg-lv-surface-2 disabled:text-lv-text-3 disabled:translate-y-0 disabled:shadow-none',
  secondary:
    'border-lv-border text-lv-link border-2 bg-transparent font-semibold hover:border-lv-link disabled:text-lv-text-3 disabled:border-lv-border',
  danger:
    'border-lv-danger-border text-lv-danger border-2 bg-transparent font-semibold hover:border-lv-danger disabled:opacity-60',
};

const sizes: Record<ButtonSize, string> = {
  md: 'min-h-11 px-5 text-[15px]',
  lg: 'min-h-[52px] px-8 text-lg',
};

/**
 * The button's classes, for a link that should look like a button
 * (for example Next's <Link className={buttonClasses()}>).
 */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, sets aria-busy and blocks clicks. */
  loading?: boolean;
};

/** Atoms board: Publish, Accent, Secondary and Remove buttons, 44 px high. */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

/** A square 44 px button holding one icon. `label` is its accessible name. */
export function IconButton({
  label,
  className,
  children,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'border-lv-border text-lv-link hover:border-lv-link inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border-2 bg-transparent disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
