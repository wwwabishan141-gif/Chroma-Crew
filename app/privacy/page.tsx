import { Header } from "@/components/header"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header currentPage="privacy" />
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 space-y-6 text-white/75 leading-relaxed">
        <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
        <p>Last updated: April 14, 2026</p>
        <p>
          ChromaCrew (&quot;we&quot;) respects your privacy. We securely process your cart, wishlist, and order data to provide you with a seamless and premium shopping experience.
        </p>
        <h2 className="text-xl font-semibold text-white pt-4">Data we process</h2>
        <p>
          When you use checkout or our forms, the information you provide is strictly used to fulfill your orders, process your payments securely, and keep you updated on your order status. 
        </p>
        <h2 className="text-xl font-semibold text-white pt-4">Cookies</h2>
        <p>
          We use cookies to remember your preferences and ensure our website functions correctly. Your consent choices are securely saved for your convenience.
        </p>
        <h2 className="text-xl font-semibold text-white pt-4">Contact</h2>
        <p>If you have any questions regarding your privacy, please use our contact page to reach out to our support team.</p>
      </div>
    </main>
  )
}
