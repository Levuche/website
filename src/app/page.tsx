import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CreatorHeader,
  PackRow,
  ReelGrid,
  siteButtonClasses,
} from '@levuche/ui';
import { ArticleHtml } from '@/components/article-html';
import { BetaForm } from '@/components/beta-form';
import { FaqList } from '@/components/faq-list';
import { JsonLd } from '@/components/json-ld';
import { SiteShell } from '@/components/site-shell';
import { Testimonials } from '@/components/testimonials';
import { buttonClasses } from '@/components/ui/button';
import {
  Card,
  Container,
  FeatureList,
  Section,
  SectionHeading,
  StepList,
} from '@/components/ui/marketing';
import { PhoneFrame } from '@/components/ui/phone-frame';
import { addOnOffer, getAddOns, type Offer } from '@/lib/billing';
import {
  CONTENT,
  getCollection,
  getFaqs,
  getTestimonials,
} from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { absoluteUrl, site } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  path: '/',
  title: 'Levuche: Your link in bio, now a shop',
  absoluteTitle: true,
  description:
    'Levuche turns your Instagram link into a small website that sells your packs, prompts and guides. Pay $9 once. No monthly fee.',
});

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: absoluteUrl('/'),
  logo: absoluteUrl('/levuche-icon-512.png'),
  parentOrganization: {
    '@type': 'Organization',
    name: site.owner.name,
    url: site.owner.url,
    founder: { '@type': 'Person', name: site.owner.founder },
  },
};

// The steps, features, testimonials and questions come from Buildbase
// Content, and the pricing card from Buildbase Billing, on each request (see src/lib/content.ts and docs/BUILDBASE.md).
// A section with nothing in Buildbase is left out.
export const dynamic = 'force-dynamic';

type Item = { title?: string; body?: string; order?: number };

export default async function HomePage() {
  const [steps, features, addOns, testimonials, faqs] = await Promise.all([
    getCollection<Item>(CONTENT.collections.homeSteps),
    getCollection<Item>(CONTENT.collections.homeFeatures),
    getAddOns(),
    getTestimonials(),
    getFaqs(CONTENT.faqs.home),
  ]);
  // The home card shows the first add-on on sale (Buildbase Billing).
  const offer =
    addOns.map(addOnOffer).find((o): o is Offer => o !== null) ?? null;

  return (
    <SiteShell>
      <JsonLd data={organization} />

      <section
        id="beta"
        className="scroll-mt-4 pt-[clamp(24px,4vw,56px)] pb-[clamp(56px,7vw,96px)]"
      >
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-[clamp(32px,5vw,64px)]">
          <div className="flex flex-col gap-6">
            <h1 className="m-0 text-[clamp(40px,6vw,64px)] leading-[1.05] font-bold tracking-[-2px]">
              Your link in bio, now a shop.
            </h1>
            <p className="text-lv-text-2 m-0 max-w-[520px] text-[clamp(17px,2vw,20px)] leading-relaxed">
              Levuche turns your Instagram link into a small website that sells
              your packs, prompts and guides. Pay $9 once. No monthly fee.
            </p>
            <BetaForm />
            <p className="text-lv-text-3 m-0 text-sm">
              We approve creators in small groups. You will get an email when
              your spot opens.
            </p>
          </div>
          <div className="flex justify-center">
            <PhonePreview />
          </div>
        </Container>
      </section>

      {steps.length > 0 && (
        <Section id="how" tone="surface">
          <Container className="flex flex-col gap-10">
            <SectionHeading>
              Live in {steps.length === 3 ? 'three' : steps.length}{' '}
              {steps.length === 1 ? 'step' : 'steps'}
            </SectionHeading>
            <StepList
              steps={steps.map((step) => ({
                title: step.title,
                body: step.body,
              }))}
            />
          </Container>
        </Section>
      )}

      {features.length > 0 && (
        <Section id="features">
          <Container className="flex flex-col gap-10">
            <SectionHeading>Everything a creator store needs</SectionHeading>
            <FeatureList
              features={features.map((feature) => ({
                title: feature.title,
                body: feature.body,
              }))}
            />
          </Container>
        </Section>
      )}

      {testimonials.length > 0 && (
        <Section id="creators" className="pt-0">
          <Container className="flex flex-col gap-10">
            <SectionHeading>What creators say</SectionHeading>
            <Testimonials items={testimonials} />
          </Container>
        </Section>
      )}

      <Section id="pricing" tone="surface">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-center gap-10">
          <div className="flex flex-col gap-4">
            <SectionHeading>
              Pay once. Then only for what you use.
            </SectionHeading>
            <p className="text-lv-text-2 m-0 text-lg leading-relaxed">
              No monthly fee just to keep your page online.
            </p>
          </div>
          <Card className="flex flex-col gap-[18px] rounded-[28px] p-[clamp(24px,3vw,36px)]">
            {offer ? (
              <>
                <p className="m-0 flex items-baseline gap-2.5">
                  <strong className="text-[56px] leading-none font-bold">
                    {offer.once || offer.monthly || offer.yearly}
                  </strong>
                  <span className="text-lv-text-2 text-lg">
                    {offer.once
                      ? offer.payerType === 'workspace'
                        ? 'once per page'
                        : 'once'
                      : offer.monthly
                        ? 'a month'
                        : 'a year'}
                  </span>
                </p>
                {offer.featuresHtml && (
                  <ArticleHtml
                    html={offer.featuresHtml}
                    className="[&_li]:my-0 [&_ul]:my-0 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2.5 [&_ul]:pl-5 [&_ul]:leading-normal"
                  />
                )}
              </>
            ) : (
              <p className="text-lv-text-2 m-0 text-lg leading-relaxed">
                See the plans and what each one includes.
              </p>
            )}
            <Link href="/pricing" className="text-lv-link font-semibold">
              Pricing details
            </Link>
            <Link
              href="/#beta"
              className={buttonClasses({ size: 'lg', className: 'w-full' })}
            >
              Join the beta
            </Link>
          </Card>
        </Container>
      </Section>

      {faqs.length > 0 && (
        <Section id="faq">
          <Container className="flex flex-col gap-8">
            <SectionHeading>Questions</SectionHeading>
            <div className="max-w-[820px]">
              <FaqList faqs={faqs} openFirst />
            </div>
          </Container>
        </Section>
      )}

      <Section tone="brand">
        <Container className="flex flex-wrap items-center justify-between gap-7">
          <SectionHeading className="text-lv-on-brand text-[clamp(34px,5vw,52px)] tracking-[-1.5px]">
            Say “I’ll take it.”
          </SectionHeading>
          <Link
            href="/#beta"
            className={buttonClasses({ variant: 'accent', size: 'lg' })}
          >
            Get early access
          </Link>
        </Container>
      </Section>
    </SiteShell>
  );
}

/** The sample creator site ("Desi Origins") in a phone frame. */
function PhonePreview() {
  return (
    <PhoneFrame
      label="Example creator site on Levuche"
      caption="desiorigins.levuche.page"
    >
      <CreatorHeader
        name="Desi Origins"
        tagline="How everyday things began"
        headingAs="p"
        className="pt-1.5"
      />
      <PackRow
        title="Origins reel pack"
        detail="100 prompts, 1 guide"
        price="$[PRICE]"
      />
      <p className={siteButtonClasses({ fullWidth: true, className: 'm-0' })}>
        I’ll take it
      </p>
      <ReelGrid reels={[{}, {}, {}]} />
    </PhoneFrame>
  );
}
