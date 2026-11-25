import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

/** Inputs board: 48 px high, 2 px border, focus ring in the soft accent. */
export function inputClasses({
  invalid = false,
  className,
}: { invalid?: boolean; className?: string } = {}) {
  return cn(
    'bg-lv-bg text-lv-text placeholder:text-lv-text-3 min-h-12 w-full rounded-xl border-2 px-3.5 font-[inherit] text-[15px]',
    'focus:border-lv-primary focus:outline-lv-accent-soft focus:outline-3 focus:outline-offset-0',
    'disabled:bg-lv-surface-2 disabled:text-lv-text-3 disabled:cursor-not-allowed',
    invalid ? 'border-lv-danger' : 'border-lv-border',
    className
  );
}

type FieldOwnProps = {
  label: ReactNode;
  /** Help under the field, such as "Your site: desiorigins.levuche.page". */
  hint?: ReactNode;
  /** An error replaces the hint and marks the field invalid. */
  error?: ReactNode;
};

function useFieldIds(id?: string) {
  const auto = useId();
  const fieldId = id ?? auto;
  return { fieldId, noteId: `${fieldId}-note` };
}

function FieldShell({
  fieldId,
  noteId,
  label,
  hint,
  error,
  children,
}: FieldOwnProps & {
  fieldId: string;
  noteId: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {error ? (
        <p id={noteId} className="text-lv-danger m-0 text-[13px] font-semibold">
          {error}
        </p>
      ) : hint ? (
        <p id={noteId} className="text-lv-text-3 m-0 text-[13px]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** A labelled text input with its hint or error (Molecules: form field). */
export function TextField({
  label,
  hint,
  error,
  id,
  className,
  ...props
}: FieldOwnProps & InputHTMLAttributes<HTMLInputElement>) {
  const { fieldId, noteId } = useFieldIds(id);
  return (
    <FieldShell {...{ fieldId, noteId, label, hint, error }}>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? noteId : undefined}
        className={inputClasses({ invalid: Boolean(error), className })}
        {...props}
      />
    </FieldShell>
  );
}

/** A labelled text area. */
export function TextAreaField({
  label,
  hint,
  error,
  id,
  className,
  rows = 5,
  ...props
}: FieldOwnProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { fieldId, noteId } = useFieldIds(id);
  return (
    <FieldShell {...{ fieldId, noteId, label, hint, error }}>
      <textarea
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? noteId : undefined}
        className={inputClasses({
          invalid: Boolean(error),
          className: cn('resize-y py-3', className),
        })}
        {...props}
      />
    </FieldShell>
  );
}

/** A labelled select. */
export function SelectField({
  label,
  hint,
  error,
  id,
  className,
  children,
  ...props
}: FieldOwnProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const { fieldId, noteId } = useFieldIds(id);
  return (
    <FieldShell {...{ fieldId, noteId, label, hint, error }}>
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? noteId : undefined}
        className={inputClasses({ invalid: Boolean(error), className })}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}

/** A checkbox or radio with its label, 44 px tall to tap. */
export function Choice({
  label,
  type = 'checkbox',
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode;
  type?: 'checkbox' | 'radio';
}) {
  return (
    <label
      className={cn(
        'inline-flex min-h-11 cursor-pointer items-center gap-2 text-[15px]',
        className
      )}
    >
      <input
        type={type}
        className="accent-lv-primary m-0 size-[22px] flex-none cursor-pointer"
        {...props}
      />
      {label}
    </label>
  );
}

/**
 * Email signup (Molecules): a pill input and button on one row that wraps on
 * small screens. The label is for screen readers only.
 */
export function EmailSignup({
  label = 'Email',
  buttonLabel = 'Join the beta',
  placeholder = 'you@email.com',
  name = 'email',
  busy = false,
  onSubmit,
  className,
}: {
  label?: string;
  buttonLabel?: string;
  placeholder?: string;
  name?: string;
  busy?: boolean;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  className?: string;
}) {
  const id = useId();
  return (
    <form
      onSubmit={onSubmit}
      className={cn('flex flex-wrap gap-2.5', className)}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="email"
        required
        autoComplete="email"
        placeholder={placeholder}
        className={inputClasses({
          className: 'min-w-0 flex-[1_1_200px] rounded-full px-4',
        })}
      />
      <button
        type="submit"
        disabled={busy}
        aria-busy={busy || undefined}
        className="bg-lv-accent text-lv-on-accent min-h-12 cursor-pointer rounded-full border-0 px-[22px] font-[inherit] font-bold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
