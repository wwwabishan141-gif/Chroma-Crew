"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

const COOKIE_KEY = "chromacrew_cookie_consent"
const NEWSLETTER_DISMISS_KEY = "chromacrew_newsletter_dismissed"

export function PromoBanner() {
  const [dismissed, setDismissed] = useState<boolean | null>(null)
  const { t } = useLanguage()
  useEffect(() => {
    setDismissed(sessionStorage.getItem("promo_banner_dismissed") === "1")
  }, [])
  if (dismissed === null || dismissed) return null
  return (
    <div className="bg-red-600 text-white text-center text-sm py-2 px-4 relative z-[60]">
      <span>
        🇱🇰 {t("islandwide_delivery") || "Islandwide Delivery"} · 💵 {t("cod_available") || "Cash on Delivery Available"} · DTF files: PNG 300 DPI transparent ·{" "}
        <a href="/faq" className="underline font-medium">
          {t("learn_more") || "Learn more"}
        </a>
      </span>
      <button
        type="button"
        aria-label="Dismiss promo"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded"
        onClick={() => {
          sessionStorage.setItem("promo_banner_dismissed", "1")
          setDismissed(true)
        }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()
  useEffect(() => {
    if (typeof window === "undefined") return
    setVisible(localStorage.getItem(COOKIE_KEY) !== "accepted")
  }, [])
  if (!visible) return null
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] p-4 md:p-6">
      <div className="max-w-3xl mx-auto rounded-xl border border-white/20 bg-background/95 backdrop-blur shadow-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-white/80 text-sm flex-1">
          {t("cookie_consent_text") || "We use cookies to improve your experience, remember cart items, and analyze traffic. By continuing you agree to our"}{" "}
          <a href="/privacy" className="text-red-500 underline">
            {t("privacy_policy") || "Privacy Policy"}
          </a>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-white/30 text-sm text-white hover:bg-white/10"
            onClick={() => {
              localStorage.setItem(COOKIE_KEY, "declined")
              setVisible(false)
            }}
          >
            {t("decline") || "Decline"}
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700"
            onClick={() => {
              localStorage.setItem(COOKIE_KEY, "accepted")
              setVisible(false)
            }}
          >
            {t("accept") || "Accept"}
          </button>
        </div>
      </div>
    </div>
  )
}

export function NewsletterPopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    if (typeof window === "undefined") return
    if (localStorage.getItem(NEWSLETTER_DISMISS_KEY)) return
    const t = setTimeout(() => setOpen(true), 8000)
    return () => clearTimeout(t)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          type="button"
          className="absolute top-3 right-3 text-white/60 hover:text-white"
          aria-label="Close"
          onClick={() => {
            localStorage.setItem(NEWSLETTER_DISMISS_KEY, "1")
            setOpen(false)
          }}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white mb-2">{t("newsletter_popup_title") || "Get DTF tips & offers"}</h2>
        <p className="text-white/65 text-sm mb-4">{t("newsletter_popup_desc") || "File prep guides, seasonal promos, and wholesale news."}</p>
        {submitted ? (
          <p className="text-green-400 text-sm">{t("newsletter_subscribed") || "Thanks! You're on the list."}</p>
        ) : (
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              if (!email.trim()) return
              setSubmitted(true)
              localStorage.setItem(NEWSLETTER_DISMISS_KEY, "1")
              setTimeout(() => setOpen(false), 2000)
            }}
          >
            <input
              type="email"
              required
              placeholder={t("your_email") || "Your email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder:text-white/40"
            />
            <button type="submit" className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 font-medium text-white">
              {t("subscribe") || "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
