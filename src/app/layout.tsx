import type { Metadata, Viewport } from 'next';
import { QueryProvider } from '@/components/query-provider';
import { SaaSProvider } from '@/components/saas-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { isIndexable, site, siteUrl } from '@/lib/site';
import { sora } from './fonts';
// Buildbase's component styles first, so globals.css can theme them.
import '@buildbase/sdk/css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  // Brand kit favicon/head-snippet.html.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: isIndexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={sora.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="data-lv"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <SaaSProvider>{children}</SaaSProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
