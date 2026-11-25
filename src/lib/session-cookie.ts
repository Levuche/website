import type { NextRequest, NextResponse } from 'next/server';
import {
  expireHostOnlySessionCookie,
  sessionCookieOptions,
} from '@levuche/kit/server';

import { SESSION_COOKIE_NAME } from '@/lib/buildbase';

/**
 * The session cookie, shared with the Levuche app on levuche.com: sign in on
 * levuche.com or app.levuche.com and you're signed in on both, and signing
 * out on either signs you out of both. The name, domain and options come
 * from @levuche/kit, which the app uses too, so the two can't drift apart.
 * Any other host (localhost, a preview link) keeps a cookie of its own.
 */

/** Removes the per-host cookie from before the cookie was shared. */
function clearHostOnlyCookie(response: NextResponse, request: NextRequest) {
  const old = expireHostOnlySessionCookie(SESSION_COOKIE_NAME, request.nextUrl);
  // After cookies.set, which rewrites the Set-Cookie headers it manages.
  if (old) response.headers.append('Set-Cookie', old);
}

/** Stores the signed-in visitor's session for every Levuche site. */
export function setSessionCookie(
  response: NextResponse,
  request: NextRequest,
  sessionId: string
) {
  response.cookies.set(
    SESSION_COOKIE_NAME,
    sessionId,
    sessionCookieOptions(request.nextUrl)
  );
  clearHostOnlyCookie(response, request);
}

/** Signs the visitor out of every Levuche site. */
export function clearSessionCookie(
  response: NextResponse,
  request: NextRequest
) {
  response.cookies.set(
    SESSION_COOKIE_NAME,
    '',
    sessionCookieOptions(request.nextUrl, 0)
  );
  clearHostOnlyCookie(response, request);
}
