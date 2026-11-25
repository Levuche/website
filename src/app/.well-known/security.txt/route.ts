import { contact } from '@/lib/contact';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * /.well-known/security.txt (RFC 9116). Published only once
 * NEXT_PUBLIC_SECURITY_EMAIL holds a levuche.com address; until then the
 * path answers 404 rather than serving a placeholder contact.
 */
export function GET() {
  if (!contact.security) {
    return new Response('Not found\n', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  const expires = new Date();
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);
  const body = [
    `Contact: mailto:${contact.security}`,
    `Expires: ${expires.toISOString()}`,
    'Preferred-Languages: en',
    `Canonical: ${absoluteUrl('/.well-known/security.txt')}`,
    `Policy: ${absoluteUrl('/security')}`,
    '',
  ].join('\n');
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
