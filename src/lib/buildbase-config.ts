/**
 * Public Buildbase settings, read by both the server and the browser. All of
 * them are safe to expose (NEXT_PUBLIC_*); the client secret and the org API
 * token are server-only and are read where they are used.
 *
 * Every Buildbase feature on the site switches itself off while its settings
 * are missing, so a build or a preview with no .env.local still works.
 */
export const buildbase = {
  serverUrl:
    process.env.NEXT_PUBLIC_BUILDBASE_SERVER_URL?.trim() ||
    'https://api.console.buildbase.app',
  orgId: process.env.NEXT_PUBLIC_BUILDBASE_ORG_ID?.trim() ?? '',
  /** A development environment's key; unset means production. */
  environment:
    process.env.NEXT_PUBLIC_BUILDBASE_ENVIRONMENT?.trim() || undefined,
  clientId: process.env.NEXT_PUBLIC_BUILDBASE_CLIENT_ID?.trim() ?? '',
  redirectUrl: process.env.NEXT_PUBLIC_BUILDBASE_REDIRECT_URL?.trim() ?? '',
  /** BuildBase web analytics: off unless set to "on". */
  analytics: process.env.NEXT_PUBLIC_BUILDBASE_ANALYTICS === 'on',
};

/** Sign-in and the beta form need the org and its sign-in client. */
export const isAuthConfigured = Boolean(
  /^[0-9a-f]{24}$/i.test(buildbase.orgId) &&
  buildbase.clientId &&
  buildbase.redirectUrl
);
