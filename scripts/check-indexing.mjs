// Checks what search engines see on a running copy of the site.
//
//   node scripts/check-indexing.mjs <base URL> <production|private>
//
// production: levuche.com is open to search engines. robots.txt allows
// crawling and names the sitemap, the sitemap lists levuche.com pages, and
// pages say index with canonical links on levuche.com.
//
// private: the dev site and preview links. robots.txt disallows everything
// and names no sitemap, /sitemap.xml is 404, and every page and file sends
// noindex (header and meta tag). A redirect to Cloudflare Access sign-in
// also passes, since then nobody outside the team sees anything at all.
//
// Behind Cloudflare Access, set CF_ACCESS_CLIENT_ID and
// CF_ACCESS_CLIENT_SECRET (an Access service token) to check the pages
// themselves. With CHECK_ASSET_HEADERS=1 it also checks the generated
// public/_headers file (local builds).

import { existsSync, readFileSync } from 'node:fs';

const [base, mode] = process.argv.slice(2);
if (!base || !['production', 'private'].includes(mode)) {
  console.error(
    'Usage: node scripts/check-indexing.mjs <base URL> <production|private>'
  );
  process.exit(2);
}
const baseUrl = base.replace(/\/+$/, '');
const isPrivate = mode === 'private';

const headers = { 'user-agent': 'levuche-indexing-check' };
const { CF_ACCESS_CLIENT_ID: id, CF_ACCESS_CLIENT_SECRET: secret } =
  process.env;
if (id && secret) {
  headers['CF-Access-Client-Id'] = id;
  headers['CF-Access-Client-Secret'] = secret;
}

const failures = [];
function expect(ok, message) {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${message}`);
  if (!ok) failures.push(message);
}

async function get(path) {
  const response = await fetch(baseUrl + path, { headers, redirect: 'manual' });
  return { response, body: await response.text() };
}

/** True when the response is Cloudflare Access sending people to sign in. */
function isAccessGate(response) {
  const location = response.headers.get('location') ?? '';
  return (
    [301, 302, 303, 307].includes(response.status) &&
    /cloudflareaccess\.com|\/cdn-cgi\/access\//.test(location)
  );
}

function robotsHeader(response) {
  return (response.headers.get('x-robots-tag') ?? '').toLowerCase();
}

function metaRobots(html) {
  const tag = html.match(/<meta[^>]+name="robots"[^>]*>/i)?.[0] ?? '';
  return (tag.match(/content="([^"]*)"/i)?.[1] ?? '').toLowerCase();
}

function canonical(html) {
  const tag = html.match(/<link[^>]+rel="canonical"[^>]*>/i)?.[0] ?? '';
  return tag.match(/href="([^"]*)"/i)?.[1] ?? '';
}

const home = await get('/');
if (isAccessGate(home.response)) {
  expect(isPrivate, `${baseUrl}/ is behind Cloudflare Access sign-in`);
} else {
  expect(
    home.response.status === 200,
    `/ answers 200 (got ${home.response.status})`
  );

  const robots = await get('/robots.txt');
  expect(robots.response.status === 200, '/robots.txt answers 200');
  const sitemap = await get('/sitemap.xml');

  if (isPrivate) {
    expect(
      /disallow:\s*\/\s*$/im.test(robots.body),
      'robots.txt disallows everything'
    );
    expect(!/^\s*sitemap:/im.test(robots.body), 'robots.txt names no sitemap');
    expect(
      sitemap.response.status === 404,
      `/sitemap.xml is 404 (got ${sitemap.response.status})`
    );
    for (const page of [
      '/',
      '/pricing',
      '/contact',
      '/robots.txt',
      '/favicon.svg',
    ]) {
      const { response, body } = page === '/' ? home : await get(page);
      expect(
        robotsHeader(response).includes('noindex'),
        `${page} sends X-Robots-Tag noindex`
      );
      if (page !== '/robots.txt' && page !== '/favicon.svg') {
        expect(
          metaRobots(body).includes('noindex'),
          `${page} has a noindex robots meta tag`
        );
      }
    }
  } else {
    expect(
      /allow:\s*\/\s*$/im.test(robots.body) &&
        !/disallow:\s*\/\s*$/im.test(robots.body),
      'robots.txt allows crawling'
    );
    expect(
      /^sitemap:\s*https:\/\/levuche\.com\/sitemap\.xml\s*$/im.test(
        robots.body
      ),
      'robots.txt names https://levuche.com/sitemap.xml'
    );
    expect(
      sitemap.response.status === 200 &&
        sitemap.body.includes('<loc>https://levuche.com'),
      '/sitemap.xml lists levuche.com pages'
    );
    for (const page of ['/', '/pricing']) {
      const { response, body } = page === '/' ? home : await get(page);
      expect(
        !robotsHeader(response).includes('noindex'),
        `${page} sends no noindex header`
      );
      expect(
        metaRobots(body).includes('index') &&
          !metaRobots(body).includes('noindex'),
        `${page} says index`
      );
      expect(
        canonical(body).startsWith('https://levuche.com'),
        `${page} canonical is on levuche.com`
      );
    }
  }
}

if (process.env.CHECK_ASSET_HEADERS === '1') {
  const file = new URL('../public/_headers', import.meta.url);
  if (isPrivate) {
    expect(
      existsSync(file) &&
        /X-Robots-Tag: noindex/.test(readFileSync(file, 'utf8')),
      'public/_headers sends noindex for files in public/'
    );
  } else {
    expect(!existsSync(file), 'no public/_headers on a levuche.com build');
  }
}

if (failures.length) {
  console.error(
    `\n${failures.length} check(s) failed for ${baseUrl} (${mode}).`
  );
  process.exit(1);
}
console.log(`\nAll checks passed for ${baseUrl} (${mode}).`);
