'use client';

import { useEffect } from 'react';
import './globals.css';

/**
 * Shown when the root layout itself fails, so it brings its own <html> and
 * stays plain: no header, providers or fonts that might be what broke.
 */
export default function GlobalError({
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
    <html lang="en">
      <body className="bg-lv-bg text-lv-text font-sans antialiased">
        <main className="max-w-article px-gutter mx-auto flex min-h-screen flex-col justify-center gap-4 py-16">
          <h1 className="text-h1 m-0">Something went wrong</h1>
          <p className="text-lv-text-2 m-0 text-base">
            Levuche didn’t load. Please try again in a moment.
          </p>
          {error.digest && (
            <p className="text-lv-text-2 m-0 text-sm">
              Reference: <code>{error.digest}</code>
            </p>
          )}
          <p className="m-0 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={reset}
              className="bg-lv-accent text-lv-on-accent rounded-lg px-5 py-2.5 font-semibold"
            >
              Try again
            </button>
            {/* A plain link: a full page load, not client navigation. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="text-lv-link font-semibold">
              Go to the home page
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
