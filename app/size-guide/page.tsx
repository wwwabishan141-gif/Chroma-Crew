import { Header } from "@/components/header"
import Link from "next/link"

export default function SizeGuidePage() {
  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header currentPage="size-guide" />
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 space-y-10">
        <div>
          <h1 className="text-4xl font-bold mb-3">DTF size guide</h1>
          <p className="text-white/65">
            Film sizes, how to measure garments, and baseline press settings. Always confirm with your film manufacturer.
          </p>
        </div>

        <section className="space-y-4" id="sizes">
          <h2 className="text-2xl font-semibold text-red-500">Print sizes</h2>
          <ul className="list-disc pl-5 text-white/75 space-y-2">
            <li>
              <strong className="text-white">A4 (~210 × 297 mm)</strong> — standard chest prints, youth and most adult tees.
            </li>
            <li>
              <strong className="text-white">A3 (~297 × 420 mm)</strong> — oversized fronts, back prints, hoodies.
            </li>
            <li>
              <strong className="text-white">Custom gang sheets</strong> — multiple logos per sheet; priced per wholesale tier (
              <Link href="/wholesale" className="text-red-400 underline">
                see bulk pricing
              </Link>
              ).
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-red-500">Product Fit</h2>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <p className="text-white font-bold">Standard Regular Fit</p>
            <p className="text-white/70 text-sm leading-relaxed">
              All our current T-shirt designs are printed on <span className="text-white font-medium italic underline decoration-red-500/50">Regular Fit</span> garments. This provides a classic, comfortable look that is true to size.
            </p>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-600/10 border border-red-600/20">
              <span className="text-red-500 font-bold">Note:</span>
              <p className="text-white/60 text-xs italic">
                We do <span className="text-white font-medium">not</span> offer Baggy or Oversized fits at this moment. We are working on adding these options in the future—stay tuned!
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-red-500">How to measure garments</h2>
          <ol className="list-decimal pl-5 text-white/75 space-y-2">
            <li>Lay the shirt flat on a table; smooth out wrinkles.</li>
            <li>
              <strong className="text-white">Chest:</strong> measure 2.5 cm below the underarm, seam to seam.
            </li>
            <li>
              <strong className="text-white">Length:</strong> top of shoulder (high point) to bottom hem.
            </li>
            <li>Compare to our size chart at checkout; when in doubt, size up for shrinkage on 100% cotton.</li>
          </ol>
        </section>

        <section className="space-y-4" id="press">
          <h2 className="text-2xl font-semibold text-red-500">Application tips</h2>
          <div className="rounded-xl border border-white/15 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/10 text-white">
                <tr>
                  <th className="p-3">Setting</th>
                  <th className="p-3">Typical range</th>
                </tr>
              </thead>
              <tbody className="text-white/75">
                <tr className="border-t border-white/10">
                  <td className="p-3 font-medium text-white">Temperature</td>
                  <td className="p-3">300–320°F (150–160°C)</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-3 font-medium text-white">Pressure</td>
                  <td className="p-3">Medium–firm; even across platen</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-3 font-medium text-white">Peel</td>
                  <td className="p-3">Cold peel vs hot peel — follow your film batch instructions</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-3 font-medium text-white">Finish press</td>
                  <td className="p-3">3–5 s with cover sheet to set ink</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-white/50 text-sm">
          Questions? Read the{" "}
          <Link href="/faq" className="text-red-400 underline">
            FAQ
          </Link>{" "}
          or open chat — we can recommend A4 vs A3 from your file dimensions.
        </p>
      </div>
    </main>
  )
}
