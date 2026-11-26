import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import { TAG_SCRIPT_ORIGINS } from '@buildbase/sdk/tracking';

/** Only the production host is indexed; previews and staging send noindex. */
const isIndexable =
  (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://levuche.com').replace(
    /\/+$/,
    ''
  ) === 'https://levuche.com';

/** The Buildbase API, which the browser calls for sign-in, buying and analytics. */
const buildbaseApi = new URL(
  process.env.NEXT_PUBLIC_BUILDBASE_SERVER_URL?.trim() ||
    'https://api.console.buildbase.app'
).origin;

/**
 * The hosts the tags from Buildbase's Tracking & tags load from and report
 * to (Buildbase's "Providers" doc). The script hosts come from the SDK, so
 * they follow the providers it supports. The others are the hosts Buildbase
 * measured for Google (GA4, Tag Manager, Google Ads), Meta and X; any other
 * pixel's reporting host shows as refused in the browser console on the dev
 * site, where the policy is report-only, and gets added here.
 */
const tagScriptHosts = [
  ...TAG_SCRIPT_ORIGINS,
  'https://googleads.g.doubleclick.net',
];
const tagConnectHosts = [
  'https://ad.doubleclick.net',
  'https://*.google-analytics.com',
  'https://*.analytics.google.com',
  'https://www.google.com',
];

/**
 * The Content-Security-Policy: only the hosts the site needs. Next.js and
 * next-themes put small scripts and styles inline, so those stay allowed.
 * Blog and docs images come from Buildbase Content, and tracking pixels are
 * images too, so any https image is allowed. Sign-in and Stripe Checkout are
 * full-page redirects and need no entry.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${tagScriptHosts.join(' ')}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${buildbaseApi} ${tagConnectHosts.join(' ')}`,
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

/**
 * Sent on every response. The dev site, previews and `next dev` send the
 * policy as report-only, so a host it misses shows in the browser console
 * instead of breaking the page; a levuche.com build enforces it.
 */
const enforceCsp = isIndexable && process.env.NODE_ENV === 'production';
const securityHeaders = [
  {
    key: enforceCsp
      ? 'Content-Security-Policy'
      : 'Content-Security-Policy-Report-Only',
    value: contentSecurityPolicy,
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
];

const nextConfig: NextConfig = {
  // No `x-powered-by: Next.js` header.
  poweredByHeader: false,
  // Both packages ship TypeScript source (github.com/Levuche/ui and
  // github.com/Levuche/kit).
  transpilePackages: ['@levuche/ui', '@levuche/kit'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: isIndexable
          ? securityHeaders
          : [
              ...securityHeaders,
              { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
            ],
      },
    ];
  },
};

export default nextConfig;

// Gives `next dev` the Cloudflare bindings from wrangler.jsonc.
initOpenNextCloudflareForDev();
