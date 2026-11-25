import type { NextRequest, NextResponse } from 'next/server';

import { SESSION_COOKIE_NAME } from '@/lib/buildbase';

/**
 * The domain the website and the Levuche app share, so one sign-in counts on
 * both: sign in on levuche.com and app.levuche.com shows you signed in, and
 * the other way round. Signing out on either signs you out of both.
 *
 * Only Levuche's own sites live under it. Creators' storefronts are on
 * levuche.page and their own domains, so they never receive this cookie.
 */
export const SHARED_COOKIE_DOMAIN = 'levuche.com';

const THIRTY_DAYS = 60 * 60 * 24 * 30;

/**
 * levuche.com for a host on it (levuche.com, dev.levuche.com,
 * app.levuche.com), so the cookie reaches every Levuche site. Any other host
 * (localhost, a preview link) keeps a cookie of its own, as before.
 */
export function sharedCookieDomain(hostname: string): string | undefined {
  const host = hostname.toLowerCase().replace(/\.$/, '');
  return host === SHARED_COOKIE_DOMAIN ||
    host.endsWith(`.${SHARED_COOKIE_DOMAIN}`)
    ? SHARED_COOKIE_DOMAIN
    : undefined;
}

function cookieOptions(request: NextRequest, maxAge: number) {
  const domain = sharedCookieDomain(request.nextUrl.hostname);
  return {
    httpOnly: true,
    // From the request, not NODE_ENV: `next start` on a plain-http host is
    // production, and a browser drops a Secure cookie sent over http.
    secure: request.nextUrl.protocol === 'https:',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
    ...(domain ? { domain } : {}),
  };
}

/**
 * Removes the cookie this site set before the cookie was shared, which
 * belongs to this host alone. A browser keeps the two apart, so without this
 * a visitor signed in before the change would keep an old session here.
 */
function clearHostOnlyCookie(response: NextResponse, request: NextRequest) {
  if (!sharedCookieDomain(request.nextUrl.hostname)) return;
  const secure = request.nextUrl.protocol === 'https:' ? '; Secure' : '';
  response.headers.append(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`
  );
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
    cookieOptions(request, THIRTY_DAYS)
  );
  // After cookies.set, which rewrites the Set-Cookie headers it manages.
  clearHostOnlyCookie(response, request);
}

/** Signs the visitor out of every Levuche site. */
export function clearSessionCookie(
  response: NextResponse,
  request: NextRequest
) {
  response.cookies.set(SESSION_COOKIE_NAME, '', cookieOptions(request, 0));
  clearHostOnlyCookie(response, request);
}
