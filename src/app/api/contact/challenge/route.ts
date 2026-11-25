import { environmentId } from '@buildbase/sdk';
import { NextResponse } from 'next/server';
import { buildbase } from '@/lib/buildbase-config';
import { rateLimited } from '@/lib/rate-limit';

/**
 * The contact form's spam check. When the Contact form in Buildbase has
 * **Require a captcha** on with the **Built-in check** (Forms > Spam
 * protection), this hands the browser a fresh proof-of-work challenge to
 * solve before it sends; /api/contact passes the answer on as `_captcha`.
 * The form's id stays on the server.
 *
 * Answers `{ captcha: null }` when no check is needed, `{ captcha: 'pow',
 * challenge }` for the built-in check, and `{ captcha: 'unsupported' }` for
 * a provider widget (Turnstile, hCaptcha, reCAPTCHA), which this site
 * doesn't render.
 */
const FORM_ID = process.env.BUILDBASE_CONTACT_FORM_ID?.trim() ?? '';

export const dynamic = 'force-dynamic';

const noStore = { headers: { 'Cache-Control': 'no-store' } };

export async function GET(request: Request) {
  const limited = await rateLimited(request, 'CONTACT_LIMITER', 'challenge');
  if (limited) return limited;
  if (!FORM_ID || !/^[0-9a-f]{24}$/i.test(buildbase.orgId)) {
    return NextResponse.json({ captcha: null }, noStore);
  }
  const org = environmentId(buildbase.orgId, buildbase.environment);
  const base = `${buildbase.serverUrl.replace(/\/$/, '')}/api/forms/public/${org}/${encodeURIComponent(FORM_ID)}`;

  try {
    const form = (await fetch(base, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    }).then((r) => r.json())) as {
      captcha?: { widget?: string } | null;
      data?: { captcha?: { widget?: string } | null };
    };
    const widget = (form.captcha ?? form.data?.captcha)?.widget;
    if (!widget) return NextResponse.json({ captcha: null }, noStore);
    if (widget !== 'pow') {
      return NextResponse.json({ captcha: 'unsupported' }, noStore);
    }

    const res = await fetch(`${base}/challenge`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`challenge ${res.status}`);
    const challenge = await res.json();
    return NextResponse.json({ captcha: 'pow', challenge }, noStore);
  } catch {
    return NextResponse.json(
      { error: 'unavailable' },
      { status: 502, ...noStore }
    );
  }
}
