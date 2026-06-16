"use client"

export function BrandStory() {
  return (
    <section className="py-24 px-4 md:px-6 bg-black relative overflow-hidden">
      {/* Industrial grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      {/* Glow blobs */}
      <div className="absolute -top-40 -left-32 w-[500px] h-[500px] bg-red-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-32 w-[400px] h-[400px] bg-red-600/6 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative large character — background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[22rem] font-black text-white/[0.012] leading-none tracking-tighter">CC</span>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        <span className="inline-block px-3 py-1 rounded-full border border-red-600/35 bg-red-600/10 text-red-400 text-[10px] font-black uppercase tracking-[0.22em]">
          MANIFESTO // DROP 01
        </span>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">
          WE WEAR WHAT<br />
          WE{" "}
          <span className="relative inline-block">
            <span className="text-red-500">OBSESS</span>
            <span className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-red-400 to-red-600 rounded-full" />
          </span>
        </h2>

        {/* Body copy */}
        <div className="max-w-2xl mx-auto space-y-5 text-white/60 text-base md:text-lg leading-relaxed font-medium">
          <p>
            Chroma Crew was born in Colombo out of frustration. Frustration with boring apparel, cheap
            paper-thin blanks, and prints that peel after two washes. We set out to build something better.
          </p>
          <p>
            We don&apos;t do corporate polos. We don&apos;t print uniforms. We design graphic armor for the subcultures.
            Whether you&apos;re a gamer pulling late-nighters, an anime head, or a car enthusiast cruising the coastline,
            our drops are made for you.
          </p>
          <p>
            Every single t-shirt is cut from heavy premium local cotton, tailored for that perfect slouchy drape,
            and printed with deep-saturated pigments built to last. No shortcuts. Just raw culture.
          </p>
        </div>

        {/* Divider line */}
        <div className="flex items-center gap-4 max-w-xs mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-red-600/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-red-600/40" />
        </div>

        {/* Industrial metadata strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-[10px] md:text-[11px] font-mono text-white/30 uppercase tracking-[0.2em]">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-red-600 rounded-full" />
            DESIGNED IN SRI LANKA
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-red-600 rounded-full" />
            EST. 2026
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-red-600 rounded-full" />
            COLOMBO // 00600
          </span>
        </div>
      </div>
    </section>
  )
}
