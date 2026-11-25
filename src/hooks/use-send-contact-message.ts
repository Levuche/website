'use client';

import { useMutation } from '@tanstack/react-query';
import { postJson } from '@/lib/api';
import { goal } from '@/lib/goals';

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  /** The hidden field bots fill in; people leave it empty. */
  company?: string;
};

/** Sends the contact form to /api/contact, which passes it to Buildbase. */
export function useSendContactMessage() {
  return useMutation({
    mutationKey: ['contact', 'send'],
    mutationFn: (message: ContactMessage) =>
      postJson<{ ok: true }>('/api/contact', message),
    onSuccess: () => goal('contact_sent'),
  });
}
