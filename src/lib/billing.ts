import { environmentId, type IAddOn } from '@buildbase/sdk';
import seed from '../../content/buildbase/billing.json';
import { buildbase } from '@/lib/buildbase-config';
import { renderMarkdown } from '@/lib/markdown';

/**
 * Prices on levuche.com come from Buildbase Billing, never from content:
 *
 * - Add-ons (Billing, Add-ons): what a person buys once, such as the $9
 *   lifetime "Levuche" add-on. Read from the public add-on list.
 * - Plans (Billing, Plans, grouped in Billing, Pricing groups): anything
 *   that renews. Read from the pricing group `BILLING.pricingGroup`; while
 *   that group has no published version the page shows no plans.
 *
 * Both are public routes (no token, cached five minutes by Buildbase), so
 * they work wherever NEXT_PUBLIC_BUILDBASE_ORG_ID is set, in the
 * environment NEXT_PUBLIC_BUILDBASE_ENVIRONMENT names. With no org set (a
 * local run, or a preview before setup) the sample in
 * content/buildbase/billing.json stands in, so the page matches the boards.
 * The catalog itself is changed only in the console (docs/BUILDBASE.md).
 */
export const BILLING = {
  currency: 'usd',
  pricingGroup: 'levuche',
} as const;

/** One card on the pricing page, from an add-on or a plan. */
export interface Offer {
  key: string;
  name: string;
  /** Sanitised HTML: the description, one line per point. */
  featuresHtml: string;
  badge: string;
  /** Formatted prices: "$9", "$12.50". Empty when not sold that way. */
  once: string;
  monthly: string;
  yearly: string;
  /** Monthly and yearly in minor units, for the "save N%" switch. */
  monthlyMinor: number | null;
  yearlyMinor: number | null;
  /** An add-on a person buys from the card; null for a plan. */
  addOnSlug: string | null;
  isFree: boolean;
}

/** A pricing group row: a billing product the plans include. */
export interface CompareRow {
  name: string;
  values: string[];
}

type PublicPlanVersion = {
  _id: string;
  name: string;
  isFreemium?: boolean;
  plan?: { _id: string; slug: string };
  pricingVariants?: Array<{
    currency: string;
    basePricing?: Partial<Record<string, number>>;
  }>;
  features?: Record<string, boolean>;
  limits?: Record<string, number>;
  quotas?: Record<string, { monthly?: { included?: number } } | undefined>;
};

type PublicPlanItem = {
  _id: string;
  name: string;
  slug: string;
  type: string;
  sortOrder?: number;
  category?: { sortOrder?: number };
};

/** "$9" for whole amounts, "$12.50" otherwise. */
export function formatPrice(minor: number, currency: string): string {
  const code = currency.toUpperCase();
  const decimals =
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
    }).resolvedOptions().maximumFractionDigits ?? 2;
  const major = minor / 10 ** decimals;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: Number.isInteger(major) ? 0 : decimals,
  }).format(major);
}

function linesHtml(text: string | undefined): string {
  const lines = (text ?? '')
    .split('\n')
    .map((line) => line.replace(/^\s*[-*]\s+/, '').trim())
    .filter(Boolean);
  return lines.length
    ? renderMarkdown(lines.map((line) => `- ${line}`).join('\n')).html
    : '';
}

const isConfigured = /^[0-9a-f]{24}$/i.test(buildbase.orgId);

async function getPublic<T>(path: string): Promise<T | null> {
  const org = environmentId(buildbase.orgId, buildbase.environment);
  const url = `${buildbase.serverUrl.replace(/\/$/, '')}/api/v1/public/${org}/${path}`;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: 300 },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (error) {
    console.warn(
      `Buildbase billing: ${path} unavailable:`,
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

export async function getAddOns(): Promise<IAddOn[]> {
  if (!isConfigured) return seed.addOns as unknown as IAddOn[];
  const body = await getPublic<{ addOns?: IAddOn[] }>(
    `add-ons?currency=${BILLING.currency}`
  );
  return body?.addOns ?? [];
}

export async function getPlanGroup(): Promise<{
  plans: PublicPlanVersion[];
  items: PublicPlanItem[];
}> {
  if (!isConfigured) return { plans: [], items: [] };
  const body = await getPublic<{
    plans?: PublicPlanVersion[];
    items?: PublicPlanItem[];
  }>(`plans/${encodeURIComponent(BILLING.pricingGroup)}`);
  return { plans: body?.plans ?? [], items: body?.items ?? [] };
}

export function addOnOffer(addOn: IAddOn): Offer | null {
  const variant = addOn.pricingVariants.find(
    (v) => v.currency.toLowerCase() === BILLING.currency
  );
  const prices = variant?.prices ?? {};
  const oneTime = prices.oneTime;
  const monthly = prices.monthly;
  const yearly = prices.yearly;
  if (oneTime == null && monthly == null && yearly == null) return null;
  return {
    key: `add-on-${addOn.slug}`,
    name: addOn.name,
    featuresHtml: linesHtml(addOn.description),
    badge: addOn.badge ?? '',
    once: oneTime != null ? formatPrice(oneTime, BILLING.currency) : '',
    monthly: monthly != null ? formatPrice(monthly, BILLING.currency) : '',
    yearly: yearly != null ? formatPrice(yearly, BILLING.currency) : '',
    monthlyMinor: monthly ?? null,
    yearlyMinor: yearly ?? null,
    addOnSlug: addOn.slug,
    isFree: false,
  };
}

export function planOffer(plan: PublicPlanVersion): Offer | null {
  const variant = plan.pricingVariants?.find(
    (v) => v.currency.toLowerCase() === BILLING.currency
  );
  if (!variant && !plan.isFreemium) return null;
  const monthly = variant?.basePricing?.monthly;
  const yearly = variant?.basePricing?.yearly;
  const free = plan.isFreemium === true || (monthly === 0 && !yearly);
  return {
    key: `plan-${plan._id}`,
    name: plan.name,
    featuresHtml: '',
    badge: '',
    once: '',
    monthly: free
      ? 'Free'
      : monthly != null
        ? formatPrice(monthly, BILLING.currency)
        : '',
    yearly: free
      ? 'Free'
      : yearly != null
        ? formatPrice(yearly, BILLING.currency)
        : '',
    monthlyMinor: monthly ?? null,
    yearlyMinor: yearly ?? null,
    addOnSlug: null,
    isFree: free,
  };
}

/** What each plan gives for each billing product, as the console orders them. */
export function compareRows(
  plans: PublicPlanVersion[],
  items: PublicPlanItem[]
): CompareRow[] {
  const ordered = [...items].sort(
    (a, b) =>
      (a.category?.sortOrder ?? 0) - (b.category?.sortOrder ?? 0) ||
      (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );
  const cell = (plan: PublicPlanVersion, item: PublicPlanItem): string => {
    if (item.type === 'feature') {
      return plan.features?.[item.slug] === true ? 'Yes' : '—';
    }
    if (item.type === 'limit') {
      const value = plan.limits?.[item.slug];
      if (value == null || value === 0) return '—';
      return value === -1 ? 'Unlimited' : String(value);
    }
    if (item.type === 'quota') {
      const included = plan.quotas?.[item.slug]?.monthly?.included;
      if (included == null || included === 0) return '—';
      return included === -1 ? 'Unlimited' : `${included} a month`;
    }
    return '—';
  };
  return ordered
    .map((item) => ({
      name: item.name,
      values: plans.map((p) => cell(p, item)),
    }))
    .filter((row) => row.values.some((v) => v !== '—'));
}
