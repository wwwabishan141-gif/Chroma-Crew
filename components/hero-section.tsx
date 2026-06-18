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
      {/* Background subtle pattern */}
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

      {/* ── Left T-Shirt: Luffy Anime Tee ── */}
      <div
        className={`absolute left-0 bottom-0 w-[260px] md:w-[360px] lg:w-[460px] aspect-[46/54] pointer-events-none select-none transition-all duration-1000 delay-200 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: isLoaded
            ? "perspective(800px) rotateY(15deg) rotate(-8deg) translateX(-20px)"
            : "perspective(800px) rotateY(15deg) rotate(-8deg) translateX(-80px)",
          transformOrigin: "bottom right",
          transition: "all 1s ease 0.2s",
          willChange: "transform, opacity"
        }}
      >
        <Image
          src="/home-page-tee-1.png"
          alt="Luffy Anime Graphic Tee"
          fill
          sizes="(max-width: 768px) 260px, (max-width: 1024px) 360px, 460px"
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>

      {/* ── Right T-Shirt: Pride Goes Before a Fall Tee ── */}
      <div
        className={`absolute right-0 bottom-0 w-[260px] md:w-[360px] lg:w-[460px] aspect-[46/54] pointer-events-none select-none transition-all duration-1000 delay-200 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: isLoaded
            ? "perspective(800px) rotateY(-15deg) rotate(8deg) translateX(20px)"
            : "perspective(800px) rotateY(-15deg) rotate(8deg) translateX(80px)",
          transformOrigin: "bottom left",
          transition: "all 1s ease 0.2s",
          willChange: "transform, opacity"
        }}
      >
        <Image
          src="/home-page-tee-2.png"
          alt="Pride Goes Before a Fall Graphic Tee"
          fill
          sizes="(max-width: 768px) 260px, (max-width: 1024px) 360px, 460px"
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>

      {/* ── Centre Content ── */}
      <div
        className={`text-center transition duration-1000 max-w-3xl mx-auto relative z-10 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Logo wordmark */}
        <div className="mb-4">
          <Image
            src="/logo1.png"
            alt="ORBYT"
            width={1024}
            height={207}
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 460px, 620px"
            className="w-full max-w-[280px] sm:max-w-[460px] md:max-w-[620px] h-auto mx-auto"
            priority
          />
        </div>

        {/* Tagline divider */}
        <div className="flex items-center gap-3 justify-center mt-2 mb-5">
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-red-600" />
          <span className="text-red-500 text-[11px] font-black uppercase tracking-[0.4em]">
            RAW SUB-CULTURE • HEAVY COTTON
          </span>
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-red-600" />
        </div>

        {/* Subheadline */}
        <p className="text-white/75 max-w-xl mx-auto text-sm sm:text-base md:text-lg font-medium leading-relaxed mb-8 px-2">
          Premium heavyweight graphic t-shirts inspired by anime, gaming, and car culture. Colombo designed. Shipped islandwide with Cash on Delivery.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 mt-8">
          <Link
            href="/shop"
            className="group btn-ultra-glass-red w-full sm:w-[260px] py-4 sm:py-5 text-xs sm:text-sm"
          >
            <span className="relative z-10 flex items-center justify-center w-full gap-2">
              SHOP NOW
            </span>
          </Link>
          <Link
            href="/custom-design"
            className="group btn-ultra-glass-red w-full sm:w-[260px] py-4 sm:py-5 text-xs sm:text-sm"
          >
            <span className="relative z-10 flex items-center justify-center w-full gap-2">
              CREATE YOUR TEE
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
