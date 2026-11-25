'use client';

import { CheckIcon } from 'lucide-react';
import { useId } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  useSendContactMessage,
  type ContactMessage,
} from '@/hooks/use-send-contact-message';
import { ApiError } from '@/lib/api';

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
  const send = useSendContactMessage();

  if (send.isSuccess) {
    return (
      <Alert variant="success" className="p-5 text-base">
        <CheckIcon aria-hidden />
        <AlertDescription>
          Thanks, your message is on its way. We’ll reply by email.
        </AlertDescription>
      </Alert>
    );
  }

  const error = send.error
    ? ((send.error instanceof ApiError && MESSAGES[send.error.code]) ??
      'Your message didn’t send. Please try again, or email us instead.')
    : null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const fields = Object.fromEntries(
          new FormData(event.currentTarget).entries()
        ) as ContactMessage;
        send.mutate(fields);
      }}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
          <Input
            id={`${id}-name`}
            name="name"
            required
            maxLength={200}
            autoComplete="name"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
          <Input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            maxLength={320}
            autoComplete="email"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-message`}>Message</FieldLabel>
          <Textarea
            id={`${id}-message`}
            name="message"
            required
            rows={6}
            maxLength={5000}
          />
        </Field>
      </FieldGroup>
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
      {error && <Alert variant="destructive">{error}</Alert>}
      <Button
        type="submit"
        loading={send.isPending}
        className="min-h-12 self-start px-7"
      >
        {send.isPending ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  );
}
