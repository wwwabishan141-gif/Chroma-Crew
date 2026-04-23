"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const CONSENT_KEY = "chromacrew_cookie_consent"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted")
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-slideUp"
      style={{ animation: "slideUp 0.5s ease-out" }}
    >
      <div className="max-w-4xl mx-auto rounded-2xl border border-white/15 bg-[#111]/95 backdrop-blur-xl shadow-2xl p-5 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Icon */}
          <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-red-400">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-white text-sm font-semibold mb-1">We value your privacy 🍪</p>
            <p className="text-white/60 text-xs leading-relaxed">
              We use cookies and localStorage to improve your shopping experience, save your cart, and understand how you use our site. 
              Read our{" "}
              <Link href="/privacy" className="text-red-400 hover:underline">
                Privacy Policy
              </Link>{" "}
              for more details.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={decline}
              className="px-4 py-2 text-xs font-medium text-white/60 hover:text-white border border-white/15 rounded-xl hover:bg-white/5 transition-all"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all active:scale-95"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
