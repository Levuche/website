import Link from 'next/link';
import { site } from '@/lib/site';

/** Footer with the ownership line from the brand rollout checklist. */
export function SiteFooter() {
  return (
    <footer className="border-lv-border border-t">
      <div className="text-lv-text-3 mx-auto flex max-w-[1240px] flex-wrap justify-between gap-5 px-[clamp(16px,3vw,32px)] py-8 text-sm">
        <p className="m-0">
          © 2026{' '}
          <a href={site.owner.url} className="text-lv-link">
            {site.owner.name}
          </a>
          . Levuche is a product managed by {site.owner.name}.
        </p>
        <nav aria-label="Legal" className="flex flex-wrap gap-5">
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
        </nav>
      </div>
    </footer>
  );
}
