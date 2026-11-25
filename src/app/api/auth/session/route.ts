// The SDK asks this route on every page load whether someone is signed in.
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { SESSION_COOKIE_NAME } from '@/lib/buildbase';

export async function GET() {
  const c = await cookies();
  return NextResponse.json({
    sessionId: c.get(SESSION_COOKIE_NAME)?.value ?? null,
  });
}
