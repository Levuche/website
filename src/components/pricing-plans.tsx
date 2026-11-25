'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Period = 'monthly' | 'yearly';

/**
 * Plans from the MarketingPages board. Every name, price, fee and limit is
 * a [PLACEHOLDER] until pricing is decided; the period switch only changes
 * the "a month" / "a year" label.
 */
const plans = [
  {
    name: '[Plan 1]',
    recommended: false,
    items: [
      'Your handle.levuche.page site',
      '[N] packs',
      'Inbox and short links',
    ],
  },
  {
    name: '[Plan 2]',
    recommended: true,
    items: [
      'Everything in [Plan 1]',
      'Your own domain',
      'Version history and rollback',
      'API keys',
    ],
  },
  {
    name: '[Plan 3]',
    recommended: false,
    items: ['Everything in [Plan 2]', '[N] team members', '[Extra feature]'],
  },
];

export function PricingPlans({ intro }: { intro: React.ReactNode }) {
  const [period, setPeriod] = useState<Period>('monthly');
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
            Yearly, save [N]%
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5">
        {plans.map((plan) => (
          <article
            key={plan.name}
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
            <p className="m-0 flex items-baseline gap-1.5">
              <span className="text-[40px] font-bold tracking-[-1px] tabular-nums">
                $[PRICE]
              </span>
              <span className="text-lv-text-2 text-sm">
                {period === 'monthly' ? 'a month' : 'a year'}
              </span>
            </p>
            <p className="text-lv-text-2 m-0 text-sm">
              [FEE]% per sale, plus Stripe fees
            </p>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[15px]">
              {plan.items.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden
                    className="text-lv-success mt-0.5 flex-none"
                  >
                    <path d="M5 12l5 5 9-10" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/#beta"
              className={cn(
                'mt-auto rounded-full text-center no-underline',
                plan.recommended
                  ? 'bg-lv-primary text-lv-on-primary p-4 font-bold'
                  : 'border-lv-border text-lv-link border-2 p-3.5 font-semibold'
              )}
            >
              Join the beta
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
