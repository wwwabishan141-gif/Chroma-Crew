"use client"

export function BrandStory() {
  return (
    <section className="py-20 px-4 md:px-6 bg-black relative overflow-hidden">
      {/* Abstract industrial grid lines in background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Subtle glowing red accent in background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        <span className="inline-block px-3 py-1 rounded-full border border-red-600/40 bg-red-600/10 text-red-400 text-[10px] font-black uppercase tracking-[0.2em]">
          MANIFESTO // DROP 01
        </span>
        
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-none">
          WE WEAR WHAT WE <span className="text-red-500 underline decoration-2 underline-offset-8">OBSESS</span>
        </h2>
        
        <div className="max-w-2xl mx-auto space-y-6 text-white/70 text-base md:text-lg leading-relaxed font-medium">
          <p>
            ORBYT was born in Colombo out of frustration. Frustration with boring apparel, cheap paper-thin blanks, and prints that peel after two washes. We set out to build something better.
          </p>
          <p>
            We don&apos;t do corporate polos. We don&apos;t print uniforms. We design graphic armor for the subcultures. Whether you&apos;re a gamer pulling late-nighters, an anime head, or a car enthusiast cruising the coastline, our drops are made for you.
          </p>
          <p>
            Every single t-shirt is cut from heavy premium local cotton, tailored for that perfect slouchy drape, and printed with deep-saturated pigments built to last. No shortcuts. Just raw culture.
          </p>
        </div>

        {/* Industrial Details */}
        <div className="pt-6 flex items-center justify-center gap-6 text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <span>[ DESIGNED IN SRI LANKA ]</span>
          <span>•</span>
          <span>[ EST. 2026 ]</span>
          <span>•</span>
          <span>[ COLOMBO // 00600 ]</span>
        </div>
      </div>
    </section>
  )
}
