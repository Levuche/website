/** A Buildbase Forms built-in check, as /api/contact/challenge hands it on. */
export type PowChallenge = {
  algorithm: string;
  challenge: string;
  maxnumber: number;
  salt: string;
  signature: string;
};

/**
 * Solves a built-in check: finds the number that, after the salt, hashes to
 * the challenge, and returns the answer Buildbase expects as `_captcha`
 * (docs: Forms > Custom forms > Captcha in your own UI). Usually under a
 * second.
 */
export async function solveChallenge(c: PowChallenge): Promise<string> {
  const encoder = new TextEncoder();
  for (let n = 0; n <= c.maxnumber; n++) {
    const digest = await crypto.subtle.digest(
      'SHA-256',
      encoder.encode(`${c.salt}${n}`)
    );
    const hex = Array.from(new Uint8Array(digest), (b) =>
      b.toString(16).padStart(2, '0')
    ).join('');
    if (hex === c.challenge) {
      return btoa(
        JSON.stringify({
          algorithm: c.algorithm,
          challenge: c.challenge,
          number: n,
          salt: c.salt,
          signature: c.signature,
        })
      );
    }
  }
  throw new Error('No solution');
}
