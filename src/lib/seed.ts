import type { Faq, RichContent } from '@buildbase/sdk/server';
import homeFeatures from '../../content/buildbase/collections/home-features.json';
import homeSteps from '../../content/buildbase/collections/home-steps.json';
import pricingCompare from '../../content/buildbase/collections/pricing-compare.json';
import pricingPlans from '../../content/buildbase/collections/pricing-plans.json';
import homeFaq from '../../content/buildbase/faqs/home-faq.json';
import pricingFaq from '../../content/buildbase/faqs/pricing-faq.json';
import richContent from '../../content/buildbase/rich-content.json';

/**
 * The seed text in content/buildbase/, used ONLY while no Buildbase API
 * token is set (a local run or a preview before Buildbase is set up), so
 * those pages still look like the design boards. Once BUILDBASE_API_TOKEN
 * is set, Buildbase is the only source: an empty or missing entry there
 * leaves its section out, and nothing here is read.
 */
const collections: Record<string, { records: Record<string, unknown>[] }> = {
  [homeSteps.slug]: homeSteps,
  [homeFeatures.slug]: homeFeatures,
  [pricingPlans.slug]: pricingPlans,
  [pricingCompare.slug]: pricingCompare,
};

const faqs: Record<string, { faqs: { question: string; answer: string }[] }> = {
  [homeFaq.slug]: homeFaq,
  [pricingFaq.slug]: pricingFaq,
};

const rich: Record<string, { title: string; content: string }> = richContent;

export function seedCollection(slug: string): Record<string, unknown>[] {
  return collections[slug]?.records ?? [];
}

export function seedFaqs(slug: string): Faq[] {
  return (faqs[slug]?.faqs ?? []).map((f, i) => ({
    _id: `seed-${slug}-${i}`,
    question: f.question,
    answer: f.answer,
    faqId: `seed-${slug}`,
    archived: false,
  }));
}

export function seedRichContent(slug: string): RichContent | null {
  const entry = rich[slug];
  return entry
    ? {
        _id: `seed-${slug}`,
        slug,
        title: entry.title,
        content: entry.content,
        archived: false,
      }
    : null;
}
