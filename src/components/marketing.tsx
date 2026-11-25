import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage, initials } from './ui/avatar';

/** The 1240 px page column with fluid side padding. */
export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('max-w-layout px-gutter mx-auto w-full', className)}
      {...props}
    />
  );
}

export type SectionTone = 'plain' | 'surface' | 'brand';

/**
 * A full-width page band with the marketing boards' vertical rhythm.
 * `tone="brand"` is the navy closing band.
 */
export function Section({
  tone = 'plain',
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { tone?: SectionTone }) {
  const tones: Record<SectionTone, string> = {
    plain: '',
    surface: 'bg-lv-surface',
    brand: 'bg-lv-brand text-lv-on-brand',
  };
  return (
    <section
      className={cn('py-section scroll-mt-4', tones[tone], className)}
      {...props}
    >
      {children}
    </section>
  );
}

/** A section's h2 at the marketing size. */
export function SectionHeading({
  as: Tag = 'h2',
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3' }) {
  return <Tag className={cn('text-h2 m-0', className)} {...props} />;
}

export type Step = { title: ReactNode; body?: ReactNode };

/** "Live in three steps": numbered cards in a responsive grid. */
export function StepList({
  steps,
  className,
}: {
  steps: Step[];
  className?: string;
}) {
  return (
    <ol
      className={cn(
        'm-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3',
        className
      )}
    >
      {steps.map((step, i) => (
        <li
          key={i}
          className="bg-lv-card border-lv-border rounded-card flex flex-col gap-2.5 border p-6"
        >
          <span
            aria-hidden
            className="bg-lv-brand text-lv-on-brand flex size-9 items-center justify-center rounded-full text-sm font-bold"
          >
            {i + 1}
          </span>
          <h3 className="m-0 text-lg font-bold">{step.title}</h3>
          {step.body ? (
            <p className="text-lv-text-2 m-0 text-base leading-relaxed">
              {step.body}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export type Feature = { title: ReactNode; body?: ReactNode };

/** Organisms board: a feature list in ruled rows, not a card grid. */
export function FeatureList({
  features,
  className,
}: {
  features: Feature[];
  className?: string;
}) {
  return (
    <dl
      className={cn(
        'border-lv-border m-0 grid grid-cols-1 gap-x-12 border-t md:grid-cols-2',
        className
      )}
    >
      {features.map((feature, i) => (
        <div key={i} className="border-lv-border border-b py-4">
          <dt className="text-base font-bold">{feature.title}</dt>
          {feature.body ? (
            <dd className="text-lv-text-2 text-ui mx-0 mt-1 leading-relaxed">
              {feature.body}
            </dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

export type Quote = {
  quote: ReactNode;
  name: string;
  /** Role and company, such as "Creator, Desi Origins". */
  role?: string;
  avatar?: string | null;
};

/** A testimonial: the quote, then who said it. */
export function QuoteCard({ quote, name, role, avatar }: Quote) {
  return (
    <figure className="bg-lv-card border-lv-border rounded-card m-0 flex h-full flex-col gap-4 border p-7">
      <blockquote className="text-lv-text-2 m-0 text-base leading-relaxed">
        “{quote}”
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        <Avatar aria-hidden>
          {avatar ? <AvatarImage src={avatar} alt="" /> : null}
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
        <span className="flex flex-col">
          <span className="text-lv-text font-bold">{name}</span>
          {role ? <span className="text-lv-text-3 text-sm">{role}</span> : null}
        </span>
      </figcaption>
    </figure>
  );
}

/** Testimonials in a responsive grid. */
export function QuoteGrid({
  quotes,
  className,
}: {
  quotes: Quote[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        'm-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {quotes.map((q, i) => (
        <li key={`${i}-${q.name}`} className="m-0">
          <QuoteCard {...q} />
        </li>
      ))}
    </ul>
  );
}
