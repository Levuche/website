'use client';

import { ApiVersion } from '@buildbase/sdk';
import { CookieBanner, SaaSOSProvider } from '@buildbase/sdk/react';
import { useConsentCategories } from '@/hooks/use-consent-categories';
import { buildbase, isAuthConfigured } from '@/lib/buildbase-config';

/**
 * The Buildbase provider, as `npx @buildbase/sdk init` writes it: sign-in
 * through Buildbase's hosted page, with the session kept in an httpOnly
 * cookie by /api/auth/*. Until the org and its sign-in client are set in the
 * environment the site renders without Buildbase instead of throwing.
 */
export function SaaSProvider({ children }: { children: React.ReactNode }) {
  if (!isAuthConfigured) return <>{children}</>;

  return (
    <SaaSOSProvider
      serverUrl={buildbase.serverUrl}
      version={ApiVersion.V1}
      orgId={buildbase.orgId}
      environment={buildbase.environment}
      // Web analytics stays off unless NEXT_PUBLIC_BUILDBASE_ANALYTICS=on,
      // so nothing is collected before the privacy and cookie pages say so.
      analytics={buildbase.analytics}
      // Loads the tags attached to this site's sign-in client in the
      // Buildbase console (Settings > Tracking & tags): GA4, Google Ads, the
      // Meta, LinkedIn, X and TikTok pixels and the rest. Google tags start
      // with cookies off; every other tag waits for the visitor's yes in the
      // cookie banner. With nothing attached, nothing loads.
      tracking={{}}
      auth={{
        clientId: buildbase.clientId,
        redirectUrl: buildbase.redirectUrl,
        callbacks: {
          // Who is signed in? Answered by /api/auth/session from the cookie.
          getSession: async () => {
            const res = await fetch('/api/auth/session');
            return ((await res.json()) as { sessionId: string | null })
              .sessionId;
          },
          // Called with the ?code from the hosted sign-in page's redirect.
          handleAuthentication: async (code: string) => {
            const res = await fetch('/api/auth/token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code }),
            });
            const body = (await res.json().catch(() => ({}))) as {
              sessionId?: string;
              message?: string;
            };
            if (!res.ok || !body.sessionId) {
              throw new Error(
                `Sign-in failed (${res.status}): ${body.message ?? 'no session'}`
              );
            }
            return { sessionId: body.sessionId };
          },
          onSignOut: async () => {
            await fetch('/api/auth/signout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: '{}',
            });
          },
        },
      }}
    >
      {children}
      <ConsentBanner />
    </SaaSOSProvider>
  );
}

/**
 * Asks visitors first whenever something needs their consent: web analytics,
 * or a tag attached in the console. It shows once, remembers the answer in
 * the bb_consent cookie, and "Cookie settings" in the footer opens it again.
 * It asks only about the kinds of tag that are really on the page, so the
 * Marketing switch appears once an ad pixel is attached.
 */
function ConsentBanner() {
  const categories = useConsentCategories();
  if (categories.length === 0) return null;
  return <CookieBanner privacyHref="/privacy" categories={categories} />;
}
