import Link from "next/link"

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M20.38 3.46L16 2.14a2 2 0 00-1.2 0l-4.38 1.32a2 2 0 01-1.2 0L4.82 2.14a2 2 0 00-2.4 1.2v10.33a4 4 0 002.34 3.66l6.38 2.5a2 2 0 001.7 0l6.38-2.5a4 4 0 002.34-3.66V4.82a2 2 0 00-1.18-1.36z"/>
      </svg>
    ),
    title: "Heavyweight Cotton",
    desc: "Pre-shrunk 240+ GSM local fabric built for the perfect boxy drape and long-term durability.",
    badge: "240+ GSM",
    stat: "240",
    statLabel: "GSM",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    title: "High-Fidelity Graphics",
    desc: "Vibrant pigment inks fused directly into the fabric—zero plasticky shine, no wash-out cracking.",
    badge: "FADE-RESISTANT",
    stat: "∞",
    statLabel: "Washes",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
        <path d="M6 14h2M12 14h4"/>
      </svg>
    ),
    title: "Cash on Delivery",
    desc: "Pay cash at your door. Shipped via trusted local riders with next-day dispatch in Colombo.",
    badge: "COD Available",
    stat: "COD",
    statLabel: "Islandwide",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: "Streetwear Fit Guarantee",
    desc: "Drape is everything. Hassle-free 7-day size exchange if it doesn't hang exactly how you imagined.",
    badge: "EASY RETURNS",
    stat: "7",
    statLabel: "Day Returns",
  },
]

export function PromisesSection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
      {/* Subtle bg glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-900/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full border border-red-600/40 bg-red-600/10 text-red-400 text-[10px] font-black uppercase tracking-widest mb-4">
            Built Different
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-none">
            Uncompromising<br />
            <span className="text-red-500">Quality</span> Standards
          </h2>
          <p className="text-white/45 mt-4 text-sm md:text-base max-w-md mx-auto">
            We don&apos;t build generic basics. Every drop is crafted to become your go-to fit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((p, i) => (
            <div
              key={p.title}
              className="group relative flex flex-col gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-red-600/35 hover:bg-red-600/[0.03] transition-all duration-400 hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Top-right glow accent on hover */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-red-600/0 group-hover:bg-red-600/8 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />

              {/* Stat badge — top right */}
              <div className="absolute top-4 right-4 text-right">
                <p className="text-red-500 font-black text-lg leading-none">{p.stat}</p>
                <p className="text-white/30 text-[9px] uppercase tracking-widest leading-none mt-0.5">{p.statLabel}</p>
              </div>

              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 group-hover:bg-red-600/20 group-hover:scale-110 transition-all duration-300 shrink-0">
                {p.icon}
              </div>

              <div>
                <h3 className="text-white font-bold text-base mb-2 leading-tight">{p.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{p.desc}</p>
              </div>

              {/* Bottom badge */}
              {p.badge && (
                <span className="self-start px-2 py-0.5 rounded-full bg-red-600/15 border border-red-600/30 text-red-400 text-[9px] font-black uppercase tracking-wider mt-auto">
                  {p.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Bottom trust strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/30">
          <span>Colombo next-day delivery</span>
          <span className="hidden sm:inline text-white/10">·</span>
          <span>Limited edition graphic drops</span>
          <span className="hidden sm:inline text-white/10">·</span>
          <span>Hassle-free size exchanges</span>
          <span className="hidden sm:inline text-white/10">·</span>
          <Link href="/about" className="text-red-500/60 hover:text-red-400 transition-colors font-semibold">
            Read Our Manifesto →
          </Link>
        </div>
      </div>
    </section>
  )
}
