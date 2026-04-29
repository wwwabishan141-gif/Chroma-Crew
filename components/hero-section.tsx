"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

// Neon T-shirt wireframe drawn with SVG paths
function NeonTshirtFrame({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main body */}
      <path
        d="M55 40 L20 70 L40 80 L40 220 L160 220 L160 80 L180 70 L145 40 C140 55 125 65 100 65 C75 65 60 55 55 40 Z"
        stroke="#dc2626"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
        style={{ filter: "drop-shadow(0 0 6px #dc2626) drop-shadow(0 0 12px #dc2626)" }}
      />
      {/* Left sleeve */}
      <path
        d="M55 40 L20 70 L40 80"
        stroke="#dc2626"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
        style={{ filter: "drop-shadow(0 0 6px #dc2626)" }}
      />
      {/* Right sleeve */}
      <path
        d="M145 40 L180 70 L160 80"
        stroke="#dc2626"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
        style={{ filter: "drop-shadow(0 0 6px #dc2626)" }}
      />
      {/* Collar */}
      <path
        d="M55 40 C60 55 75 65 100 65 C125 65 140 55 145 40"
        stroke="#dc2626"
        strokeWidth="1.5"
        fill="none"
        style={{ filter: "drop-shadow(0 0 8px #dc2626)" }}
      />
      {/* Scan line animation */}
      <line
        x1="40"
        y1="130"
        x2="160"
        y2="130"
        stroke="#dc2626"
        strokeWidth="0.5"
        strokeOpacity="0.5"
        style={{ animation: "scanLine 3s ease-in-out infinite" }}
      />
      {/* Corner dots */}
      <circle cx="40" cy="80" r="3" fill="#dc2626" style={{ filter: "drop-shadow(0 0 4px #dc2626)" }} />
      <circle cx="160" cy="80" r="3" fill="#dc2626" style={{ filter: "drop-shadow(0 0 4px #dc2626)" }} />
      <circle cx="40" cy="220" r="3" fill="#dc2626" style={{ filter: "drop-shadow(0 0 4px #dc2626)" }} />
      <circle cx="160" cy="220" r="3" fill="#dc2626" style={{ filter: "drop-shadow(0 0 4px #dc2626)" }} />
    </svg>
  )
}

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 py-12 md:py-20 overflow-hidden bg-black">

      {/* ── Background Layers ── */}

      {/* 1. Mesh Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(220,38,38,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.04) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* 2. Aurora Glows */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-red-700/8 blur-[140px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-red-900/8 blur-[160px] rounded-full animate-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-950/10 blur-[180px] rounded-full pointer-events-none" />

      {/* 3. Large ghosted CHROMA wordmark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="text-[22vw] font-black italic text-red-600/[0.025] uppercase tracking-tighter whitespace-nowrap"
          style={{ lineHeight: 1 }}
        >
          CHROMA
        </span>
      </div>

      {/* 4. Decorative neon corner lines */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 1440 800" fill="none">
        <path d="M0 200 Q 200 100, 400 200 T 800 200" stroke="#dc2626" strokeWidth="0.5" strokeDasharray="8 12" />
        <path d="M1440 600 Q 1200 500, 1000 600 T 600 600" stroke="#dc2626" strokeWidth="0.5" strokeDasharray="8 12" />
        <circle cx="720" cy="400" r="300" stroke="#dc2626" strokeWidth="0.3" strokeDasharray="4 20" />
      </svg>

      {/* ── Floating T-Shirt Mockups ── */}

      {/* LEFT mockup */}
      <div
        className={`absolute left-[2%] xl:left-[5%] top-1/2 -translate-y-1/2 w-[180px] md:w-[240px] xl:w-[280px] transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        {/* Neon wireframe overlay */}
        <div className="absolute -inset-3 animate-float pointer-events-none z-10">
          <NeonTshirtFrame className="w-full h-full opacity-70" />
        </div>
        {/* Actual product image */}
        <div
          className="relative w-full aspect-[4/5] animate-float overflow-hidden"
          style={{ animationDelay: "0.5s" }}
        >
          <Image
            src="/images/dtf-001-front.png"
            alt="Featured T-Shirt"
            fill
            sizes="280px"
            className="object-cover"
            priority
          />
          {/* Neon glow border */}
          <div className="absolute inset-0 border border-red-600/40 shadow-[inset_0_0_20px_rgba(220,38,38,0.15)]" />
        </div>
        {/* Floating label */}
        <div className="mt-3 text-center">
          <span className="text-[10px] text-red-500 font-bold uppercase tracking-[0.3em]">DTF-001</span>
        </div>
      </div>

      {/* RIGHT mockup */}
      <div
        className={`absolute right-[2%] xl:right-[5%] top-1/2 -translate-y-1/2 w-[180px] md:w-[240px] xl:w-[280px] transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
        }`}
        style={{ transitionDelay: "400ms" }}
      >
        {/* Neon wireframe overlay */}
        <div className="absolute -inset-3 animate-float pointer-events-none z-10" style={{ animationDelay: "1s" }}>
          <NeonTshirtFrame className="w-full h-full opacity-70" />
        </div>
        {/* Actual product image */}
        <div
          className="relative w-full aspect-[4/5] animate-float overflow-hidden"
          style={{ animationDelay: "1.2s" }}
        >
          <Image
            src="/images/dtf-004-front.png"
            alt="Featured T-Shirt"
            fill
            sizes="280px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 border border-red-600/40 shadow-[inset_0_0_20px_rgba(220,38,38,0.15)]" />
        </div>
        {/* Floating label */}
        <div className="mt-3 text-center">
          <span className="text-[10px] text-red-500 font-bold uppercase tracking-[0.3em]">DTF-004</span>
        </div>
      </div>

      {/* ── Center Content ── */}
      <div
        className={`relative z-10 text-center transition-all duration-1000 max-w-3xl mx-auto ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Logo wordmark */}
        <div className="mb-6">
          <Image
            src="/images/chromacrew-logo- expresion.png"
            alt="ChromaCrew — Elegance for Every Expression"
            width={1024}
            height={207}
            sizes="(max-width: 640px) 300px, (max-width: 1024px) 500px, 700px"
            className="w-full max-w-[280px] sm:max-w-[450px] md:max-w-[620px] h-auto mx-auto"
            priority
          />
        </div>

        {/* Neon divider line */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-600" />
          <span className="text-red-500/70 text-[10px] font-bold uppercase tracking-[0.4em]">Premium DTF Prints</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-600" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
          <Link
            href="/shop"
            className="group relative w-full sm:w-auto px-10 py-3.5 md:px-12 md:py-4 bg-red-600 text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/40 hover:scale-105 text-base md:text-lg"
          >
            <span className="relative z-10">Shop Now</span>
            {/* Shimmer effect */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          </Link>
          <Link
            href="/custom-design"
            className="group w-full sm:w-auto px-10 py-3.5 md:px-12 md:py-4 border-[2px] border-red-600 text-white font-bold rounded-full transition-all duration-300 hover:bg-red-600/10 hover:shadow-lg hover:shadow-red-600/20 hover:scale-105 text-base md:text-lg"
          >
            Custom Design
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="mt-14 flex flex-col items-center gap-2 animate-bounce-slow">
          <span className="text-[10px] text-white/30 uppercase tracking-widest">Scroll to explore</span>
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-red-600/50" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
