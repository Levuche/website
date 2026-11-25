'use client';

import { useId, useState } from 'react';

/**
 * The hero's "Join the beta" email form. It posts to
 * NEXT_PUBLIC_BETA_FORM_ACTION once that is set; until then it stays on the
 * page and says sign-ups aren't open yet, so no address goes anywhere.
 */
export function BetaForm({ action }: { action: string | null }) {
  const id = useId();
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <form
        action={action ?? undefined}
        method="post"
        onSubmit={(event) => {
          if (!action) {
            event.preventDefault();
            setNotice(
              "Beta sign-ups aren't open on this page yet. Please check back soon."
            );
          }
        }}
        className="flex max-w-[520px] flex-wrap gap-3"
      >
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          className="border-lv-border bg-lv-card text-lv-text min-h-14 flex-[1_1_240px] rounded-full border-2 px-5 text-base"
        />
        <button
          type="submit"
          className="bg-lv-accent text-lv-on-accent min-h-14 flex-auto cursor-pointer rounded-full border-0 px-7 text-base font-bold"
        >
          Join the beta
        </button>
      </form>
      <p role="status" className="text-lv-text-2 m-0 text-sm empty:hidden">
        {notice}
      </p>
    </div>
  );
}
