import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { FaqList } from '@/components/faq-list';
import { PricingPlans } from '@/components/pricing-plans';
import { SiteShell } from '@/components/site-shell';
import {
  BILLING,
  addOnOffer,
  compareRows,
  getAddOns,
  getPlanGroup,
  planOffer,
  type Offer,
} from '@/lib/billing';
import { CONTENT, getFaqs } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  path: '/pricing',
  title: 'Pricing',
  description:
    'Levuche plans for creators who sell packs, prompts and guides from their link in bio.',
});

// The cards and the compare table come from Buildbase Billing (add-ons and
// the pricing group, src/lib/billing.ts); the questions from Content, FAQs.
// Parts with nothing in Buildbase are left out.
export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  const [addOns, group, questions] = await Promise.all([
    getAddOns(),
    getPlanGroup(),
    getFaqs(CONTENT.faqs.pricing),
  ]);
  const plans = group.plans.filter((plan) => planOffer(plan) !== null);
  const planOffers = plans.map(planOffer).filter((o): o is Offer => o !== null);
  const offers = [
    ...addOns.map(addOnOffer).filter((o): o is Offer => o !== null),
    ...planOffers,
  ];
  const columns = planOffers.map((o) => o.name);
  const rows = columns.length > 1 ? compareRows(plans, group.items) : [];
  const onlyOnce = offers.length > 0 && offers.every((o) => o.once);
  const compare = rows.length > 0 && columns.length > 0;

  return (
    <SiteShell current="pricing">
      <div
        className={cn(
          'max-w-layout px-gutter mx-auto flex flex-col gap-7 pt-7 pb-16',
          // With one plan and nothing to compare, the questions sit beside
          // the plan on a desktop instead of under it, so the page isn't all
          // on the left.
          !compare &&
            'lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-x-12'
        )}
      >
        <PricingPlans
          offers={offers}
          currency={BILLING.currency}
          intro={
            <div className="max-w-form flex flex-col gap-2.5">
              <h1 className="text-h1 m-0">
                Pick a plan when you’re ready to sell
              </h1>
              {onlyOnce && (
                <p className="text-lv-text-2 m-0 text-base leading-relaxed">
                  Pay once. No monthly fee.
                </p>
              )}
              {offers.length === 0 && (
                <p className="text-lv-text-2 m-0 text-base leading-relaxed">
                  Plans are being finalised. Join the beta and we’ll email you
                  when they’re ready.
                </p>
              )}
            </div>
          }
        />

        <div
          className={cn(
            'grid grid-cols-1 items-start gap-8',
            compare && 'lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'
          )}
        >
          {compare && (
            <section className="flex flex-col gap-3">
              <h2 className="m-0 text-xl font-bold">Compare plans</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="text-lv-text-3 text-left">
                      <th scope="col" className="px-2 py-2.5 font-semibold">
                        Feature
                      </th>
                      {columns.map((name, i) => (
                        <th
                          key={`${i}-${name}`}
                          scope="col"
                          className="px-2 py-2.5 font-semibold"
                        >
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-lv-text-2">
                    {rows.map((row, r) => (
                      <tr
                        key={`${r}-${row.name}`}
                        className="border-lv-border border-t last:border-b"
                      >
                        <th
                          scope="row"
                          className="text-lv-text px-2 py-2.75 text-left font-semibold"
                        >
                          {row.name}
                        </th>
                        {row.values.map((value, i) => (
                          <td key={i} className="px-2 py-2.75">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {questions.length > 0 && (
            <section className="flex flex-col gap-2.5">
              <h2 className="text-h3 m-0 mb-0.5">Questions</h2>
              <FaqList faqs={questions} openFirst />
            </section>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
