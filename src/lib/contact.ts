/**
 * Public contact addresses. Every one is hello@levuche.com unless its
 * environment variable names another. Only addresses on levuche.com are
 * accepted (rollout checklist: every public address uses @levuche.com);
 * anything else falls back to hello@levuche.com.
 */
function levucheAddress(value: string | undefined): string | null {
  const address = value?.trim().toLowerCase();
  return address && /^[a-z0-9._+-]+@levuche\.com$/.test(address)
    ? address
    : null;
}

const HELLO = 'hello@levuche.com';

export const contact = {
  general: levucheAddress(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ?? HELLO,
  privacy: levucheAddress(process.env.NEXT_PUBLIC_PRIVACY_EMAIL) ?? HELLO,
  security: levucheAddress(process.env.NEXT_PUBLIC_SECURITY_EMAIL) ?? HELLO,
};

export const contactPlaceholder = {
  address: '[Company address]',
} as const;
