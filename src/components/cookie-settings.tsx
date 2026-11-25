'use client';

import { openCookieBanner } from '@buildbase/sdk/react';
import { buildbase, isAuthConfigured } from '@/lib/buildbase-config';

/**
 * "Cookie settings" in the footer: shows the cookie banner again with the
 * visitor's current answer, so they can change or withdraw it. Only there
 * while web analytics is on, since there is nothing to choose otherwise.
 */
export function CookieSettings() {
  if (!buildbase.analytics || !isAuthConfigured) return null;
  return (
    <button
      type="button"
      onClick={() => openCookieBanner()}
      className="text-lv-link cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-sm"
    >
      Cookie settings
    </button>
  );
}
