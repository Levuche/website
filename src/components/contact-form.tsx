'use client';

import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/feedback';
import { TextAreaField, TextField } from '@/components/ui/field';
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
      <Alert tone="success" className="p-5 text-base">
        Thanks, your message is on its way. We’ll reply by email.
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <TextField
        label="Name"
        name="name"
        required
        maxLength={200}
        autoComplete="name"
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        required
        maxLength={320}
        autoComplete="email"
      />
      <TextAreaField
        label="Message"
        name="message"
        required
        rows={6}
        maxLength={5000}
      />
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
      {error && <Alert tone="danger">{error}</Alert>}
      <Button
        type="submit"
        loading={state === 'sending'}
        className="min-h-12 self-start px-7"
      >
        {state === 'sending' ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  );
}
