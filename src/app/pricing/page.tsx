import type { Metadata } from 'next';
import { ArticleHtml } from '@/components/article-html';
import { FaqList } from '@/components/faq-list';
import { PricingPlans, type Plan } from '@/components/pricing-plans';
import { SiteShell } from '@/components/site-shell';
import { CONTENT, getCollection, getFaqs, getRichContent } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  path: '/pricing',
  title: 'Pricing',
  description:
    'Levuche plans for creators who sell packs, prompts and guides from their link in bio.',
});

// Plans, the compare table, the intro line and the questions come from
// Buildbase on each request (docs/BUILDBASE.md). Parts with nothing in
// Buildbase are left out.
export const dynamic = 'force-dynamic';

type PlanRecord = {
  name?: string;
  monthly_price?: string | number;
  yearly_price?: string | number;
  fee_note?: string;
  features?: string;
  recommended?: boolean;
  cta_label?: string;
  cta_url?: string;
  order?: number;
};

type CompareRecord = {
  feature?: string;
  plan_1?: string;
  plan_2?: string;
  plan_3?: string;
  plan_4?: string;
  order?: number;
};

const text = (value: unknown) => (value == null ? '' : String(value).trim());

/** A plan's button links only to this site or to an https page. */
function safeHref(value: unknown) {
  const href = text(value);
  return /^\/(?!\/)/.test(href) || href.startsWith('https://')
    ? href
    : '/#beta';
}

/**
 * A plan's features as sanitised HTML. The field may be plain text with one
 * feature per line, a Markdown list, or rich-text HTML; it goes through the
 * same Markdown renderer and sanitiser as every other Buildbase text.
 */
function featuresHtml(value: unknown): string {
  const source = text(value);
  if (!source) return '';
  const isMarkup =
    source.includes('<') ||
    source.split('\n').some((line) => /^\s*([-*]|\d+\.)\s/.test(line));
  const markdown = isMarkup
    ? source
    : source
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `- ${line}`)
        .join('\n');
  return renderMarkdown(markdown).html;
}

function toPlan(record: PlanRecord): Plan | null {
  const name = text(record.name);
  if (!name) return null;
  return {
    name,
    monthlyPrice: text(record.monthly_price),
    yearlyPrice: text(record.yearly_price),
    feeNote: text(record.fee_note),
    featuresHtml: featuresHtml(record.features),
    recommended: record.recommended === true,
    ctaLabel: text(record.cta_label) || 'Join the beta',
    ctaHref: safeHref(record.cta_url),
  };
}

export default async function PricingPage() {
  const [planRecords, compareRecords, intro, questions] = await Promise.all([
    getCollection<PlanRecord>(CONTENT.collections.pricingPlans),
    getCollection<CompareRecord>(CONTENT.collections.pricingCompare),
    getRichContent(CONTENT.rich.pricingIntro),
    getFaqs(CONTENT.faqs.pricing),
  ]);
  const plans = planRecords.map(toPlan).filter((p): p is Plan => p !== null);
  const columns = plans.slice(0, 4).map((plan) => plan.name);
  const rows = compareRecords
    .map((row) => ({
      feature: text(row.feature),
      values: columns.map((_, i) =>
        text(row[`plan_${i + 1}` as keyof CompareRecord])
      ),
    }))
    .filter((row) => row.feature);
  const introHtml = intro ? renderMarkdown(intro.content).html : '';

  return (
    <SiteShell current="pricing">
      <div className="mx-auto flex max-w-[1184px] flex-col gap-7 px-[clamp(16px,3vw,32px)] pt-7 pb-16">
        <PricingPlans
          plans={plans}
          intro={
            <div className="flex max-w-[640px] flex-col gap-2.5">
              <h1 className="m-0 text-[clamp(36px,5vw,48px)] leading-[1.05] font-bold tracking-[-1.4px]">
                Pick a plan when you’re ready to sell
              </h1>
              {introHtml ? (
                <ArticleHtml html={introHtml} className="[&_p]:my-0" />
              ) : null}
              {plans.length === 0 && (
                <p className="text-lv-text-2 m-0 text-[17px] leading-relaxed">
                  Plans are being finalised. Join the beta and we’ll email you
                  when they’re ready.
                </p>
              )}
            </div>
          }
        />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {rows.length > 0 && columns.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="m-0 text-[22px] font-bold">Compare plans</h2>
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
                        key={`${r}-${row.feature}`}
                        className="border-lv-border border-t last:border-b"
                      >
                        <th
                          scope="row"
                          className="text-lv-text px-2 py-[11px] text-left font-semibold"
                        >
                          {row.feature}
                        </th>
                        {row.values.map((value, i) => (
                          <td key={i} className="px-2 py-[11px]">
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
              <h2 className="m-0 mb-0.5 text-[22px] font-bold">Questions</h2>
              <FaqList faqs={questions} openFirst />
            </section>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
