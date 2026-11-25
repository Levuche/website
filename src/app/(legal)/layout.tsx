import { LegalNav } from '@/components/legal-nav';
import { SiteShell } from '@/components/site-shell';
import Link from 'next/link';
import { contact } from '@/lib/contact';

/** Sidebar layout for the legal and trust pages (MarketingPages board). */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const security = contact.security;
  return (
    <SiteShell>
      <div className="max-w-content px-gutter mx-auto grid grid-cols-1 items-start gap-10 pt-7 pb-16 md:grid-cols-[240px_minmax(0,1fr)] md:gap-14">
        <aside className="flex flex-col gap-5">
          <LegalNav />
          <div className="border-lv-border flex flex-col gap-2 rounded-2xl border p-4">
            <p className="text-ui m-0 font-bold">Found a security issue?</p>
            <p className="text-lv-text-2 text-caption m-0">
              Tell us privately at{' '}
              <a href={`mailto:${security}`} className="text-lv-link">
                {security}
              </a>
              . See{' '}
              <Link href="/security" className="text-lv-link">
                Security
              </Link>{' '}
              for how we handle reports.
            </p>
          </div>
        </aside>
        {children}
      </div>
    </SiteShell>
  );
}
