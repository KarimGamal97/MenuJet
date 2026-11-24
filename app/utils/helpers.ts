export const SUPPORT_WHATSAPP_NUMBER = '201132234124'
export const SUPPORT_WHATSAPP_DISPLAY = '01132234124'
export const RENEWAL_PAYMENT_PHONE = '01094123678'

export const PLAN_MONTHLY_EGP: Record<string, number> = {
  free: 0,
  basic: 250,
  pro: 500,
}

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/profile.php?id=61594028551451',
  instagram: 'https://www.instagram.com/menujet_?knvt=MTdwa2JwbDBhdXU3dA%3D%3D',
} as const

/**
 * Normalizes Arabic/Persian numerals to ASCII digits and formats phone numbers
 * for WhatsApp wa.me links (auto-prefixing Egypt country code `2` on `01xxxxxxxxx`).
 */
function normalizeWhatsAppDigits(phone: string | number | null | undefined): string {
  const ascii = String(phone || '').replace(/[٠-٩۰-۹]/g, (d) => {
    const code = d.charCodeAt(0)
    return String(code >= 0x06f0 ? code - 0x06f0 : code - 0x0660)
  })
  let digits = ascii.replace(/\D/g, '')
  if (!digits) return ''

  if (digits.startsWith('00')) {
    digits = digits.slice(2)
  }
  if (/^0201[0125]\d{8}$/.test(digits)) {
    digits = digits.slice(1)
  } else if (/^01[0125]\d{8}$/.test(digits)) {
    digits = `2${digits}`
  }

  return digits
}

/**
 * Cleans a phone number and builds a valid WhatsApp (wa.me) URL.
 */
export function buildWhatsAppUrl(
  phone: string | number | null | undefined,
  message?: string
): string {
  const digits = normalizeWhatsAppDigits(phone)
  if (!digits) return ''
  const base = `https://wa.me/${digits}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/**
 * Returns the WhatsApp support URL using the centralized support number.
 */
export function getSupportWhatsAppUrl(message?: string): string {
  return buildWhatsAppUrl(SUPPORT_WHATSAPP_NUMBER, message)
}

/**
 * Resolves the active plan ID from various profile/plan shapes.
 */
export function resolvePlanId(
  profile: Record<string, any> | null | undefined
): string {
  if (!profile) return 'free'
  return (
    profile.plan?.id ||
    profile.plans?.id ||
    profile.plan_id ||
    profile.plan_type ||
    'free'
  )
}

/**
 * Checks whether a restaurant/profile subscription has expired.
 */
export function isSubscriptionExpiredCheck(
  profile: Record<string, any> | null | undefined
): boolean {
  if (!profile) return false

  const status = String(profile.subscription_status || '').toLowerCase()
  if (status === 'expired' || status === 'inactive' || status === 'cancelled') {
    return true
  }

  const endDate =
    profile.subscription_end_date ||
    profile.subscription_ends_at ||
    profile.trial_end_date ||
    profile.trial_ends_at ||
    profile.trial_end ||
    profile.expires_at ||
    profile.end_date

  if (!endDate) return false

  let s = String(endDate).trim()
  if (s.includes(' ') && !s.includes('T')) {
    s = s.replace(' ', 'T')
  }
  s = s.replace(/([+-]\d{2})$/, '$1:00')

  const timestamp = new Date(s).getTime()
  if (isNaN(timestamp)) {
    const fallback = new Date(endDate).getTime()
    return isNaN(fallback) ? false : fallback < Date.now()
  }
  return timestamp < Date.now()
}

/**
 * Checks whether a role belongs to the platform owner.
 */
export function isPlatformOwnerRole(role?: string | null): boolean {
  return role === 'super_admin'
}

/**
 * Checks whether a role can manage a restaurant (owner or platform owner).
 */
export function canManageRestaurantRole(role?: string | null): boolean {
  return role === 'admin' || role === 'super_admin'
}

/**
 * Formats an order number with at least 2 digits (e.g. 1 -> 01, 100 -> 100).
 */
export function formatOrderNumber(num: string | number | null | undefined): string {
  return String(num ?? '').padStart(2, '0')
}
