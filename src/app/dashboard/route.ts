import { NextResponse } from 'next/server';
import { appUrl } from '@/lib/site';

/**
 * /dashboard sends people on to the Levuche app. Sign-in and "Get started"
 * come back here from Buildbase's hosted page, so a new sign-in or sign-up
 * lands in the dashboard, not on the marketing site.
 */
export function GET() {
  return NextResponse.redirect(appUrl, 307);
}
