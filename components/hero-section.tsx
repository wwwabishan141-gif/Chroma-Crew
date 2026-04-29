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
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 py-12 md:py-20 overflow-hidden bg-black">
      {/* --- Unique Background Elements --- */}
      
      {/* 1. Aurora Glows (Filling the empty space) */}
      <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-red-600/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full animate-pulse delay-700 pointer-events-none" />
      
      {/* 2. Abstract Mesh Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* 3. Floating Design Marks */}
      <div className="absolute top-[20%] left-[10%] w-32 h-32 border border-red-600/10 rounded-full flex items-center justify-center animate-bounce-slow pointer-events-none">
        <div className="w-1 h-1 bg-red-600/30 rounded-full" />
      </div>
      <div className="absolute bottom-[20%] right-[10%] w-48 h-48 border border-white/5 rounded-full flex items-center justify-center animate-spin-slow pointer-events-none">
        <div className="w-2 h-2 bg-white/10 rounded-full" />
      </div>

      {/* 4. Large Subtle Wordmark Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none opacity-[0.02] transform scale-150">
        <span className="text-[20vw] font-black italic text-white uppercase tracking-tighter">CHROMA</span>
      </div>

      {/* Existing Background subtle pattern */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M100 100 Q 200 50, 300 150 T 500 100" stroke="rgba(220,38,38,0.3)" strokeWidth="1" strokeDasharray="5,5" className="animate-pulse" />
        <path d="M700 80 Q 800 150, 900 100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="5,5" className="animate-pulse" />
        <circle cx="900" cy="450" r="200" stroke="rgba(220,38,38,0.15)" strokeWidth="1" />
        <circle cx="100" cy="500" r="150" stroke="rgba(220,38,38,0.1)" strokeWidth="1" />
      </svg>

      <div
        className={`relative z-10 text-center transition-all duration-1000 max-w-5xl mx-auto -mt-10 md:-mt-20 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        {/* Logo wordmark */}
        <div className="mb-4">
          <Image
            src="/images/chromacrew-logo- expresion.png"
            alt="ChromaCrew"
            width={1024}
            height={207}
            className="w-full max-w-[300px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] h-auto mx-auto"
            priority
            unoptimized
          />
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mt-12">
          <Link
            href="/shop"
            className="group relative w-full sm:w-auto px-10 py-3.5 md:px-12 md:py-4 bg-red-600 text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/40 hover:scale-105 text-base md:text-lg"
          >
            <span className="relative z-10">Shop Now</span>
          </Link>
          <Link
            href="/custom-design"
            className="group w-full sm:w-auto px-10 py-3.5 md:px-12 md:py-4 border-[2px] border-red-600 text-white font-bold rounded-full transition-all duration-300 hover:bg-red-600/10 hover:shadow-lg hover:shadow-red-600/20 hover:scale-105 text-base md:text-lg"
          >
            Custom Design
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
