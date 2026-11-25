import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { contact, contactPlaceholder } from '@/lib/contact';
import { getLegalPage, legalPages } from '@/lib/legal';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getLegalPage((await params).slug);
  if (!page) return {};
  return pageMetadata({
    path: `/${page.slug}`,
    title: page.title,
    description: page.description,
  });
}

const sections = ['[Section]', '[Section]', '[Section]'];

/**
 * One legal or trust page in the board's layout. All text is placeholder
 * until reviewed copy replaces it.
 */
export default async function LegalPage({ params }: Props) {
  const page = getLegalPage((await params).slug);
  if (!page) notFound();

  const isPrivacy = page.slug === 'privacy';
  const isSecurity = page.slug === 'security';
  const address = isPrivacy
    ? contact.privacy
    : isSecurity
      ? contact.security
      : contact.general;
  const addressPlaceholder = isPrivacy
    ? contactPlaceholder.privacy
    : isSecurity
      ? contactPlaceholder.security
      : contactPlaceholder.general;

  const h2 = 'mt-2.5 mb-0 text-2xl font-bold tracking-[-0.3px]';
  const body = 'text-lv-text-2 m-0 text-[17px] leading-[1.7]';

  return (
    <article className="max-w-measure flex flex-col gap-[18px]">
      <p className="text-lv-text-3 m-0 text-sm">
        {page.group} / {page.title}
      </p>
      <h1 className="m-0 text-[clamp(34px,4.5vw,44px)] leading-[1.08] font-bold tracking-[-1.2px]">
        {page.title}
      </h1>
      <p
        role="note"
        className="bg-lv-accent-soft text-lv-on-accent-soft m-0 rounded-xl px-4 py-3 text-sm font-semibold"
      >
        Placeholder. This page shows the layout only; the final text is still to
        be written and reviewed.
      </p>
      <p className="text-lv-text-2 m-0 flex flex-wrap gap-x-[18px] gap-y-2 text-sm">
        <span>Last updated [DATE]</span>
        <span>Effective [DATE]</span>
      </p>
      <p className={body}>
        Levuche is operated by{' '}
        <a href={site.owner.url} className="text-lv-link">
          {site.owner.name}
        </a>
        .
      </p>

      <section className="bg-lv-surface flex flex-col gap-2.5 rounded-[20px] px-[22px] py-5">
        <h2 className="m-0 text-lg font-bold">The short version</h2>
        <ul className="text-lv-text-2 m-0 flex flex-col gap-2 pl-5 text-base leading-[1.55]">
          <li>[Plain-language summary point one.]</li>
          <li>[Plain-language summary point two.]</li>
          <li>[Plain-language summary point three.]</li>
        </ul>
        <p className="text-lv-text-3 m-0 text-[13px]">
          This summary isn’t the policy. The full text below is what applies.
        </p>
      </section>

      <nav aria-label="On this page" className="flex flex-wrap gap-2">
        {sections.map((label, i) => (
          <a
            key={i}
            href={`#section-${i + 1}`}
            className="border-lv-border text-lv-link rounded-full border-2 px-3.5 py-2 text-sm font-semibold no-underline"
          >
            {i + 1}. {label}
          </a>
        ))}
        <a
          href="#contact"
          className="border-lv-border text-lv-link rounded-full border-2 px-3.5 py-2 text-sm font-semibold no-underline"
        >
          Contact
        </a>
      </nav>

      <h2 id="section-1" className={`${h2} scroll-mt-4`}>
        1. [Section title]
      </h2>
      <p className={body}>[Legal text.]</p>

      <h2 id="section-2" className={`${h2} scroll-mt-4`}>
        2. [Section title]
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="text-lv-text-3 pb-2 text-left text-sm">
            [Table caption]
          </caption>
          <thead>
            <tr className="text-lv-text-3 text-left">
              {[0, 1, 2].map((n) => (
                <th key={n} scope="col" className="px-2 py-2.5 font-semibold">
                  [Column]
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-lv-text-2">
            {[0, 1].map((r) => (
              <tr key={r} className="border-lv-border border-t last:border-b">
                {[0, 1, 2].map((c) => (
                  <td key={c} className="px-2 py-[11px]">
                    [Value]
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="section-3" className={`${h2} scroll-mt-4`}>
        3. [Section title]
      </h2>
      <p className={body}>[Legal text.]</p>

      <h2 id="contact" className={`${h2} scroll-mt-4`}>
        Contact
      </h2>
      <p className={body}>
        {address ? (
          <a href={`mailto:${address}`} className="text-lv-link">
            {address}
          </a>
        ) : (
          addressPlaceholder
        )}
        . {site.owner.name}, {contactPlaceholder.address}.
      </p>
    </article>
  );
}
