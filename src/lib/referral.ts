import { captureReferral, getReferral } from '@buildbase/sdk/tracking';
import {
  buildbaseEnvironmentId,
  isReferralCode,
  REFERRAL_EVENT,
  withReferral as addReferral,
} from '@levuche/kit';
import { buildbase } from '@/lib/buildbase-config';

/**
 * Affiliate links. A link like levuche.com/?ref=MAYA is turned into a signed
 * referral by Buildbase and kept in this browser, so a sale is credited to
 * the affiliate who sent the visitor.
 *
 * Buildbase keeps that referral for this site alone (local storage), so the
 * Levuche app cannot read it. Links from here into the app carry the code
 * along as ?ref=, and the app keeps its own copy. The parameter, the code
 * check and the environment id come from @levuche/kit, which the app uses
 * too. See docs/BUILDBASE.md.
 */

/** The id Buildbase keeps this environment's referrals under, or null. */
const referralOrgId = () => buildbaseEnvironmentId(buildbase);

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

export { REFERRAL_EVENT };

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
  return addReferral(href, code);
}
