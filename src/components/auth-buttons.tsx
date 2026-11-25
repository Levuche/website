'use client';

import { useSaaSAuth } from '@buildbase/sdk/react';
import { isAuthConfigured } from '@/lib/buildbase-config';

const link =
  'text-lv-link min-h-11 cursor-pointer border-0 bg-transparent p-0 text-[15px] font-semibold';

/**
 * "Sign in" in the header, through Buildbase's hosted sign-in page. Signed
 * in, it becomes "Account" (Buildbase's own profile screens) and "Sign out".
 * Left out entirely until sign-in is set up in the environment.
 */
export function AuthButtons() {
  if (!isAuthConfigured) return null;
  return <AuthButtonsInner />;
}

function AuthButtonsInner() {
  const { isAuthenticated, isLoading, signIn, signOut, openWorkspaceSettings } =
    useSaaSAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        className={link}
        onClick={() =>
          // The SDK logs a refused sign-in only in development builds.
          signIn().catch((error: unknown) => {
            console.error('Sign-in refused:', error);
          })
        }
      >
        Sign in
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        className={link}
        onClick={() => openWorkspaceSettings('profile')}
      >
        Account
      </button>
      <button type="button" className={link} onClick={() => signOut()}>
        Sign out
      </button>
    </>
  );
}
