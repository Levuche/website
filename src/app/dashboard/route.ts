import { forwardReferral } from '@levuche/kit';
import { NextRequest, NextResponse } from 'next/server';
import { appUrl } from '@/lib/site';

/**
 * /dashboard sends people on to the Levuche app. Sign-in and "Get started"
 * come back here from Buildbase's hosted page, so a new sign-in or sign-up
 * lands in the dashboard, not on the marketing site. An affiliate code
 * (?ref=) goes along, so the app credits the same affiliate.
 */
export function GET(request: NextRequest) {
  return NextResponse.redirect(forwardReferral(request.nextUrl, appUrl), 307);
}
