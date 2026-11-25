/**
 * Public contact addresses. None is chosen yet, so each one shows a visible
 * [PLACEHOLDER] until its environment variable is set at build time. Only
 * addresses on levuche.com are accepted (rollout checklist: every public
 * address uses @levuche.com); anything else is ignored.
 */
function levucheAddress(value: string | undefined): string | null {
  const address = value?.trim().toLowerCase();
  return address && /^[a-z0-9._+-]+@levuche\.com$/.test(address)
    ? address
    : null;
}

export const contact = {
  general: levucheAddress(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  privacy: levucheAddress(process.env.NEXT_PUBLIC_PRIVACY_EMAIL),
  security: levucheAddress(process.env.NEXT_PUBLIC_SECURITY_EMAIL),
};

export const contactPlaceholder = {
  general: '[CONTACT EMAIL]',
  privacy: '[PRIVACY CONTACT]',
  security: '[SECURITY CONTACT]',
  address: '[Company address]',
} as const;

/** Where "Sign in" goes. Unset: the header leaves the link out. */
export const signInUrl = process.env.NEXT_PUBLIC_SIGN_IN_URL?.trim() || null;

/** Where the beta form posts. Unset: the form says sign-ups open soon. */
export const betaFormAction =
  process.env.NEXT_PUBLIC_BETA_FORM_ACTION?.trim() || null;
