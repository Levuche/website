'use client';

import {
  createAddOnPurchaseRedirectUrls,
  useSaaSAuth,
  useSaaSWorkspaces,
  usePurchaseAddOn,
} from '@buildbase/sdk/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { isAuthConfigured } from '@/lib/buildbase-config';

const BUY_PARAM = 'buy';

/**
 * Buys a Buildbase add-on: for the signed-in person (`{ user: true }`) when
 * the add-on is sold to a person, or for their current workspace when it is
 * sold to a workspace (the add-on's `payerType`, set in Billing, Add-ons).
 * Buildbase opens Stripe Checkout and the buyer comes back to /pricing.
 * Not signed in: Buildbase's sign-in first, then the purchase carries on
 * by itself (the `?buy=<slug>` on the way back). With no sign-in client
 * set up the button joins the beta instead.
 */
type Props = {
  slug: string;
  payerType: 'user' | 'workspace';
  currency: string;
  label: string;
  className: string;
};

export function BuyAddOn(props: Props) {
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
  payerType,
  currency,
  label,
  className,
}: Props) {
  const { isAuthenticated, isLoading, signIn } = useSaaSAuth();
  const { currentWorkspace } = useSaaSWorkspaces();
  const workspaceId = currentWorkspace?._id ?? null;
  const subject = payerType === 'user' ? { user: true as const } : workspaceId;
  const { purchaseAddOn, loading } = usePurchaseAddOn(subject);
  const noWorkspace =
    isAuthenticated && payerType === 'workspace' && !workspaceId;
  const [failed, setFailed] = useState(false);
  const resumed = useRef(false);

  const checkout = async () => {
    try {
      if (!subject) throw new Error('No workspace to buy for');
      const urls = createAddOnPurchaseRedirectUrls(
        subject,
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
    if (payerType === 'workspace' && !workspaceId) return;
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
  }, [isLoading, isAuthenticated, slug, workspaceId]);

  return (
    <>
      <button
        type="button"
        onClick={() => void buy()}
        disabled={loading || isLoading || noWorkspace}
        aria-busy={loading}
        className={`${className} cursor-pointer border-0 disabled:cursor-wait disabled:opacity-70`}
      >
        {loading ? 'Opening checkout…' : label}
      </button>
      {noWorkspace && (
        <p className="text-lv-text-2 m-0 text-sm">
          Your account has no workspace yet, so there is nothing to add this to.
        </p>
      )}
      {failed && (
        <p role="alert" className="text-lv-text-2 m-0 text-sm">
          Checkout didn’t open. Please try again in a moment.
        </p>
      )}
    </>
  );
}
