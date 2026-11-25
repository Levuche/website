'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { keepReferral, REFERRAL_EVENT, withReferral } from '@/lib/referral';

/** Keeps an affiliate's ?ref= from the page a visitor lands on. */
export function ReferralCapture() {
  useEffect(() => {
    keepReferral();
  }, []);
  return null;
}

function subscribe(onChange: () => void) {
  window.addEventListener(REFERRAL_EVENT, onChange);
  return () => window.removeEventListener(REFERRAL_EVENT, onChange);
}

/**
 * `href` with the kept affiliate code, for links into the Levuche app. The
 * server render uses `href` as it is, so the page hydrates cleanly; the code
 * is added in the browser, including when it is kept after the page loads.
 */
export function useReferralHref(href: string) {
  return useSyncExternalStore(
    subscribe,
    () => withReferral(href),
    () => href
  );
}
