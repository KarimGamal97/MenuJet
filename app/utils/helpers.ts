export const SUPPORT_WHATSAPP_NUMBER = '201132234124'
export const SUPPORT_WHATSAPP_DISPLAY = '01132234124'

/**
 * Cleans a phone number and builds a valid WhatsApp (wa.me) URL.
 */
export function buildWhatsAppUrl(
  phone: string | number | null | undefined,
  message?: string
): string {
  const digits = String(phone || '').replace(/[^0-9]/g, '')
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
  if (profile.role === 'super_admin') return false

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
 * Formats an order number with at least 2 digits (e.g. 1 -> 01, 100 -> 100).
 */
export function formatOrderNumber(num: string | number | null | undefined): string {
  return String(num ?? '').padStart(2, '0')
}
