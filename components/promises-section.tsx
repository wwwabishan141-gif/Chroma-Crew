import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

export function PromisesSection() {
  const { t } = useLanguage()

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
          <path d="M4 16.5V20h3.5L18 9.5 14.5 6 4 16.5z"/><path d="M13 7.5L16.5 11"/>
        </svg>
      ),
      title: t("promise_custom_title") || "Custom Designs",
      desc: t("promise_custom_desc") || "Upload your own artwork or describe what you want. We print it exactly as you need it.",
      badge: null,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
          <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3z"/>
        </svg>
      ),
      title: t("promise_quality_title") || "High Quality DTF Prints",
      desc: t("promise_quality_desc") || "Vibrant colours, sharp edges, soft hand feel. Every print is checked before it leaves us.",
      badge: null,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
          <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/>
          <rect x="9" y="11" width="14" height="10" rx="1"/>
          <path d="M13 16h4"/>
        </svg>
      ),
      title: t("promise_cod_title") || "Cash on Delivery",
      desc: t("promise_cod_desc") || "Pay when your order arrives at your door. No cards, no online payments required.",
      badge: t("cod_available") || "COD Available",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      title: t("promise_delivery_title") || "Islandwide Delivery",
      desc: t("promise_delivery_desc") || "We deliver to every district in Sri Lanka. Colombo to Jaffna — we've got you covered.",
      badge: t("sri_lanka") || "🇱🇰 Sri Lanka",
    },
  ]

  return (
    <section className="py-16 md:py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">{t("why_choose") || "Why choose ChromaCrew?"}</h2>
          <p className="text-white/50 mt-3 text-sm md:text-base">{t("why_choose_desc") || "Built for Sri Lankan customers. Simple, fast, and trustworthy."}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((p) => (
            <div
              key={p.title}
              className="group relative flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-red-600/40 hover:bg-red-600/[0.04] transition-all duration-300"
            >
              {p.badge && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-red-600/20 border border-red-600/40 text-red-400 text-[10px] font-semibold">
                  {p.badge}
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 group-hover:bg-red-600/20 transition-colors">
                {p.icon}
              </div>
              <div>
                <h3 className="text-white font-semibold text-base mb-1.5">{p.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust line */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/35">
          <span>{t("no_min_order") || "No minimum order quantity"}</span>
          <span className="hidden sm:inline text-white/15">·</span>
          <span>{t("file_reviewed") || "File reviewed before printing"}</span>
          <span className="hidden sm:inline text-white/15">·</span>
          <span>{t("defective_prints") || "Defective prints? We reprint free"}</span>
          <span className="hidden sm:inline text-white/15">·</span>
          <Link href="/about" className="text-red-500/60 hover:text-red-400 transition-colors">
            {t("about_us")} →
          </Link>
        </div>
      </div>
    </section>
  )
}
