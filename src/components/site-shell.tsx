import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

/** Skip link, header, the page as <main>, footer. */
export function SiteShell({
  children,
  current,
}: {
  children: React.ReactNode;
  current?: 'pricing' | null;
}) {
  return (
    <div className="bg-lv-bg text-lv-text flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="focus:bg-lv-card focus:text-lv-text sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>
      <SiteHeader current={current} />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
