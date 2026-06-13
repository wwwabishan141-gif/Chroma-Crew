"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-12 md:py-20 overflow-hidden">
      {/* Background subtle pattern — original design */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M100 100 Q 200 50, 300 150 T 500 100" stroke="white" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
        <path d="M700 80 Q 800 150, 900 100" stroke="white" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
        <circle cx="900" cy="450" r="200" stroke="rgba(220,38,38,0.15)" strokeWidth="1" />
        <circle cx="100" cy="500" r="150" stroke="rgba(220,38,38,0.1)" strokeWidth="1" />
      </svg>

      <div
        className={`text-center transition duration-1000 max-w-5xl mx-auto -mt-10 md:-mt-20 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Logo wordmark */}
        <div className="mb-4">
          <Image
            src="/images/chromacrew-logo- expresion.png"
            alt="ChromaCrew"
            width={1024}
            height={207}
            sizes="(max-width: 640px) 300px, (max-width: 1024px) 500px, 700px"
            className="w-full max-w-[300px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] h-auto mx-auto"
            priority
          />
        </div>

        {/* ── Streetwear Tagline divider ── */}
        <div className="flex items-center gap-3 justify-center mt-2 mb-6">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-red-600" />
          <span className="text-red-500 text-[11px] font-black uppercase tracking-[0.4em]">
            RAW SUB-CULTURE • HEAVY COTTON
          </span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-red-600" />
        </div>

        {/* Brand Subheadline — 3 second value proposition */}
        <p className="text-white/80 max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-medium leading-relaxed mb-10 px-4">
          Premium heavyweight graphic t-shirts inspired by anime, gaming, and car culture. Colombo designed. Shipped islandwide with Cash on Delivery.
        </p>

        {/* CTA buttons — street-aligned style */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4">
          <Link
            href="/shop"
            className="group relative w-full sm:w-auto px-10 py-4 bg-red-600 text-white font-black rounded-full overflow-hidden transition-all duration-300 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/40 hover:scale-105 text-base md:text-lg tracking-wider"
          >
            <span className="relative z-10">COP THE DROP</span>
          </Link>
          <Link
            href="/custom-design"
            className="group w-full sm:w-auto px-10 py-4 border-[2px] border-red-600 text-white font-bold rounded-full transition-all duration-300 hover:bg-red-600/10 hover:shadow-lg hover:shadow-red-600/20 hover:scale-105 text-base md:text-lg tracking-wider"
          >
            CUSTOM REQUESTS
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
