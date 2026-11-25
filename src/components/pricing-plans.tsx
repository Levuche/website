'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BuyAddOn } from '@/components/buy-add-on';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        {intro}
        {hasMonthly && hasYearly && (
          <ToggleGroup
            type="single"
            aria-label="Billing period"
            value={period}
            // Ignore a press on the chosen option, which would clear it.
            onValueChange={(next) => next && setPeriod(next as Period)}
          >
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="yearly">
              {saving > 0 ? `Yearly, save ${saving}%` : 'Yearly'}
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      </div>

      {offers.length > 0 && (
        <div
          className={cn(
            'grid grid-cols-1 gap-5',
            offers.length === 1 && 'max-w-narrow',
            offers.length === 2 && 'sm:grid-cols-2',
            offers.length >= 3 && 'md:grid-cols-3'
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
            const variant = lead ? 'default' : 'outline';
            const size = lead ? 'lg' : 'default';
            return (
              <Card
                key={offer.key}
                className={cn(
                  'rounded-3xl',
                  main
                    ? 'border-primary bg-muted border-2 p-5.75'
                    : 'bg-background p-6'
                )}
              >
                <CardHeader>
                  <CardTitle>
                    <h2 className="m-0 text-lg font-bold">{offer.name}</h2>
                  </CardTitle>
                  {offer.badge && <Badge>{offer.badge}</Badge>}
                </CardHeader>
                {price && (
                  <p className="m-0 flex items-baseline gap-1.5">
                    <span className="text-price tabular-nums">{price}</span>
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
                    className={buttonVariants({
                      variant,
                      size,
                      className: 'mt-auto w-full',
                    })}
                  />
                ) : (
                  <Button
                    asChild
                    variant={variant}
                    size={size}
                    className="mt-auto w-full"
                  >
                    <Link href="/#beta">Join the beta</Link>
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
