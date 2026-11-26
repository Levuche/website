// Clears the session cookie, on this site and the Levuche app. The SDK calls
// it on sign-out.
import { refuseCrossSiteAuthPost } from '@buildbase/sdk';
import { NextRequest, NextResponse } from 'next/server';

import { rateLimited } from '@/lib/rate-limit';
import { clearSessionCookie } from '@/lib/session-cookie';

export async function POST(request: NextRequest) {
  // Only this app's own JSON call: another site must not sign the visitor out.
  const refused = refuseCrossSiteAuthPost(request);
  if (refused) return refused;
  const limited = await rateLimited(request, 'AUTH_LIMITER', 'signout');
  if (limited) return limited;
  const response = NextResponse.json({ success: true });
  clearSessionCookie(response, request);
  return response;
}
