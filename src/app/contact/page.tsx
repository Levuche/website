import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteShell } from '@/components/site-shell';
import { contact, contactPlaceholder } from '@/lib/contact';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  path: '/contact',
  title: 'Contact',
  description:
    'How to reach the Levuche team about the beta, your account, privacy or security.',
});

function Address({
  value,
  placeholder,
}: {
  value: string | null;
  placeholder: string;
}) {
  return value ? (
    <a href={`mailto:${value}`} className="text-lv-link font-semibold">
      {value}
    </a>
  ) : (
    <span className="font-semibold">{placeholder}</span>
  );
}

/**
 * Contact page in the marketing pages' style. Addresses come from
 * NEXT_PUBLIC_*_EMAIL (levuche.com addresses only) and show placeholders
 * until they are chosen.
 */
export default function ContactPage() {
  const card =
    'bg-lv-card border-lv-border flex flex-col gap-2 rounded-[20px] border p-6';
  const text = 'text-lv-text-2 m-0 text-base leading-relaxed';
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-[880px] flex-col gap-8 px-[clamp(16px,3vw,32px)] pt-7 pb-16">
        <div className="flex flex-col gap-2.5">
          <h1 className="m-0 text-[clamp(36px,5vw,48px)] leading-[1.05] font-bold tracking-[-1.4px]">
            Contact
          </h1>
          <p className="text-lv-text-2 m-0 text-[17px] leading-relaxed">
            Questions about the beta, your site or your data? Write to us.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-5">
          <section className={card}>
            <h2 className="m-0 text-lg font-bold">General and support</h2>
            <p className={text}>
              <Address
                value={contact.general}
                placeholder={contactPlaceholder.general}
              />
            </p>
          </section>
          <section className={card}>
            <h2 className="m-0 text-lg font-bold">Privacy</h2>
            <p className={text}>
              <Address
                value={contact.privacy}
                placeholder={contactPlaceholder.privacy}
              />
            </p>
            <p className="text-lv-text-3 m-0 text-sm">
              See the{' '}
              <Link href="/privacy" className="text-lv-link">
                privacy policy
              </Link>
              .
            </p>
          </section>
          <section className={card}>
            <h2 className="m-0 text-lg font-bold">Security</h2>
            <p className={text}>
              <Address
                value={contact.security}
                placeholder={contactPlaceholder.security}
              />
            </p>
            <p className="text-lv-text-3 m-0 text-sm">
              Please report issues privately. See{' '}
              <Link href="/security" className="text-lv-link">
                Security
              </Link>
              .
            </p>
          </section>
        </div>

        <section className="bg-lv-surface flex flex-col gap-2 rounded-[20px] p-6">
          <h2 className="m-0 text-lg font-bold">Who runs Levuche</h2>
          <p className={text}>
            Levuche was founded by {site.owner.founder} and is managed by{' '}
            <a href={site.owner.url} className="text-lv-link">
              {site.owner.name}
            </a>
            .
          </p>
          <p className={text}>
            {site.owner.name}, {contactPlaceholder.address}
          </p>
        </section>
      </div>
    </SiteShell>
  );
}
