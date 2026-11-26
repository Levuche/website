'use client';

import type { CookieBannerCategory } from '@buildbase/sdk/react';
import { useTracking } from '@buildbase/sdk/tracking';
import { buildbase } from '@/lib/buildbase-config';

/**
 * What the cookie banner has to ask about: analytics while Buildbase web
 * analytics is on or an analytics tag (GA4, Clarity and the like) is
 * attached to the site's sign-in client, and marketing while an ad pixel
 * (Google Ads, Meta, LinkedIn and the like) is. The tags come from the
 * Buildbase console (Settings > Tracking & tags), so this follows whatever
 * is attached there. An empty list means there is nothing to ask.
 *
 * Call it only under the Buildbase provider.
 */
export function useConsentCategories(): CookieBannerCategory[] {
  const { consent } = useTracking();
  const manifest = consent.manifest;
  const categories: CookieBannerCategory[] = [];
  if (
    buildbase.analytics ||
    manifest.some((entry) => entry.category === 'analytics')
  ) {
    categories.push('analytics');
  }
  if (manifest.some((entry) => entry.category === 'marketing')) {
    categories.push('marketing');
  }
  return categories;
}
