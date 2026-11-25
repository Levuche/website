'use client';

import { ApiVersion } from '@buildbase/sdk';
import { CookieBanner, SaaSOSProvider } from '@buildbase/sdk/react';
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
      {/* With analytics on, visitors are asked first: the banner shows once,
          remembers the answer in the bb_consent cookie, and "Cookie settings"
          in the footer opens it again. The site has no marketing tags, so it
          asks about analytics only. */}
      {buildbase.analytics && (
        <CookieBanner privacyHref="/privacy" categories={['analytics']} />
      )}
    </SaaSOSProvider>
  );
}
