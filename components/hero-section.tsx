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
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 py-12 md:py-20 overflow-hidden bg-[#0a0000]">

      {/* ── Background: Flowing Red Wave Ribbons (inspired by reference) ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Deep ambient glow blobs */}
        <ellipse cx="200" cy="700" rx="500" ry="300" fill="rgba(120,10,10,0.18)" />
        <ellipse cx="1300" cy="200" rx="400" ry="250" fill="rgba(100,5,5,0.14)" />
        <ellipse cx="720" cy="450" rx="600" ry="350" fill="rgba(80,0,0,0.10)" />

        {/* Flowing ribbon waves — bottom-left origin */}
        <path d="M-100 900 C 100 700, 300 600, 500 750 S 800 900, 1000 700 S 1200 500, 1600 600" stroke="rgba(180,20,20,0.35)" strokeWidth="2" fill="none"/>
        <path d="M-100 850 C 150 650, 350 550, 550 700 S 850 850, 1050 650 S 1250 450, 1600 550" stroke="rgba(200,30,30,0.25)" strokeWidth="1.5" fill="none"/>
        <path d="M-100 800 C 200 580, 400 480, 600 640 S 900 800, 1100 580 S 1300 380, 1600 480" stroke="rgba(160,15,15,0.20)" strokeWidth="1" fill="none"/>

        {/* Upper waves */}
        <path d="M-100 300 C 200 150, 500 250, 700 100 S 1000 -50, 1300 150 S 1500 300, 1600 200" stroke="rgba(180,20,20,0.30)" strokeWidth="2" fill="none"/>
        <path d="M-100 350 C 200 200, 500 300, 700 150 S 1000 0, 1300 200 S 1500 350, 1600 250" stroke="rgba(200,30,30,0.18)" strokeWidth="1.5" fill="none"/>
        <path d="M-100 400 C 250 250, 550 350, 750 200 S 1050 50, 1350 250 S 1550 400, 1600 300" stroke="rgba(150,10,10,0.15)" strokeWidth="1" fill="none"/>

        {/* Diagonal cross ribbons */}
        <path d="M0 0 C 300 200, 600 600, 900 900" stroke="rgba(140,10,10,0.12)" strokeWidth="60" fill="none" strokeLinecap="round"/>
        <path d="M200 0 C 500 200, 800 600, 1100 900" stroke="rgba(120,8,8,0.08)" strokeWidth="80" fill="none" strokeLinecap="round"/>
        <path d="M1440 0 C 1100 200, 800 600, 500 900" stroke="rgba(140,10,10,0.10)" strokeWidth="50" fill="none" strokeLinecap="round"/>

        {/* Fine contour lines (fabric-texture feel) */}
        {[...Array(12)].map((_, i) => (
          <path
            key={i}
            d={`M-200 ${650 - i * 55} C 300 ${500 - i * 40}, 700 ${800 - i * 60}, 1100 ${550 - i * 45} S 1400 ${350 - i * 35}, 1700 ${500 - i * 50}`}
            stroke={`rgba(180,15,15,${0.06 - i * 0.003})`}
            strokeWidth="1"
            fill="none"
          />
        ))}
      </svg>

      {/* ── Subtle mesh grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "55px 55px",
        }}
      />

      {/* ── Vignette edges ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)"
      }} />

      {/* ── Center Content ── */}
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

        {/* "PREMIUM DTF PRINTS" divider — matching first image reference */}
        <div className="flex items-center gap-3 justify-center my-6">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent via-red-700 to-red-600" />
          <span
            className="text-red-500 text-[10px] font-black uppercase tracking-[0.45em]"
            style={{ letterSpacing: "0.45em" }}
          >
            Premium DTF Prints
          </span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent via-red-700 to-red-600" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mt-8">
          <Link
            href="/shop"
            className="group relative w-full sm:w-auto px-10 py-3.5 md:px-12 md:py-4 bg-red-600 text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/40 hover:scale-105 text-base md:text-lg"
          >
            <span className="relative z-10">Shop Now</span>
            {/* shimmer */}
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

      {/* Bottom fade into site background */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
