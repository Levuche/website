// The SDK asks this route on every page load whether someone is signed in.
// It only reads this site's cookie and never calls Buildbase, so it has no
// rate limit (a limit here would sign people out of the page mid-browse).
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { SESSION_COOKIE_NAME } from '@/lib/buildbase';

export async function GET() {
  const c = await cookies();
  return NextResponse.json({
    sessionId: c.get(SESSION_COOKIE_NAME)?.value ?? null,
  });
}
