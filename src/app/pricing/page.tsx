import type { Metadata } from 'next';
import { PricingPlans } from '@/components/pricing-plans';
import { SiteShell } from '@/components/site-shell';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  path: '/pricing',
  title: 'Pricing',
  description:
    'Levuche plans for creators who sell packs, prompts and guides from their link in bio.',
});

const rows = [
  { feature: 'Packs', values: ['[N]', '[N]', '[N]'] },
  { feature: 'Fee per sale', values: ['[FEE]%', '[FEE]%', '[FEE]%'] },
  { feature: 'Own domain', values: ['[Value]', '[Value]', '[Value]'] },
  { feature: 'Short links', values: ['[Value]', '[Value]', '[Value]'] },
  { feature: 'Team members', values: ['[N]', '[N]', '[N]'] },
];

const questions = [
  {
    q: 'What does Levuche take from a sale?',
    a: '[Answer from the billing terms.]',
  },
  { q: 'How do I get paid?', a: '[Answer.]' },
  { q: 'Can I switch or cancel my plan?', a: '[Answer.]' },
];

export default function PricingPage() {
  return (
    <SiteShell current="pricing">
      <div className="mx-auto flex max-w-[1184px] flex-col gap-7 px-[clamp(16px,3vw,32px)] pt-7 pb-16">
        <PricingPlans
          intro={
            <div className="flex max-w-[640px] flex-col gap-2.5">
              <h1 className="m-0 text-[clamp(36px,5vw,48px)] leading-[1.05] font-bold tracking-[-1.4px]">
                Pick a plan when you’re ready to sell
              </h1>
              <p className="text-lv-text-2 m-0 text-[17px] leading-relaxed">
                [One line on how pricing works during and after the beta.]
              </p>
            </div>
          }
        />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-[22px] font-bold">Compare plans</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-lv-text-3 text-left">
                    <th scope="col" className="px-2 py-2.5 font-semibold">
                      Feature
                    </th>
                    {['[Plan 1]', '[Plan 2]', '[Plan 3]'].map((name) => (
                      <th
                        key={name}
                        scope="col"
                        className="px-2 py-2.5 font-semibold"
                      >
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-lv-text-2">
                  {rows.map((row) => (
                    <tr
                      key={row.feature}
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
          <section className="flex flex-col gap-2.5">
            <h2 className="m-0 mb-0.5 text-[22px] font-bold">Questions</h2>
            {questions.map((item, i) => (
              <details
                key={item.q}
                open={i === 0}
                className="bg-lv-surface rounded-2xl px-4 py-3.5"
              >
                <summary className="min-h-6 cursor-pointer text-[15px] font-semibold">
                  {item.q}
                </summary>
                <p className="text-lv-text-2 mt-2.5 mb-0 text-sm leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
