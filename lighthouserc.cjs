// Lighthouse budget for pull request previews (.github/workflows/preview.yml,
// job "Lighthouse"). Fails when performance, accessibility or SEO on the
// home, pricing or blog page drops below 90.
//
// LHCI_URL is the preview link. Previews sit behind Cloudflare Access, so the
// service token (if set) goes along as headers. They also send noindex and
// block crawlers on purpose, so the two audits that check for that are
// skipped: they would fail on every preview and say nothing about the page.

const base = (process.env.LHCI_URL || 'http://localhost:3000').replace(
  /\/+$/,
  ''
);

const extraHeaders = {};
if (process.env.CF_ACCESS_CLIENT_ID && process.env.CF_ACCESS_CLIENT_SECRET) {
  extraHeaders['CF-Access-Client-Id'] = process.env.CF_ACCESS_CLIENT_ID;
  extraHeaders['CF-Access-Client-Secret'] = process.env.CF_ACCESS_CLIENT_SECRET;
}

const atLeast90 = ['error', { minScore: 0.9 }];

module.exports = {
  ci: {
    collect: {
      url: ['/', '/pricing', '/blog'].map((path) => `${base}${path}`),
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless=new',
        extraHeaders,
        skipAudits: ['is-crawlable', 'robots-txt'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': atLeast90,
        'categories:accessibility': atLeast90,
        'categories:seo': atLeast90,
      },
    },
    // Reports stay on the runner: the previews are private.
    upload: { target: 'filesystem', outputDir: '.lighthouseci/reports' },
  },
};
