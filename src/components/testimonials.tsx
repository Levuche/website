import type { Testimonial } from '@buildbase/sdk/server';
import { QuoteGrid } from '@/components/marketing';

/** Testimonials from Buildbase, as quote cards. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <QuoteGrid
      quotes={items.map((t) => ({
        quote: t.content,
        name: t.name,
        role: [t.position, t.company?.name].filter(Boolean).join(', '),
        avatar: t.avatar,
      }))}
    />
  );
}
