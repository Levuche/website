import { contact } from '@/lib/contact';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * /.well-known/security.txt (RFC 9116). The contact is hello@levuche.com
 * unless NEXT_PUBLIC_SECURITY_EMAIL names another levuche.com address.
 */
export function GET() {
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
