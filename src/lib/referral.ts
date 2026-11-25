import { captureReferral, getReferral } from '@buildbase/sdk/tracking';
import { buildbase } from '@/lib/buildbase-config';
import { isReferralCode, REFERRAL_PARAM } from '@/lib/referral-code';

/**
 * Affiliate links. A link like levuche.com/?ref=MAYA is turned into a signed
 * referral by Buildbase and kept in this browser, so a sale is credited to
 * the affiliate who sent the visitor.
 *
 * Buildbase keeps that referral for this site alone (local storage), so the
 * Levuche app cannot read it. Links from here into the app carry the code
 * along as ?ref=, and the app keeps its own copy. See docs/BUILDBASE.md.
 */

/**
 * The id Buildbase knows this environment by (its `environmentId`): the org
 * id for production, `<orgId>-<key>` for another environment. Null before
 * the org is set.
 */
function referralOrgId(): string | null {
  const { orgId, environment } = buildbase;
  if (!/^[0-9a-f]{24}$/i.test(orgId)) return null;
  return environment && environment !== 'production'
    ? `${orgId}-${environment}`
    : orgId;
}

/**
 * Keeps the referral from this page's ?ref=, if there is one. Never throws:
 * an unknown code, blocked storage or a network failure keep nothing.
 */
export function keepReferral() {
  const orgId = referralOrgId();
  if (!orgId || typeof window === 'undefined') return;
  void captureReferral({ serverUrl: buildbase.serverUrl, orgId }).then(
    (kept) => {
      if (kept) window.dispatchEvent(new Event(REFERRAL_EVENT));
    }
  );
}

/** Sent on window once a referral is kept, so links pick the code up. */
export const REFERRAL_EVENT = 'levuche:referral';

/** The affiliate code kept in this browser, or null. */
export function referralCode(): string | null {
  const orgId = referralOrgId();
  if (!orgId || typeof window === 'undefined') return null;
  const code = getReferral(orgId)?.code;
  return isReferralCode(code) ? code : null;
}

/**
 * `href` with the kept affiliate code as ?ref=, so the Levuche app credits
 * the same affiliate. Unchanged when there is none.
 */
export function withReferral(href: string, code = referralCode()): string {
  if (!code) return href;
  const url = new URL(href, 'https://levuche.invalid');
  url.searchParams.set(REFERRAL_PARAM, code);
  return url.origin === 'https://levuche.invalid'
    ? `${url.pathname}${url.search}${url.hash}`
    : url.toString();
}
