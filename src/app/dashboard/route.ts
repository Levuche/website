import { NextRequest, NextResponse } from 'next/server';
import { isReferralCode, REFERRAL_PARAM } from '@/lib/referral-code';
import { appUrl } from '@/lib/site';

/**
 * /dashboard sends people on to the Levuche app. Sign-in and "Get started"
 * come back here from Buildbase's hosted page, so a new sign-in or sign-up
 * lands in the dashboard, not on the marketing site. An affiliate code
 * (?ref=) goes along, so the app credits the same affiliate.
 */
export function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get(REFERRAL_PARAM);
  if (!isReferralCode(ref)) return NextResponse.redirect(appUrl, 307);
  const target = new URL(appUrl);
  target.searchParams.set(REFERRAL_PARAM, ref);
  return NextResponse.redirect(target, 307);
}
