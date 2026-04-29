"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 py-12 md:py-20 overflow-hidden bg-black">

      {/* ══════════════════════════════════════
          BACKGROUND: Sharp Geometric Streetwear
          Diagonal slashes + diamond lattice + circuit traces
         ══════════════════════════════════════ */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Deep glow cores ── */}
        <radialGradient id="glowLeft" cx="0%" cy="100%" r="60%">
          <stop offset="0%" stopColor="#7f0000" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowRight" cx="100%" cy="0%" r="55%">
          <stop offset="0%" stopColor="#5c0000" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <rect width="1440" height="900" fill="url(#glowLeft)" />
        <rect width="1440" height="900" fill="url(#glowRight)" />

        {/* ── Large angled slash blocks (corners) ── */}
        {/* Bottom-left slash */}
        <polygon points="0,900 320,900 0,520" fill="rgba(180,0,0,0.06)" />
        <polygon points="0,900 180,900 0,680" fill="rgba(220,10,10,0.08)" />
        {/* Top-right slash */}
        <polygon points="1440,0 1120,0 1440,380" fill="rgba(180,0,0,0.06)" />
        <polygon points="1440,0 1260,0 1440,220" fill="rgba(220,10,10,0.08)" />

        {/* ── Diagonal red slash lines ── */}
        {/* Bottom-left to upper zone */}
        <line x1="-50" y1="950" x2="750" y2="-50" stroke="rgba(220,38,38,0.12)" strokeWidth="80" strokeLinecap="butt" />
        <line x1="-50" y1="850" x2="650" y2="-50" stroke="rgba(200,20,20,0.08)" strokeWidth="40" strokeLinecap="butt" />
        <line x1="200" y1="950" x2="1000" y2="-50" stroke="rgba(180,10,10,0.06)" strokeWidth="30" strokeLinecap="butt" />
        {/* Top-right descending */}
        <line x1="1490" y1="-50" x2="700" y2="950" stroke="rgba(220,38,38,0.09)" strokeWidth="60" strokeLinecap="butt" />
        <line x1="1490" y1="150" x2="900" y2="950" stroke="rgba(200,20,20,0.06)" strokeWidth="35" strokeLinecap="butt" />

        {/* ── Sharp red outline lines (neon streaks) ── */}
        <line x1="0" y1="600" x2="400" y2="200" stroke="rgba(220,38,38,0.35)" strokeWidth="1" />
        <line x1="0" y1="650" x2="420" y2="230" stroke="rgba(220,38,38,0.15)" strokeWidth="0.5" />
        <line x1="1440" y1="300" x2="1040" y2="700" stroke="rgba(220,38,38,0.35)" strokeWidth="1" />
        <line x1="1440" y1="250" x2="1010" y2="680" stroke="rgba(220,38,38,0.15)" strokeWidth="0.5" />

        {/* ── Diamond lattice (centre zone) ── */}
        {[...Array(7)].map((_, col) =>
          [...Array(5)].map((_, row) => {
            const cx = 420 + col * 90
            const cy = 250 + row * 90
            const size = 18
            return (
              <polygon
                key={`d-${col}-${row}`}
                points={`${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`}
                stroke="rgba(220,38,38,0.18)"
                strokeWidth="0.8"
                fill="none"
              />
            )
          })
        )}
        {/* Larger accent diamonds */}
        <polygon points="160,820 210,770 160,720 110,770" stroke="rgba(220,38,38,0.4)" strokeWidth="1.2" fill="rgba(220,38,38,0.04)" />
        <polygon points="1280,80 1330,30 1280,-20 1230,30" stroke="rgba(220,38,38,0.4)" strokeWidth="1.2" fill="rgba(220,38,38,0.04)" />
        <polygon points="80,200 120,160 80,120 40,160" stroke="rgba(220,38,38,0.25)" strokeWidth="1" fill="none" />
        <polygon points="1360,700 1400,660 1360,620 1320,660" stroke="rgba(220,38,38,0.25)" strokeWidth="1" fill="none" />

        {/* ── Circuit board traces (horizontal + right-angle) ── */}
        {/* Left side trace */}
        <path d="M80 500 L 180 500 L 180 420 L 320 420 L 320 380" stroke="rgba(220,38,38,0.30)" strokeWidth="1" fill="none" />
        <circle cx="80" cy="500" r="3" fill="rgba(220,38,38,0.5)" />
        <circle cx="320" cy="380" r="3" fill="rgba(220,38,38,0.5)" />
        <circle cx="180" cy="500" r="2" fill="rgba(220,38,38,0.3)" />
        <circle cx="180" cy="420" r="2" fill="rgba(220,38,38,0.3)" />

        {/* Right side trace */}
        <path d="M1360 400 L 1260 400 L 1260 480 L 1120 480 L 1120 520" stroke="rgba(220,38,38,0.30)" strokeWidth="1" fill="none" />
        <circle cx="1360" cy="400" r="3" fill="rgba(220,38,38,0.5)" />
        <circle cx="1120" cy="520" r="3" fill="rgba(220,38,38,0.5)" />
        <circle cx="1260" cy="400" r="2" fill="rgba(220,38,38,0.3)" />
        <circle cx="1260" cy="480" r="2" fill="rgba(220,38,38,0.3)" />

        {/* Bottom trace */}
        <path d="M400 860 L 400 800 L 500 800 L 500 840 L 700 840" stroke="rgba(220,38,38,0.20)" strokeWidth="0.8" fill="none" />
        <circle cx="400" cy="860" r="2" fill="rgba(220,38,38,0.4)" />
        <circle cx="700" cy="840" r="2" fill="rgba(220,38,38,0.4)" />

        {/* ── Halftone dot cluster (bottom-right corner) ── */}
        {[...Array(8)].map((_, row) =>
          [...Array(10)].map((_, col) => {
            const r = 1.5 - (row + col) * 0.07
            if (r <= 0.2) return null
            return (
              <circle
                key={`h-${row}-${col}`}
                cx={1200 + col * 28}
                cy={720 + row * 28}
                r={Math.max(0.3, r)}
                fill={`rgba(220,38,38,${0.25 - (row + col) * 0.012})`}
              />
            )
          })
        )}

        {/* ── Scanline overlay (horizontal micro-lines) ── */}
        {[...Array(30)].map((_, i) => (
          <line key={`sl-${i}`} x1="0" y1={i * 30} x2="1440" y2={i * 30} stroke="rgba(255,255,255,0.012)" strokeWidth="0.5" />
        ))}
      </svg>

      {/* ── Vignette ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 70% at center, transparent 30%, rgba(0,0,0,0.75) 100%)"
      }} />

      {/* ══════════════════════════════════════
          CENTER CONTENT
         ══════════════════════════════════════ */}
      <div
        className={`relative z-10 text-center transition-all duration-1000 max-w-4xl mx-auto ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Logo wordmark */}
        <div className="mb-4">
          <Image
            src="/images/chromacrew-logo- expresion.png"
            alt="ChromaCrew — Elegance for Every Expression"
            width={1024}
            height={207}
            sizes="(max-width: 640px) 300px, (max-width: 1024px) 560px, 800px"
            className="w-full max-w-[290px] sm:max-w-[480px] md:max-w-[680px] lg:max-w-[860px] h-auto mx-auto"
            priority
          />
        </div>

        {/* "PREMIUM DTF PRINTS" divider */}
        <div className="flex items-center gap-3 justify-center my-6">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-red-600" />
          <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.45em]">
            Premium DTF Prints
          </span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-red-600" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mt-8">
          <Link
            href="/shop"
            className="group relative w-full sm:w-auto px-10 py-3.5 md:px-12 md:py-4 bg-red-600 text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/40 hover:scale-105 text-base md:text-lg"
          >
            <span className="relative z-10">Shop Now</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          </Link>
          <Link
            href="/custom-design"
            className="group w-full sm:w-auto px-10 py-3.5 md:px-12 md:py-4 border-[2px] border-white text-white font-bold rounded-full transition-all duration-300 hover:bg-white/10 hover:border-red-500 hover:text-red-400 hover:scale-105 text-base md:text-lg"
          >
            Custom Design
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-2 animate-bounce-slow">
          <span className="text-[10px] text-white/25 uppercase tracking-widest">Scroll to explore</span>
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-red-600/40" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
