import Link from 'next/link';
import { CookieSettings } from '@/components/cookie-settings';
import { site } from '@/lib/site';

/** Footer with the ownership line from the brand rollout checklist. */
export function SiteFooter() {
  return (
    <footer className="border-lv-border border-t">
      <div className="text-lv-text-3 max-w-layout px-gutter mx-auto flex flex-wrap justify-between gap-5 py-8 text-sm">
        <p className="m-0">
          © 2026{' '}
          <a
            href={site.owner.url}
            className="text-lv-link underline underline-offset-2"
          >
            {site.owner.name}
          </a>
          . Levuche is a product managed by {site.owner.name}.
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-5">
          <Link href="/blog" className="text-lv-link">
            Blog
          </Link>
          <Link href="/docs" className="text-lv-link">
            Docs
          </Link>
          <Link href="/terms" className="text-lv-link">
            Terms
          </Link>
          <Link href="/privacy" className="text-lv-link">
            Privacy
          </Link>
          <Link href="/pack-terms" className="text-lv-link">
            Pack terms
          </Link>
          <Link href="/security" className="text-lv-link">
            Security
          </Link>
          <Link href="/contact" className="text-lv-link">
            Contact
          </Link>
          <CookieSettings />
        </nav>
      </div>
    </footer>
  );
}
