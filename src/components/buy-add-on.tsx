'use client';

import {
  createAddOnPurchaseRedirectUrls,
  useSaaSAuth,
  usePurchaseAddOn,
} from '@buildbase/sdk/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { isAuthConfigured } from '@/lib/buildbase-config';

const BUY_PARAM = 'buy';

/**
 * Buys a Buildbase add-on for the signed-in person (`{ user: true }`):
 * Buildbase opens Stripe Checkout and the person comes back to /pricing.
 * Not signed in: Buildbase's sign-in first, then the purchase carries on
 * by itself (the `?buy=<slug>` on the way back). With no sign-in client
 * set up the button joins the beta instead.
 */
export function BuyAddOn(props: {
  slug: string;
  currency: string;
  label: string;
  className: string;
}) {
  if (!isAuthConfigured) {
    return (
      <Link href="/#beta" className={props.className}>
        Join the beta
      </Link>
    );
  }
  return <BuyWithBuildbase {...props} />;
}

function BuyWithBuildbase({
  slug,
  currency,
  label,
  className,
}: {
  slug: string;
  currency: string;
  label: string;
  className: string;
}) {
  const { isAuthenticated, isLoading, signIn } = useSaaSAuth();
  const { purchaseAddOn, loading } = usePurchaseAddOn({ user: true });
  const [failed, setFailed] = useState(false);
  const resumed = useRef(false);

  const checkout = async () => {
    try {
      const urls = createAddOnPurchaseRedirectUrls(
        { user: true },
        `${window.location.origin}/pricing`
      );
      await purchaseAddOn({ offerSlug: slug, currency, ...urls });
    } catch {
      setFailed(true);
    }
  };

  const buy = async () => {
    setFailed(false);
    if (!isAuthenticated) {
      await signIn(`/pricing?${BUY_PARAM}=${encodeURIComponent(slug)}`);
      return;
    }
    await checkout();
  };

  // Back from sign-in with ?buy=<slug>: carry on to checkout once.
  useEffect(() => {
    if (resumed.current || isLoading || !isAuthenticated) return;
    if (new URL(window.location.href).searchParams.get(BUY_PARAM) !== slug) {
      return;
    }
    const timer = window.setTimeout(() => {
      resumed.current = true;
      const url = new URL(window.location.href);
      url.searchParams.delete(BUY_PARAM);
      window.history.replaceState(null, '', url.toString());
      void checkout();
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, slug]);

  return (
    <>
      <button
        type="button"
        onClick={() => void buy()}
        disabled={loading || isLoading}
        aria-busy={loading}
        className={`${className} cursor-pointer border-0 disabled:cursor-wait disabled:opacity-70`}
      >
        {loading ? 'Opening checkout…' : label}
      </button>
      {failed && (
        <p role="alert" className="text-lv-text-2 m-0 text-sm">
          Checkout didn’t open. Please try again in a moment.
        </p>
      )}
    </>
  );
}
