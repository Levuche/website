'use client';

import { useId, useState } from 'react';

type State = 'idle' | 'sending' | 'sent' | 'error';

const MESSAGES: Record<string, string> = {
  invalid_fields: 'Please add your name, a valid email and a message.',
  rate_limited: 'Too many messages just now. Please try again in a minute.',
  not_configured:
    'The form isn’t open yet. Please email us at the address above.',
};

/**
 * The contact form. It posts to /api/contact, which hands the message to
 * the Contact form in Buildbase.
 */
export function ContactForm() {
  const id = useId();
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries());
    setState('sending');
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? 'unavailable');
      form.reset();
      setState('sent');
    } catch (err) {
      const code = err instanceof Error ? err.message : '';
      setError(
        MESSAGES[code] ??
          'Your message didn’t send. Please try again, or email us instead.'
      );
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <p
        role="status"
        className="bg-lv-success-bg text-lv-success m-0 rounded-2xl p-5 font-semibold"
      >
        Thanks, your message is on its way. We’ll reply by email.
      </p>
    );
  }

  const label = 'text-sm font-semibold';
  const input =
    'border-lv-border bg-lv-card text-lv-text min-h-12 rounded-xl border-2 px-4 text-base';

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4"
      noValidate={false}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-name`} className={label}>
          Name
        </label>
        <input
          id={`${id}-name`}
          name="name"
          required
          maxLength={200}
          autoComplete="name"
          className={input}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-email`} className={label}>
          Email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          maxLength={320}
          autoComplete="email"
          className={input}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-message`} className={label}>
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={6}
          maxLength={5000}
          className={`${input} py-3`}
        />
      </div>
      {/* Left empty by people; bots tend to fill it. */}
      <div aria-hidden className="hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input
          id={`${id}-company`}
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {error && (
        <p role="alert" className="text-lv-danger m-0 text-sm font-semibold">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === 'sending'}
        className="bg-lv-primary text-lv-on-primary min-h-12 cursor-pointer self-start rounded-full border-0 px-7 font-bold disabled:opacity-60"
      >
        {state === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
