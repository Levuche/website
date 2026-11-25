import { environmentId, refuseCrossSiteAuthPost } from '@buildbase/sdk';
import { NextResponse } from 'next/server';
import { buildbase } from '@/lib/buildbase-config';
import { rateLimited } from '@/lib/rate-limit';

/**
 * The contact form, sent to a form built in the Buildbase console (Content,
 * Forms) through the form's public submit endpoint, so every message lands
 * in Buildbase. The form's public id is BUILDBASE_CONTACT_FORM_ID; its
 * fields must be named `name`, `email` and `message` (docs/BUILDBASE.md).
 *
 * The browser never talks to Buildbase directly: this route checks the
 * request comes from this site, drops bot submissions (the hidden
 * `company` field) and caps each field's length before forwarding. When the
 * form has Buildbase's built-in spam check on, the browser solves it first
 * (/api/contact/challenge) and the answer goes on as `_captcha`. Each
 * address can send a few messages a minute (src/lib/rate-limit.ts).
 */
const FORM_ID = process.env.BUILDBASE_CONTACT_FORM_ID?.trim() ?? '';

const LIMITS = { name: 200, email: 320, message: 5000 } as const;

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  const refused = refuseCrossSiteAuthPost(request);
  if (refused) return refused;
  const limited = await rateLimited(request, 'CONTACT_LIMITER', 'contact');
  if (limited) return limited;

  if (!FORM_ID || !/^[0-9a-f]{24}$/i.test(buildbase.orgId)) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  // A person never fills the hidden field; a bot usually does. Answer as if
  // it worked so the bot learns nothing.
  if (text(body.company, 200)) return NextResponse.json({ ok: true });

  const data = {
    name: text(body.name, LIMITS.name),
    email: text(body.email, LIMITS.email),
    message: text(body.message, LIMITS.message),
  };
  if (
    !data.name ||
    !data.message ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)
  ) {
    return NextResponse.json({ error: 'invalid_fields' }, { status: 400 });
  }

  const captcha = text(body.captcha, 4000);
  const org = environmentId(buildbase.orgId, buildbase.environment);
  const url = `${buildbase.serverUrl.replace(/\/$/, '')}/api/forms/public/${org}/${encodeURIComponent(FORM_ID)}/submit`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(captcha ? { ...data, _captcha: captcha } : data),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
    const answer = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };
    if (res.ok && answer.success !== false) {
      return NextResponse.json({ ok: true });
    }
    if (res.status === 429) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }
    // The spam check failed or its provider didn't answer: worth a retry.
    if (res.status === 503 || /captcha/i.test(answer.message ?? '')) {
      return NextResponse.json({ error: 'captcha_failed' }, { status: 400 });
    }
    // A throwaway email domain the form blocks.
    if (/different email/i.test(answer.message ?? '')) {
      return NextResponse.json({ error: 'email_refused' }, { status: 400 });
    }
    return NextResponse.json({ error: 'rejected' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 502 });
  }
}
