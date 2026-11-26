'use client';

import { openCookieBanner } from '@buildbase/sdk/react';
import { useConsentCategories } from '@/hooks/use-consent-categories';
import { isAuthConfigured } from '@/lib/buildbase-config';

/**
 * "Cookie settings" in the footer: shows the cookie banner again with the
 * visitor's current answer, so they can change or withdraw it. Only there
 * while something needs consent (web analytics, or a tag attached in the
 * Buildbase console), since there is nothing to choose otherwise.
 */
export function CookieSettings() {
  if (!isAuthConfigured) return null;
  return <CookieSettingsButton />;
}

function CookieSettingsButton() {
  const categories = useConsentCategories();
  if (categories.length === 0) return null;
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
