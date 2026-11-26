/**
 * Where browsers send Content-Security-Policy violations (the policy's
 * `report-uri` and `report-to`, set in next.config.ts). Each one is written to
 * the Worker's logs as one `csp-violation` line, so a tag or script the policy
 * blocks on levuche.com shows up in Cloudflare (Workers > levuche-com >
 * Observability) instead of failing quietly. On the dev site the policy is
 * report-only, so the same lines list what it would block.
 *
 * Two shapes arrive: the older `application/csp-report` ({ "csp-report": {} })
 * and the Reporting API's `application/reports+json` (a list of reports). Only
 * the directive, the blocked address's origin and the page's path are kept:
 * query strings can hold personal data. Reports from browser extensions are
 * noise and are dropped. The answer is always 204, so a bad body never shows
 * as an error in a visitor's browser.
 */

const MAX_BODY = 32 * 1024;
const MAX_REPORTS = 10;

type Violation = Record<string, unknown>;

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/** An address cut to its origin, or the CSP keyword it already is. */
function originOf(value: string): string {
  if (!value) return '';
  try {
    const url = new URL(value);
    return url.protocol.startsWith('http') ? url.origin : url.protocol;
  } catch {
    // 'inline', 'eval', 'data' and the like.
    return value.slice(0, 40);
  }
}

function pathOf(value: string): string {
  try {
    return new URL(value).pathname;
  } catch {
    return '';
  }
}

const EXTENSION = /^(chrome|moz|safari|safari-web|ms-browser)-extension:/;

/** The violations in either report shape. */
function violations(body: unknown): Violation[] {
  if (Array.isArray(body)) {
    return body
      .filter(
        (report): report is { type: string; body: Violation } =>
          typeof report === 'object' &&
          report !== null &&
          (report as { type?: unknown }).type === 'csp-violation' &&
          typeof (report as { body?: unknown }).body === 'object'
      )
      .map((report) => report.body);
  }
  if (typeof body === 'object' && body !== null && 'csp-report' in body) {
    const report = (body as { 'csp-report': unknown })['csp-report'];
    if (typeof report === 'object' && report !== null) {
      return [report as Violation];
    }
  }
  return [];
}

function summary(report: Violation) {
  const blocked = text(report.blockedURL) || text(report['blocked-uri']);
  const source = text(report.sourceFile) || text(report['source-file']);
  return {
    directive:
      text(report.effectiveDirective) ||
      text(report['effective-directive']) ||
      text(report['violated-directive']),
    blocked: originOf(blocked),
    page: pathOf(text(report.documentURL) || text(report['document-uri'])),
    source: originOf(source),
    enforced: text(report.disposition) === 'enforce',
    extension: EXTENSION.test(blocked) || EXTENSION.test(source),
  };
}

const noContent = () =>
  new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > MAX_BODY) return noContent();

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) return noContent();
    body = JSON.parse(raw);
  } catch {
    return noContent();
  }

  for (const report of violations(body).slice(0, MAX_REPORTS)) {
    const { extension, ...line } = summary(report);
    if (extension || !line.directive) continue;
    console.warn('csp-violation', JSON.stringify(line));
  }
  return noContent();
}
