"use client"

import { Star } from "lucide-react"

const reviews = [
  {
    name: "Shehan K.",
    city: "Colombo",
    rating: 5,
    tag: "Verified Buyer",
    review: "The cotton is seriously heavy. I washed the Goku tee like 5 times now and the print still looks brand new. Best fit in Sri Lanka hands down.",
  },
  {
    name: "Ruvini D.",
    city: "Kandy",
    rating: 5,
    tag: "Verified Buyer",
    review: "Love the boxy fit. It actually hangs perfectly like high-end streetwear. The detail on the Retro Speed BMW graphic is insane.",
  },
  {
    name: "Devinda W.",
    city: "Negombo",
    rating: 5,
    tag: "Verified Buyer",
    review: "COD was super fast. Ordered from Negombo and got it in 2 days. The heavy fabric feels premium and cozy. Definitely copping the next drop.",
  },
]

export function SocialProof() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="inline-block px-3 py-1 rounded-full border border-red-600/40 bg-red-600/10 text-red-400 text-[10px] font-black uppercase tracking-widest">
            STREET CRED
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-wide uppercase">Vouched by the Crew</h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm md:text-base">
            Don&apos;t take our word for it. Here is what the subculture is saying about our heavy cotton and graphics.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 space-y-4 hover:border-white/20 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Star rating */}
              <div className="flex gap-1 text-red-500">
                {[...Array(r.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-current" />
                ))}
              </div>
              
              <p className="text-white/80 text-sm italic leading-relaxed">
                &ldquo;{r.review}&rdquo;
              </p>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs">
                <div>
                  <p className="font-bold text-white">{r.name}</p>
                  <p className="text-white/40">{r.city}, LK</p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/50 text-[10px]">
                  {r.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* UGC Call to Action */}
        <div className="rounded-3xl border border-red-600/20 bg-gradient-to-r from-red-600/5 to-transparent p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">JOIN THE CREW ON INSTAGRAM</h3>
            <p className="text-white/60 text-sm max-w-xl">
              Flex your fit, tag <span className="text-white font-bold">@chromacrew.lk</span> on your IG story, and we&apos;ll DM you an exclusive 10% discount code for your next pickup.
            </p>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest transition-colors shrink-0"
          >
            Tag & Get 10% Off
          </a>
        </div>
      </div>
    </section>
  )
}
