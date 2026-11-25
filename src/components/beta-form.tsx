'use client';

import { BetaForm as BuildbaseBetaForm } from '@buildbase/sdk/react';
import { useState } from 'react';
import { isAuthConfigured } from '@/lib/buildbase-config';

/**
 * The hero's "Join the beta" form: Buildbase's own beta sign-up form, so
 * every request lands in the Buildbase console. Until Buildbase is set up in
 * the environment it says sign-ups aren't open yet, and nothing is sent.
 */
export function BetaForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthConfigured) {
    return (
      <p className="text-lv-text-2 m-0 text-base">
        Beta sign-ups open here soon. Please check back.
      </p>
    );
  }

  if (done) {
    return (
      <p role="status" className="text-lv-text m-0 text-base font-semibold">
        Thanks, you’re on the list. We’ll email you when your invite is ready.
      </p>
    );
  }

  return (
    <div className="lv-beta-form flex max-w-[520px] flex-col gap-3">
      <BuildbaseBetaForm
        hideLogo
        hideTitles
        onSuccess={() => setDone(true)}
        onError={(message) => setError(message)}
      />
      {error && (
        <p role="alert" className="text-lv-danger m-0 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
