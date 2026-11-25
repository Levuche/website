'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { BuyAddOn } from '@/components/buy-add-on';
import { Badge } from '@/components/ui/badge';
import { buttonClasses } from '@/components/ui/button';
import type { Offer } from '@/lib/billing';
import { cn } from '@/lib/utils';

type Period = 'monthly' | 'yearly';

/**
 * The pricing cards, one per Buildbase Billing offer (src/lib/billing.ts):
 * an add-on shows "$9 once" with a Buy button, a plan shows its monthly or
 * yearly price. The first card is drawn as the main one.
 */
export function PricingPlans({
  intro,
  offers,
  currency,
}: {
  intro: React.ReactNode;
  offers: Offer[];
  currency: string;
}) {
  const hasYearly = offers.some((o) => o.yearly && !o.once);
  const hasMonthly = offers.some((o) => o.monthly && !o.once);
  // "Yearly, save N%": the best saving over twelve monthly payments.
  const saving = Math.max(
    0,
    ...offers.map((o) =>
      o.monthlyMinor && o.yearlyMinor
        ? Math.round((1 - o.yearlyMinor / (o.monthlyMinor * 12)) * 100)
        : 0
    )
  );
  const [period, setPeriod] = useState<Period>(
    hasMonthly || !hasYearly ? 'monthly' : 'yearly'
  );
  const monthlyRef = useRef<HTMLButtonElement>(null);
  const yearlyRef = useRef<HTMLButtonElement>(null);

  const choose = (next: Period) => {
    setPeriod(next);
    (next === 'monthly' ? monthlyRef : yearlyRef).current?.focus();
  };
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
    ) {
      event.preventDefault();
      choose(period === 'monthly' ? 'yearly' : 'monthly');
    }
  };
  const radio = (checked: boolean) =>
    cn(
      'min-h-11 cursor-pointer rounded-full border-0 px-[18px] text-sm',
      checked
        ? 'bg-lv-card text-lv-text font-semibold'
        : 'text-lv-text-2 bg-transparent'
    );

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        {intro}
        {hasMonthly && hasYearly && (
          <div
            role="radiogroup"
            aria-label="Billing period"
            onKeyDown={onKeyDown}
            className="bg-lv-surface-2 flex gap-1 rounded-full p-1"
          >
            <button
              ref={monthlyRef}
              type="button"
              role="radio"
              aria-checked={period === 'monthly'}
              tabIndex={period === 'monthly' ? 0 : -1}
              onClick={() => choose('monthly')}
              className={radio(period === 'monthly')}
            >
              Monthly
            </button>
            <button
              ref={yearlyRef}
              type="button"
              role="radio"
              aria-checked={period === 'yearly'}
              tabIndex={period === 'yearly' ? 0 : -1}
              onClick={() => choose('yearly')}
              className={radio(period === 'yearly')}
            >
              {saving > 0 ? `Yearly, save ${saving}%` : 'Yearly'}
            </button>
          </div>
        )}
      </div>

      {offers.length > 0 && (
        <div
          className={cn(
            'grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5',
            offers.length === 1 && 'max-w-[440px]'
          )}
        >
          {offers.map((offer, index) => {
            const main = index === 0 && offers.length > 1;
            const price =
              offer.once ||
              (period === 'monthly' ? offer.monthly : offer.yearly) ||
              offer.monthly ||
              offer.yearly;
            const per = offer.once
              ? offer.addOnSlug && offer.payerType === 'workspace'
                ? 'once per page'
                : 'once'
              : offer.isFree
                ? ''
                : price === offer.yearly && period === 'yearly'
                  ? 'a year'
                  : 'a month';
            const lead = main || offers.length === 1;
            const button = buttonClasses({
              variant: lead ? 'primary' : 'secondary',
              size: lead ? 'lg' : 'md',
              className: 'mt-auto w-full',
            });
            return (
              <article
                key={offer.key}
                className={cn(
                  'flex flex-col gap-3.5 rounded-3xl',
                  main
                    ? 'border-lv-primary bg-lv-surface border-2 p-[23px]'
                    : 'border-lv-border border p-6'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="m-0 text-xl font-bold">{offer.name}</h2>
                  {offer.badge && (
                    <Badge className="bg-lv-accent text-lv-on-accent font-bold">
                      {offer.badge}
                    </Badge>
                  )}
                </div>
                {price && (
                  <p className="m-0 flex items-baseline gap-1.5">
                    <span className="text-[40px] font-bold tracking-[-1px] tabular-nums">
                      {price}
                    </span>
                    {per && (
                      <span className="text-lv-text-2 text-sm">{per}</span>
                    )}
                  </p>
                )}
                {offer.featuresHtml && (
                  <div
                    className="lv-plan-features"
                    dangerouslySetInnerHTML={{ __html: offer.featuresHtml }}
                  />
                )}
                {offer.addOnSlug ? (
                  <BuyAddOn
                    slug={offer.addOnSlug}
                    payerType={offer.payerType}
                    currency={currency}
                    label={`Get ${offer.name}`}
                    className={button}
                  />
                ) : (
                  <Link href="/#beta" className={button}>
                    Join the beta
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
