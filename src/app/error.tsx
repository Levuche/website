'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { SiteShell } from '@/components/site-shell';
import { Button } from '@/components/ui/button';

/**
 * Shown when a page throws while rendering. The header and footer stay, so
 * people can carry on. The error itself goes to the console, which Workers
 * observability records (docs/DEPLOY.md, section 12).
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <SiteShell>
      <div className="max-w-article px-gutter mx-auto flex flex-col gap-4 py-16">
        <h1 className="text-h1 m-0">Something went wrong</h1>
        <p className="text-lv-text-2 m-0 text-base">
          This page didn’t load. Please try again in a moment.
        </p>
        {error.digest && (
          <p className="text-lv-text-2 m-0 text-sm">
            Reference: <code>{error.digest}</code>
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={reset}>Try again</Button>
          <Link href="/" className="text-lv-link font-semibold">
            Go to the home page
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
