import Link from "next/link"

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M20.38 3.46L16 2.14a2 2 0 00-1.2 0l-4.38 1.32a2 2 0 01-1.2 0L4.82 2.14a2 2 0 00-2.4 1.2v10.33a4 4 0 002.34 3.66l6.38 2.5a2 2 0 001.7 0l6.38-2.5a4 4 0 002.34-3.66V4.82a2 2 0 00-1.18-1.36z"/>
      </svg>
    ),
    title: "Heavyweight Cotton",
    desc: "Sourced locally and pre-shrunk for the perfect boxy drape. Real heavyweight fabrics (240+ GSM) that stand the test of time.",
    badge: "240+ GSM",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    title: "High-Fidelity Graphics",
    desc: "Vibrant pigment inks fused directly into the fabric. Deep colors, a soft hand feel, zero plasticky shine, and no wash-out cracking.",
    badge: "FADE-RESISTANT",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
        <path d="M6 14h2M12 14h4"/>
      </svg>
    ),
    title: "Cash on Delivery",
    desc: "Pay cash at your door with absolute peace of mind. Shipped via trusted local riders with next-day dispatch in Colombo.",
    badge: "COD Available",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: "Streetwear Fit Guarantee",
    desc: "Drape is everything. If your graphic tee isn't styled exactly how you imagined, we offer a hassle-free 7-day size exchange.",
    badge: "EASY RETURNS",
  },
]

export function PromisesSection() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full border border-red-600/40 bg-red-600/10 text-red-400 text-[10px] font-black uppercase tracking-widest mb-3">
            Built Different
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-wide uppercase">Uncompromising Quality Standards</h2>
          <p className="text-white/50 mt-3 text-sm md:text-base">We don&apos;t build generic basics. Every drop is crafted to become your go-to fit.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((p) => (
            <div
              key={p.title}
              className="group relative flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-red-600/40 hover:bg-red-600/[0.04] transition-all duration-300"
            >
              {p.badge && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-red-600/20 border border-red-600/40 text-red-400 text-[9px] font-black uppercase tracking-wider">
                  {p.badge}
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 group-hover:bg-red-600/20 transition-colors">
                {p.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-base mb-1.5">{p.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust line */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/35">
          <span>Colombo next-day delivery</span>
          <span className="hidden sm:inline text-white/15">·</span>
          <span>Limited edition graphic drops</span>
          <span className="hidden sm:inline text-white/15">·</span>
          <span>Hassle-free size exchanges</span>
          <span className="hidden sm:inline text-white/15">·</span>
          <Link href="/about" className="text-red-500/60 hover:text-red-400 transition-colors font-medium">
            Read Our Manifesto →
          </Link>
        </div>
      </div>
    </section>
  )
}
