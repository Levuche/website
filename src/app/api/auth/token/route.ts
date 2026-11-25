// Trades the one-time code from the hosted sign-in page for a session, and
// stores it in an httpOnly cookie. The only file that reads the client secret.
import { AuthCodeExchangeError, refuseCrossSiteAuthPost } from '@buildbase/sdk';
import { NextRequest, NextResponse } from 'next/server';

import { exchangeCode, SESSION_COOKIE_NAME } from '@/lib/buildbase';
import { buildbase, isAuthConfigured } from '@/lib/buildbase-config';

export async function POST(request: NextRequest) {
  // Only this app's own JSON call: a form another site submits must not sign
  // the visitor in to someone else's account (login CSRF).
  const refused = refuseCrossSiteAuthPost(request);
  if (refused) return refused;
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
    response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      // From the request, not NODE_ENV: `next start` on a plain-http host is
      // production, and a browser drops a Secure cookie sent over http.
      secure: request.nextUrl.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
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
