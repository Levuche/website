'use client';

import { useMutation } from '@tanstack/react-query';
import { ApiError, postJson } from '@/lib/api';
import { goal } from '@/lib/goals';
import { solveChallenge, type PowChallenge } from '@/lib/solve-challenge';

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  /** The hidden field bots fill in; people leave it empty. */
  company?: string;
};

type Check =
  | { captcha: null }
  | { captcha: 'pow'; challenge: PowChallenge }
  | { captcha: 'unsupported' };

/**
 * The answer to the form's spam check, when Buildbase asks for one. A fresh
 * challenge for every attempt, since each can be used once.
 */
async function spamCheck(): Promise<string | undefined> {
  const res = await fetch('/api/contact/challenge', { cache: 'no-store' });
  if (!res.ok) throw new ApiError('unavailable', res.status);
  const check = (await res.json()) as Check;
  if (check.captcha === 'pow') return solveChallenge(check.challenge);
  if (check.captcha === 'unsupported')
    throw new ApiError('captcha_failed', 400);
  return undefined;
}

/**
 * Sends the contact form to /api/contact, which passes it to Buildbase,
 * with the answer to the spam check when the form has one.
 */
export function useSendContactMessage() {
  return useMutation({
    mutationKey: ['contact', 'send'],
    mutationFn: async (message: ContactMessage) => {
      const captcha = await spamCheck();
      return postJson<{ ok: true }>('/api/contact', { ...message, captcha });
    },
    onSuccess: () => goal('contact_sent'),
  });
}
