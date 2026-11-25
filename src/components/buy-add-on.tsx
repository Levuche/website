'use client';

import {
  createAddOnPurchaseRedirectUrls,
  useSaaSAuth,
  useSaaSWorkspaces,
  usePurchaseAddOn,
} from '@buildbase/sdk/react';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { isAuthConfigured } from '@/lib/buildbase-config';

const BUY_PARAM = 'buy';

/**
 * Buys a Buildbase add-on: for a workspace when the add-on is sold to
 * workspaces (each Levuche page is a workspace and pays for itself), or for
 * the signed-in person (`{ user: true }`) when it is sold to people. The
 * add-on's `payerType` is set in Billing, Add-ons.
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
  // Each Levuche page is a workspace and buys its own add-on. Someone who
  // runs several pages picks which one; the current one is the default.
  const { currentWorkspace, workspaces } = useSaaSWorkspaces();
  const [pickedId, setPickedId] = useState<string | null>(null);
  const workspaceId =
    (pickedId && workspaces.some((w) => w._id === pickedId)
      ? pickedId
      : null) ??
    currentWorkspace?._id ??
    workspaces[0]?._id ??
    null;
  const showPicker =
    isAuthenticated && payerType === 'workspace' && workspaces.length > 1;
  const subject = payerType === 'user' ? { user: true as const } : workspaceId;
  const { purchaseAddOn, loading } = usePurchaseAddOn(subject);
  const noWorkspace =
    isAuthenticated && payerType === 'workspace' && !workspaceId;
  const resumed = useRef(false);
  const pickerId = useId();

  // Opening Stripe Checkout through Buildbase. Never retried by itself.
  const checkoutMutation = useMutation({
    mutationKey: ['add-on', 'checkout', slug],
    mutationFn: async () => {
      if (!subject) throw new Error('No page to buy for');
      const urls = createAddOnPurchaseRedirectUrls(
        subject,
        `${window.location.origin}/pricing`
      );
      await purchaseAddOn({ offerSlug: slug, currency, ...urls });
    },
  });
  const checkout = () => checkoutMutation.mutateAsync().catch(() => {});
  const opening = loading || checkoutMutation.isPending;

  const buy = async () => {
    checkoutMutation.reset();
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
      {showPicker && workspaceId && (
        <Field>
          <FieldLabel htmlFor={pickerId}>For which page?</FieldLabel>
          <NativeSelect
            id={pickerId}
            value={workspaceId}
            onChange={(event) => setPickedId(event.target.value)}
          >
            {workspaces.map((w) => (
              <NativeSelectOption key={w._id} value={w._id}>
                {w.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
      )}
      <button
        type="button"
        onClick={() => void buy()}
        disabled={opening || isLoading || noWorkspace}
        aria-busy={opening || undefined}
        className={`${className} disabled:cursor-wait`}
      >
        {opening ? 'Opening checkout…' : label}
      </button>
      {noWorkspace && (
        <p className="text-lv-text-2 m-0 text-sm">
          Create your page first, then come back to buy it.
        </p>
      )}
      {checkoutMutation.isError && (
        <Alert variant="destructive">
          Checkout didn’t open. Please try again in a moment.
        </Alert>
      )}
    </>
  );
}
