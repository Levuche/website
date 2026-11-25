import Link from 'next/link';
import { LevucheLogo } from '@/components/logo';
import { AuthButtons } from '@/components/auth-buttons';
import { cn } from '@/lib/utils';

type Current = 'pricing' | null;

/** The levuche.com header from the Main and MarketingPages boards. */
export function SiteHeader({ current = null }: { current?: Current }) {
  const link = 'text-lv-text-2 no-underline hover:text-lv-text';
  return (
    <header className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-[clamp(16px,3vw,32px)] py-5">
      <LevucheLogo />
      <nav
        aria-label="Main"
        className="flex flex-wrap items-center gap-x-[clamp(12px,2vw,28px)] gap-y-2 text-[15px]"
      >
        <Link href="/#how" className={link}>
          How it works
        </Link>
        <Link href="/#features" className={link}>
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
        <Link
          href="/#beta"
          className="bg-lv-primary text-lv-on-primary inline-flex min-h-11 items-center rounded-full px-5 py-3 font-semibold no-underline"
        >
          Join the beta
        </Link>
      </nav>
    </header>
  );
}
