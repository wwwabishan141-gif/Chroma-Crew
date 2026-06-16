"use client"

import { Star, Quote } from "lucide-react"

const reviews = [
  {
    name: "Shehan K.",
    city: "Colombo",
    rating: 5,
    tag: "Verified Buyer",
    review: "Bro the cotton is actually heavy. Washed my Goku tee a few times and the print hasn't cracked at all. Fit is exactly what I wanted.",
    product: "Son Goku Tee",
  },
  {
    name: "Ruvini D.",
    city: "Kandy",
    rating: 5,
    tag: "Verified Buyer",
    review: "Got the BMW speed tee. Boxy fit hangs perfectly, looks way more expensive than it is. Clean drop.",
    product: "Retro Speed BMW Tee",
  },
  {
    name: "Devinda W.",
    city: "Negombo",
    rating: 5,
    tag: "Verified Buyer",
    review: "Ordered COD, arrived in 2 days. The material feels crazy premium. Definitely copping again.",
    product: "Dark Knight Vibes Tee",
  },
]

export function SocialProof() {
  return (
    <section className="py-20 md:py-28 px-4 md:px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-900/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">

        {/* Section header */}
        <div className="text-center space-y-4">
          <span className="inline-block px-3 py-1 rounded-full border border-red-600/40 bg-red-600/10 text-red-400 text-[10px] font-black uppercase tracking-widest">
            STREET CRED
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-none">
            Vouched by the{" "}
            <span className="text-red-500">Crew</span>
          </h2>
          <p className="text-white/40 max-w-md mx-auto text-sm md:text-base">
            Don&apos;t take our word for it. Here&apos;s what the subculture is saying.
          </p>
        </div>

        {/* Overall rating bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-6 px-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <div className="text-center">
            <p className="text-6xl font-black text-white leading-none">5.0</p>
            <div className="flex gap-1 justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-red-500 fill-current" />
              ))}
            </div>
            <p className="text-white/35 text-xs mt-1 uppercase tracking-wider">Average Rating</p>
          </div>
          <div className="hidden sm:block w-px h-16 bg-white/10" />
          <div className="flex flex-col gap-1.5 flex-1 max-w-xs w-full">
            {[5, 4, 3].map((stars) => (
              <div key={stars} className="flex items-center gap-2 text-xs text-white/40">
                <span className="w-4 text-right">{stars}</span>
                <Star className="w-3 h-3 text-red-500 fill-current shrink-0" />
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400"
                    style={{ width: stars === 5 ? "100%" : stars === 4 ? "0%" : "0%" }}
                  />
                </div>
                <span className="w-6">{stars === 5 ? "3" : "0"}</span>
              </div>
            ))}
          </div>
          <div className="hidden sm:block w-px h-16 bg-white/10" />
          <div className="text-center">
            <p className="text-3xl font-black text-white leading-none">100%</p>
            <p className="text-white/35 text-xs mt-1 uppercase tracking-wider">Would buy again</p>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-4 hover:border-red-600/25 hover:bg-red-600/[0.02] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Quote decoration */}
              <Quote className="absolute top-4 right-5 w-8 h-8 text-white/[0.04] group-hover:text-red-600/10 transition-colors" />

              {/* Stars */}
              <div className="flex gap-1 text-red-500">
                {[...Array(r.rating)].map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-white/75 text-sm italic leading-relaxed">
                &ldquo;{r.review}&rdquo;
              </p>

              {/* Product tag */}
              <p className="text-red-500/60 text-[10px] font-bold uppercase tracking-wider">
                {r.product}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/[0.05] pt-4">
                <div>
                  <p className="font-bold text-white text-sm">{r.name}</p>
                  <p className="text-white/35 text-xs">{r.city}, LK</p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-white/40 text-[9px] uppercase tracking-wider font-semibold">
                  {r.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Gradient border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-600/20 via-red-600/10 to-transparent pointer-events-none" />
          <div className="absolute inset-[1px] rounded-3xl bg-background pointer-events-none" />

          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-400 text-[10px] font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Instagram Drop
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                JOIN THE CREW<br />ON INSTAGRAM
              </h3>
              <p className="text-white/50 text-sm max-w-sm">
                Flex your fit, tag{" "}
                <span className="text-white font-bold">@chromacrew.lk</span>{" "}
                on your IG story, and we&apos;ll DM you an exclusive{" "}
                <span className="text-red-400 font-bold">10% discount code</span> for your next pickup.
              </p>
            </div>
            <a
              href="https://instagram.com/chromacrew.lk"
              target="_blank"
              rel="noopener noreferrer"
              className="group btn-ultra-glass-red px-8 py-4 text-xs tracking-[0.18em] shrink-0"
            >
              <span className="relative z-10 flex items-center gap-2">
                Tag & Get 10% Off
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
