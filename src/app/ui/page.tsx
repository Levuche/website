import type { Metadata } from 'next';
import { Gallery } from './gallery';

// The website's and app's own components in one place, for building and for
// the end-to-end tests. Not linked from the site and not in the sitemap.
export const metadata: Metadata = {
  title: 'Components',
  robots: { index: false, follow: false },
};

export default function ComponentsPage() {
  return <Gallery />;
}
