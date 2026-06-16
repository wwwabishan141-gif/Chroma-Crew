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
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 py-12 md:py-20 overflow-hidden">

      {/* ── Deep background glow blobs ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left blob */}
        <div className="absolute -left-32 top-1/4 w-[500px] h-[500px] bg-red-700/12 rounded-full blur-[140px] animate-float-slow" />
        {/* Right blob */}
        <div className="absolute -right-32 bottom-1/4 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: '2s' }} />
        {/* Centre top accent */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-20 w-[600px] h-[300px] bg-red-900/8 rounded-full blur-[100px]" />
      </div>

      {/* ── Background subtle SVG pattern ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Subtle grid dots */}
        {[...Array(10)].map((_, row) =>
          [...Array(16)].map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={col * 65 + 20}
              cy={row * 65 + 20}
              r="1"
              fill="white"
            />
          ))
        )}
        {/* Decorative arcs */}
        <path d="M100 100 Q 200 50, 300 150 T 500 100" stroke="white" strokeWidth="1" strokeDasharray="4,8" />
        <path d="M700 80 Q 800 150, 900 100" stroke="white" strokeWidth="1" strokeDasharray="4,8" />
        <circle cx="900" cy="450" r="200" stroke="rgba(220,38,38,0.2)" strokeWidth="1" />
        <circle cx="100" cy="500" r="150" stroke="rgba(220,38,38,0.15)" strokeWidth="1" />
      </svg>

      {/* ── Left T-Shirt: Luffy Anime Tee ── */}
      <div
        className={`absolute left-0 bottom-0 w-[240px] md:w-[340px] lg:w-[440px] aspect-[46/54] pointer-events-none select-none transition-opacity duration-700 ${
          isLoaded ? "opacity-100 animate-float-left" : "opacity-0"
        }`}
        style={{ transformOrigin: "bottom right", willChange: "transform, opacity" }}
      >
        <Image
          src="/Home page tee 1.png"
          alt="Luffy Anime Graphic Tee"
          fill
          sizes="(max-width: 768px) 240px, (max-width: 1024px) 340px, 440px"
          className="object-contain drop-shadow-[0_20px_50px_rgba(220,38,38,0.25)]"
          priority
        />
      </div>

      {/* ── Right T-Shirt: Pride Goes Before a Fall Tee ── */}
      <div
        className={`absolute right-0 bottom-0 w-[240px] md:w-[340px] lg:w-[440px] aspect-[46/54] pointer-events-none select-none transition-opacity duration-700 ${
          isLoaded ? "opacity-100 animate-float-right" : "opacity-0"
        }`}
        style={{ transformOrigin: "bottom left", willChange: "transform, opacity" }}
      >
        <Image
          src="/Home page tee 2.png"
          alt="Pride Goes Before a Fall Graphic Tee"
          fill
          sizes="(max-width: 768px) 240px, (max-width: 1024px) 340px, 440px"
          className="object-contain drop-shadow-[0_20px_50px_rgba(220,38,38,0.25)]"
          priority
        />
      </div>

      {/* ── Centre Content ── */}
      <div
        className={`text-center transition-all duration-700 max-w-3xl mx-auto relative z-10 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Logo wordmark */}
        <div className="mb-5">
          <Image
            src="/images/chromacrew-logo- expresion.png"
            alt="ChromaCrew"
            width={1024}
            height={207}
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 460px, 620px"
            className="w-full max-w-[260px] sm:max-w-[440px] md:max-w-[600px] h-auto mx-auto drop-shadow-[0_4px_32px_rgba(220,38,38,0.4)]"
            priority
          />
        </div>

        {/* Tagline divider */}
        <div className="flex items-center gap-3 justify-center mt-2 mb-6">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent via-red-600/60 to-red-600" />
          <span className="text-red-400 text-[10px] font-black uppercase tracking-[0.45em] px-1">
            RAW SUB-CULTURE • HEAVY COTTON
          </span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent via-red-600/60 to-red-600" />
        </div>

        {/* Subheadline */}
        <p className="text-white/65 max-w-lg mx-auto text-sm sm:text-[15px] md:text-base font-medium leading-relaxed mb-10 px-2">
          Premium heavyweight graphic t-shirts inspired by anime, gaming, and car culture.
          Colombo designed. Shipped islandwide with Cash on Delivery.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
          <Link
            href="/shop"
            className="group btn-ultra-glass-red w-full sm:w-[240px] py-4 sm:py-5 text-xs sm:text-sm"
          >
            <span className="relative z-10 flex items-center justify-center w-full gap-2 tracking-[0.18em]">
              SHOP NOW
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
          <Link
            href="/custom-design"
            className="group relative w-full sm:w-[240px] py-4 sm:py-5 text-xs sm:text-sm inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/35 text-white font-black uppercase tracking-[0.18em] transition-all duration-300 backdrop-blur-sm"
          >
            <span className="flex items-center gap-2">
              CREATE YOUR TEE
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Social proof micro-strip */}
        <div className="mt-10 flex items-center justify-center gap-4 text-white/30 text-[11px] font-semibold uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            COD Available
          </span>
          <span className="text-white/15">·</span>
          <span>Islandwide Shipping</span>
          <span className="text-white/15">·</span>
          <span>DTF Printed</span>
        </div>
      </div>

      {/* Bottom fade-out */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
