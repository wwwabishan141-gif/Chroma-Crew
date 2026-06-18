"use client"

import { Instagram, Send } from "lucide-react"

const feedItems = [
  {
    category: "STREET STYLE",
    title: "@colombo_fits rocking the Cars 2 Edition",
    bgClass: "bg-gradient-to-br from-zinc-800 to-zinc-900",
    ratio: "Aspect-square",
    icon: "🔥",
  },
  {
    category: "PRINT RESOLUTION",
    title: "Close-up pigment detail of our Son Goku drop",
    bgClass: "bg-gradient-to-tr from-neutral-900 to-zinc-800",
    ratio: "Aspect-square",
    icon: "🔬",
  },
  {
    category: "CULTURE UNBOXED",
    title: "Unboxing Drop 01: Matte-black heavy mailers",
    bgClass: "bg-gradient-to-br from-zinc-900 via-neutral-950 to-zinc-900",
    ratio: "Aspect-square",
    icon: "📦",
  },
  {
    category: "GAMING CULTURE",
    title: "Setup check featuring our Game Controller tee",
    bgClass: "bg-gradient-to-bl from-zinc-800 via-zinc-900 to-zinc-950",
    ratio: "Aspect-square",
    icon: "🎮",
  },
]

export function InstagramTikTokSection() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-6 bg-white/[0.01]">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full border border-white/40 bg-white/10 text-neutral-300 text-[10px] font-black uppercase tracking-widest mb-3">
              On the Radar
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-wide uppercase">Lookbook & Culture</h2>
            <p className="text-white/50 text-sm md:text-base mt-1">Our feed is a mood board of our subcultures. Check the aesthetic.</p>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-white hover:bg-white/5 transition-colors uppercase tracking-wider"
          >
            <Instagram className="w-4 h-4 text-white" /> Follow @orbyt.lk
          </a>
        </div>

        {/* Mock Instagram Feed Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {feedItems.map((item, idx) => (
            <div
              key={idx}
              className={`group relative ${item.bgClass} rounded-2xl p-6 border border-white/5 overflow-hidden flex flex-col justify-between aspect-square hover:border-white/40 transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Corner tech details */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 group-hover:border-white/50 transition-colors" />
              
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-white/70 tracking-widest group-hover:text-neutral-300 font-bold">
                  {item.category}
                </span>
                <span className="text-lg group-hover:scale-125 transition-transform duration-300">
                  {item.icon}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-white font-bold text-sm tracking-tight leading-snug group-hover:text-white transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-mono uppercase tracking-wider group-hover:text-white/60 transition-colors">
                  <span>View Story</span>
                  <Send className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Overlay styling elements */}
              <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
