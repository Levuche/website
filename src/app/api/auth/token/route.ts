// Trades the one-time code from the hosted sign-in page for a session, and
// stores it in an httpOnly cookie shared with the Levuche app. The only file that reads the client secret.
import { AuthCodeExchangeError, refuseCrossSiteAuthPost } from '@buildbase/sdk';
import { NextRequest, NextResponse } from 'next/server';

import { exchangeCode } from '@/lib/buildbase';
import { buildbase, isAuthConfigured } from '@/lib/buildbase-config';
import { rateLimited } from '@/lib/rate-limit';
import { setSessionCookie } from '@/lib/session-cookie';

export async function POST(request: NextRequest) {
  // Only this app's own JSON call: a form another site submits must not sign
  // the visitor in to someone else's account (login CSRF).
  const refused = refuseCrossSiteAuthPost(request);
  if (refused) return refused;
  const limited = await rateLimited(request, 'AUTH_LIMITER', 'token');
  if (limited) return limited;
  if (!isAuthConfigured || !process.env.BUILDBASE_CLIENT_SECRET) {
    return NextResponse.json(
      { error: 'Sign-in is not set up' },
      { status: 503 }
    );
  }
  const { code } = (await request.json().catch(() => ({}))) as {
    code?: string;
  };
  if (!code)
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  try {
    const { sessionId } = await exchangeCode({
      code,
      clientId: buildbase.clientId,
      clientSecret: process.env.BUILDBASE_CLIENT_SECRET ?? '',
    });
    const response = NextResponse.json({ sessionId });
    // Shared with the Levuche app, so the sign-in counts there too.
    setSessionCookie(response, request, sessionId);
    return response;
  } catch (error) {
    // The platform's status and reason ("Invalid client secret", "Invalid or
    // expired authorization code"), so a wrong BUILDBASE_CLIENT_SECRET is
    // diagnosable. Never the secret itself.
    const e = error instanceof AuthCodeExchangeError ? error : null;
    return NextResponse.json(
      {
        error: 'Sign-in failed',
        ...(e?.message ? { message: e.message } : {}),
        ...(e?.code ? { code: e.code } : {}),
      },
      { status: e && e.status >= 400 ? e.status : 502 }
    );
  }
}
