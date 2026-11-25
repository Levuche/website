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
      className={cn(
        'mx-auto w-full max-w-[1240px] px-[clamp(16px,3vw,32px)]',
        className
      )}
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
      className={cn(
        'scroll-mt-4 py-[clamp(56px,7vw,96px)]',
        tones[tone],
        className
      )}
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
  return (
    <Tag
      className={cn(
        'm-0 text-[clamp(30px,4vw,44px)] leading-[1.1] font-bold tracking-[-1px]',
        className
      )}
      {...props}
    />
  );
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
        'm-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-5 p-0',
        className
      )}
    >
      {steps.map((step, i) => (
        <li
          key={i}
          className="bg-lv-card border-lv-border flex flex-col gap-3 rounded-[20px] border p-7"
        >
          <span
            aria-hidden
            className="bg-lv-brand text-lv-on-brand flex size-11 items-center justify-center rounded-full font-bold"
          >
            {i + 1}
          </span>
          <h3 className="m-0 text-[22px] font-bold">{step.title}</h3>
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
        'border-lv-border m-0 grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-x-12 border-t',
        className
      )}
    >
      {features.map((feature, i) => (
        <div key={i} className="border-lv-border border-b py-[22px]">
          <dt className="text-[19px] font-bold">{feature.title}</dt>
          {feature.body ? (
            <dd className="text-lv-text-2 mx-0 mt-1.5 leading-relaxed">
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
    <figure className="bg-lv-card border-lv-border m-0 flex h-full flex-col gap-4 rounded-[20px] border p-7">
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
        'm-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5 p-0',
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
