/**
 * Input validation & sanitization utilities for form data.
 * Prevents XSS, injection, and invalid data from reaching the backend.
 */

/** Strip HTML tags from a string */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "")
}

/** Sanitize a general text input */
export function sanitizeText(str: string): string {
  return stripHtml(str).trim()
}

/** Validate Sri Lankan phone number */
export function isValidPhone(phone: string): boolean {
  // Accepts: 07x xxx xxxx, +947x xxx xxxx, 947x xxx xxxx
  const cleaned = phone.replace(/[\s\-()]/g, "")
  return /^(?:\+?94|0)?7\d{8}$/.test(cleaned)
}

/** Format phone for display */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, "")
  if (cleaned.startsWith("+94")) return cleaned
  if (cleaned.startsWith("94")) return "+" + cleaned
  if (cleaned.startsWith("0")) return "+94" + cleaned.slice(1)
  return "+94" + cleaned
}

/** Validate email address */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** Validate Sri Lankan postal code */
export function isValidPostalCode(postal: string): boolean {
  return /^\d{5}$/.test(postal.trim())
}

/** Validate name (at least 2 characters, no numbers) */
export function isValidName(name: string): boolean {
  const cleaned = sanitizeText(name)
  return cleaned.length >= 2 && /^[a-zA-Z\s'.,-]+$/.test(cleaned)
}

/** Validate required fields in shipping form */
export function validateShippingForm(
  data: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    postal: string
  },
  t?: (key: any) => string
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!isValidName(data.fullName)) {
    errors.push(t ? t("err_name") : "Please enter a valid full name (letters only, at least 2 characters)")
  }

  if (!isValidEmail(data.email)) {
    errors.push(t ? t("err_email") : "Please enter a valid email address")
  }

  if (!isValidPhone(data.phone)) {
    errors.push(t ? t("err_phone") : "Please enter a valid Sri Lankan phone number (e.g., 07X XXX XXXX)")
  }

  if (sanitizeText(data.address).length < 10) {
    errors.push(t ? t("err_address") : "Please enter a complete shipping address (at least 10 characters)")
  }

  if (sanitizeText(data.city).length < 2) {
    errors.push(t ? t("err_city") : "Please enter a valid city name")
  }

  if (sanitizeText(data.state).length < 2) {
    errors.push(t ? t("err_state") : "Please enter a valid state/province")
  }

  if (!isValidPostalCode(data.postal)) {
    errors.push(t ? t("err_postal") : "Please enter a valid 5-digit postal code")
  }

  return { valid: errors.length === 0, errors }
}

/** Validate review */
export function validateReview(
  data: { rating: number; comment: string },
  t?: (key: any) => string
): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (data.rating < 1 || data.rating > 5) {
    errors.push(t ? t("err_rating") : "Rating must be between 1 and 5")
  }

  const cleaned = sanitizeText(data.comment)
  if (cleaned.length < 5) {
    errors.push(t ? t("err_review_short") : "Review must be at least 5 characters long")
  }

  if (cleaned.length > 1000) {
    errors.push(t ? t("err_review_long") : "Review must be under 1000 characters")
  }

  return { valid: errors.length === 0, errors }
}
