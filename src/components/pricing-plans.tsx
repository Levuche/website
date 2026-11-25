'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Period = 'monthly' | 'yearly';

/** A plan from the Buildbase collection `pricing-plans` (docs/BUILDBASE.md). */
export interface Plan {
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  feeNote: string;
  /** Sanitised HTML from the Markdown renderer (src/lib/markdown.ts). */
  featuresHtml: string;
  recommended: boolean;
  ctaLabel: string;
  ctaHref: string;
}

/** A bare number is shown in dollars; anything else (like "Free") as typed. */
const isNumber = (value: string) => /^\d/.test(value);
const money = (value: string) => (isNumber(value) ? `$${value}` : value);

export function PricingPlans({
  intro,
  plans,
}: {
  intro: React.ReactNode;
  plans: Plan[];
}) {
  const hasYearly = plans.some((plan) => plan.yearlyPrice);
  const hasMonthly = plans.some((plan) => plan.monthlyPrice);
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
              Yearly
            </button>
          </div>
        )}
      </div>

      {plans.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5">
          {plans.map((plan, index) => {
            const price =
              period === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            return (
              <article
                key={`${index}-${plan.name}`}
                className={cn(
                  'flex flex-col gap-3.5 rounded-3xl',
                  plan.recommended
                    ? 'border-lv-primary bg-lv-surface border-2 p-[23px]'
                    : 'border-lv-border border p-6'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="m-0 text-xl font-bold">{plan.name}</h2>
                  {plan.recommended && (
                    <span className="bg-lv-accent text-lv-on-accent rounded-full px-2.5 py-1 text-xs font-bold">
                      Recommended
                    </span>
                  )}
                </div>
                {price && (
                  <p className="m-0 flex items-baseline gap-1.5">
                    <span className="text-[40px] font-bold tracking-[-1px] tabular-nums">
                      {money(price)}
                    </span>
                    {isNumber(price) && (
                      <span className="text-lv-text-2 text-sm">
                        {period === 'monthly' ? 'a month' : 'a year'}
                      </span>
                    )}
                  </p>
                )}
                {plan.feeNote && (
                  <p className="text-lv-text-2 m-0 text-sm">{plan.feeNote}</p>
                )}
                {plan.featuresHtml && (
                  <div
                    className="lv-plan-features"
                    dangerouslySetInnerHTML={{ __html: plan.featuresHtml }}
                  />
                )}
                <Link
                  href={plan.ctaHref}
                  className={cn(
                    'mt-auto rounded-full text-center no-underline',
                    plan.recommended
                      ? 'bg-lv-primary text-lv-on-primary p-4 font-bold'
                      : 'border-lv-border text-lv-link border-2 p-3.5 font-semibold'
                  )}
                >
                  {plan.ctaLabel}
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
