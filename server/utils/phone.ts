export function normalizePhoneDigits(raw: string): string {
  return String(raw || "").replace(/\D/g, "");
}

export function canonicalPhoneDigits(raw: string): string {
  const digits = normalizePhoneDigits(raw);
  // Treat +2010xxxxxxxx / 2010xxxxxxxx and 010xxxxxxxx identically
  if (digits.startsWith("20") && digits.length === 12) {
    return digits.slice(1);
  }
  return digits;
}

export function phonesMatch(
  a: string | null | undefined,
  b: string | null | undefined,
): boolean {
  if (!a || !b) return false;
  const ca = canonicalPhoneDigits(a);
  const cb = canonicalPhoneDigits(b);
  return Boolean(ca && cb && ca === cb);
}

export function buildTechnicalPhoneEmail(rawPhone: string): string {
  const digits = canonicalPhoneDigits(rawPhone);
  return `phone.${digits}@phone.menujet.app`;
}

export function isValidPhoneInput(raw: string): boolean {
  const cleaned = String(raw || "").replace(/[\s()-]/g, "");
  return /^\+?\d{10,15}$/.test(cleaned);
}

export function getPhoneSuffixPattern(raw: string): string {
  const digits = canonicalPhoneDigits(raw);
  return digits.slice(-9);
}
