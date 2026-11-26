import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteShell } from '@/components/site-shell';
import { ContactForm } from '@/components/contact-form';
import { contact } from '@/lib/contact';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  path: '/contact',
  title: 'Contact',
  image: '/og/contact.png',
  description:
    'How to reach the Levuche team about your page, your account, privacy or security.',
});

function Address({ value }: { value: string }) {
  return (
    <a href={`mailto:${value}`} className="text-lv-link font-semibold">
      {value}
    </a>
  );
}

/**
 * Contact page in the marketing pages' style. The form sends to the Contact
 * form in Buildbase (see /api/contact); the addresses are hello@levuche.com
 * unless NEXT_PUBLIC_*_EMAIL names another levuche.com address.
 */
export default function ContactPage() {
  const card =
    'bg-lv-card border-lv-border flex flex-col gap-2 rounded-card border p-6';
  const text = 'text-lv-text-2 m-0 text-base leading-relaxed';
  return (
    <SiteShell>
      <div className="max-w-article px-gutter mx-auto flex flex-col gap-8 pt-7 pb-16">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-h1 m-0">Contact</h1>
          <p className="text-lv-text-2 m-0 text-base leading-relaxed">
            Questions about Levuche, your site or your data? Write to us.
          </p>
        </div>

        <section className="bg-lv-card border-lv-border rounded-card flex flex-col gap-4 border p-6">
          <h2 className="m-0 text-lg font-bold">Send us a message</h2>
          <ContactForm />
        </section>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <section className={card}>
            <h2 className="m-0 text-lg font-bold">General and support</h2>
            <p className={text}>
              <Address value={contact.general} />
            </p>
          </section>
          <section className={card}>
            <h2 className="m-0 text-lg font-bold">Privacy</h2>
            <p className={text}>
              <Address value={contact.privacy} />
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
              <Address value={contact.security} />
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

        <section className="bg-lv-surface rounded-card flex flex-col gap-2 p-6">
          <h2 className="m-0 text-lg font-bold">Who runs Levuche</h2>
          <p className={text}>
            Levuche was founded by {site.owner.founder} and is managed by{' '}
            <a href={site.owner.url} className="text-lv-link">
              {site.owner.name}
            </a>
            .
          </p>
          <p className={text}>
            {site.owner.name}, {site.owner.address}
          </p>
        </section>
      </div>
    </SiteShell>
  );
}
