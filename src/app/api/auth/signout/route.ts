// Clears the session cookie. The SDK calls it on sign-out.
import { refuseCrossSiteAuthPost } from '@buildbase/sdk';
import { NextRequest, NextResponse } from 'next/server';

import { SESSION_COOKIE_NAME } from '@/lib/buildbase';

export async function POST(request: NextRequest) {
  // Only this app's own JSON call: another site must not sign the visitor out.
  const refused = refuseCrossSiteAuthPost(request);
  if (refused) return refused;
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    // As the token route set it: from the request's own protocol.
    secure: request.nextUrl.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
