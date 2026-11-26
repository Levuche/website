'use client';

import { useSaaSAuth } from '@buildbase/sdk/react';
import Link from 'next/link';
import { useReferralHref } from '@/components/referral-capture';
import { buttonVariants } from '@/components/ui/button';
import { isAuthConfigured } from '@/lib/buildbase-config';
import { goal } from '@/lib/goals';
import { appUrl } from '@/lib/site';
import { cn } from '@/lib/utils';

/** Where sign-in and sign-up come back to: it sends them to the dashboard. */
const DASHBOARD_PATH = '/dashboard';

const textLink =
  'text-lv-link min-h-control inline-flex cursor-pointer items-center border-0 bg-transparent p-0 text-sm font-semibold no-underline';

/**
 * The header's sign-in links. Signed out: "Sign in" and "Get started", both
 * through Buildbase's hosted page and on to the dashboard. Signed in: one
 * "Dashboard" button. Until sign-in is set up in the environment, only
 * "Get started" shows, as a plain link to the dashboard.
 */
export function AuthButtons() {
  if (!isAuthConfigured) return <GetStarted />;
  return <AuthButtonsInner />;
}

function AuthButtonsInner() {
  const { isAuthenticated, isLoading, signIn } = useSaaSAuth();
  // An affiliate's code goes along into the app, and through sign-in.
  const dashboardHref = useReferralHref(appUrl);
  const afterSignIn = useReferralHref(DASHBOARD_PATH);

  if (isAuthenticated) {
    return (
      <a href={dashboardHref} className={buttonVariants()}>
        Dashboard
      </a>
    );
  }

  return (
    <>
      {!isLoading && (
        <button
          type="button"
          className={textLink}
          onClick={() =>
            // The SDK logs a refused sign-in only in development builds.
            signIn(afterSignIn).catch((error: unknown) => {
              console.error('Sign-in refused:', error);
            })
          }
        >
          Sign in
        </button>
      )}
      <GetStarted />
    </>
  );
}

type GetStartedProps = {
  className?: string;
  size?: 'default' | 'lg';
  variant?: 'default' | 'accent' | 'outline';
  label?: string;
};

/**
 * "Get started": opens Buildbase's hosted page, where a new creator signs up,
 * and lands them in the dashboard. Someone already signed in goes straight to
 * the dashboard. It is a link to /dashboard underneath, so it still works
 * before the page's script has loaded or with sign-in not set up.
 */
export function GetStarted({
  className,
  size = 'default',
  variant = 'default',
  label = 'Get started',
}: GetStartedProps) {
  const classes = cn(buttonVariants({ size, variant }), className);
  const href = useReferralHref(DASHBOARD_PATH);
  if (!isAuthConfigured) {
    return (
      <Link
        href={href}
        prefetch={false}
        className={classes}
        onClick={() => goal('get_started', { page: window.location.pathname })}
      >
        {label}
      </Link>
    );
  }
  return (
    <GetStartedWithBuildbase classes={classes} label={label} href={href} />
  );
}

function GetStartedWithBuildbase({
  classes,
  label,
  href,
}: {
  classes: string;
  label: string;
  /** /dashboard, with the affiliate's ?ref= when there is one. */
  href: string;
}) {
  const { isAuthenticated, isLoading, signIn } = useSaaSAuth();
  return (
    <a
      href={href}
      className={classes}
      onClick={(event) => {
        goal('get_started', { page: window.location.pathname });
        // Signed in, or not known yet: the link itself goes to the dashboard.
        if (isAuthenticated || isLoading) return;
        event.preventDefault();
        signIn(href).catch((error: unknown) => {
          console.error('Sign-in refused:', error);
        });
      }}
    >
      {label}
    </a>
  );
}
