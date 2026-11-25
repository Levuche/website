import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LevucheLogo } from '@/components/logo';
import { AuthButtons } from '@/components/auth-buttons';
import { cn } from '@/lib/utils';

type Current = 'pricing' | null;

/** The levuche.com header from the Main and MarketingPages boards. */
export function SiteHeader({ current = null }: { current?: Current }) {
  const link = 'text-lv-text-2 no-underline hover:text-lv-text';
  return (
    <header className="max-w-page px-gutter mx-auto flex w-full flex-wrap items-center justify-between gap-4 py-3.5">
      <LevucheLogo />
      <nav
        aria-label="Main"
        className="flex flex-wrap items-center gap-x-[clamp(12px,2vw,24px)] gap-y-2 text-sm"
      >
        {/* Phones get Pricing, Sign in and the beta button on one row; the
            home page's own sections are a scroll away. */}
        <Link href="/#how" className={cn(link, 'max-sm:hidden')}>
          How it works
        </Link>
        <Link href="/#features" className={cn(link, 'max-sm:hidden')}>
          Features
        </Link>
        <Link
          href="/pricing"
          aria-current={current === 'pricing' ? 'page' : undefined}
          className={cn(
            link,
            current === 'pricing' &&
              'text-lv-text font-semibold underline decoration-2 underline-offset-[6px]'
          )}
        >
          Pricing
        </Link>
        <AuthButtons />
        <Button asChild>
          <Link href="/#beta">Join the beta</Link>
        </Button>
      </nav>
    </header>
  );
}
