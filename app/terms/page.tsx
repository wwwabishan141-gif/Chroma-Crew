import { Header } from "@/components/header"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header currentPage="terms" />
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 space-y-6 text-white/75 leading-relaxed">
        <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
        <p>Last updated: April 14, 2026</p>
        <p>
          These terms apply to your use of the ChromaCrew website and the purchase of our products. By accessing our site, you agree to these terms.
        </p>
        <h2 className="text-xl font-semibold text-white pt-4">Orders & payment</h2>
        <p>
          Placing an order confirms your agreement to purchase the products. All payments and taxes are securely processed according to local regulations.
        </p>
        <h2 className="text-xl font-semibold text-white pt-4">Artwork & IP</h2>
        <p>
          You warrant you have rights to upload designs. We reserve the right to refuse jobs that infringe third-party intellectual property rights.
        </p>
        <h2 className="text-xl font-semibold text-white pt-4">Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, ChromaCrew is not liable for indirect damages arising from the use of our website or products.
        </p>
      </div>
    </main>
  )
}
