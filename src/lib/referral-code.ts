/** The query parameter an affiliate link carries the code in. */
export const REFERRAL_PARAM = 'ref';

/** An affiliate code as Buildbase makes them: 3 to 32 letters, digits, - or _. */
const REFERRAL_CODE = /^[A-Za-z0-9_-]{3,32}$/;

export function isReferralCode(value: unknown): value is string {
  return typeof value === 'string' && REFERRAL_CODE.test(value);
}
