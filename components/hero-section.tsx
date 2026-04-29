"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

// ── T-shirt SVG path (single silhouette) ──
function TshirtIcon({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path
        d="M25 8 C25 8 35 20 50 20 C65 20 75 8 75 8 L95 22 L80 35 L80 85 L20 85 L20 35 L5 22 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

// ── 3 best products to flash ──
const bestProducts = [
  {
    id: "tee-001",
    name: "Cars 2 Edition",
    price: 1750,
    image: "/images/dtf-001-front.png",
    badge: "Best Seller",
  },
  {
    id: "tee-004",
    name: "Enjoy The Process",
    price: 1750,
    image: "/images/dtf-004-front.png",
    badge: "Trending",
  },
  {
    id: "tee-006",
    name: "M&M Real Slim Shady",
    price: 1750,
    image: "/images/dtf-006-front.png",
    badge: "Hot Pick",
  },
]

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeProduct, setActiveProduct] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Auto-cycle best products every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % bestProducts.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 py-12 md:py-20 overflow-hidden bg-black">

      {/* ══════════════════════════════════════
          BACKGROUND: Tiled T-shirt pattern
         ══════════════════════════════════════ */}

      {/* Tiled ghost t-shirt icons across the whole background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid of small t-shirt icons */}
        {[...Array(8)].map((_, row) =>
          [...Array(10)].map((_, col) => (
            <TshirtIcon
              key={`tee-${row}-${col}`}
              className="absolute text-red-900/10"
              style={{
                width: 80,
                height: 72,
                left: col * 150 - 40,
                top: row * 130 - 20,
                transform: `rotate(${(row + col) % 3 === 0 ? "-8deg" : (row + col) % 3 === 1 ? "6deg" : "0deg"})`,
              }}
            />
          ))
        )}
      </div>

      {/* Large ghost t-shirts in corners */}
      <TshirtIcon className="absolute -bottom-10 -left-16 text-red-600/8 w-[360px] h-auto pointer-events-none" />
      <TshirtIcon className="absolute -top-10 -right-16 text-red-600/8 w-[360px] h-auto pointer-events-none" style={{ transform: "rotate(15deg)" }} />

      {/* Red glow cores */}
      <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-red-900/12 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-red-800/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 85% 75% at center, transparent 25%, rgba(0,0,0,0.80) 100%)"
      }} />

      {/* ══════════════════════════════════════
          CENTER CONTENT
         ══════════════════════════════════════ */}
      <div
        className={`relative z-10 text-center w-full max-w-4xl mx-auto transition-all duration-1000 ${
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

        {/* PREMIUM DTF PRINTS divider */}
        <div className="flex items-center gap-3 justify-center my-5">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-red-600" />
          <TshirtIcon className="w-5 h-5 text-red-500 inline-block" />
          <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.4em]">Premium DTF Prints</span>
          <TshirtIcon className="w-5 h-5 text-red-500 inline-block" />
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-red-600" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mt-6">
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

        {/* ══════════════════════════════════════
            3 BEST PRODUCTS — Flashing strip
           ══════════════════════════════════════ */}
        <div className="mt-14 w-full max-w-3xl mx-auto">
          {/* Label */}
          <div className="flex items-center gap-2 justify-center mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[10px] text-white/40 uppercase tracking-[0.35em] font-bold">Featured Drops</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" style={{ animationDelay: "0.5s" }} />
          </div>

          {/* 3 product cards */}
          <div className="grid grid-cols-3 gap-3 md:gap-5">
            {bestProducts.map((product, i) => (
              <Link
                href={`/shop/${product.id}`}
                key={product.id}
                className={`group relative flex flex-col bg-zinc-900/60 border backdrop-blur-sm overflow-hidden transition-all duration-500 ${
                  activeProduct === i
                    ? "border-red-600 shadow-lg shadow-red-600/25 scale-[1.03]"
                    : "border-white/5 scale-100"
                }`}
              >
                {/* Badge */}
                <div className="absolute top-2 left-2 z-10">
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 tracking-wider transition-colors ${
                    activeProduct === i ? "bg-red-600 text-white" : "bg-white/10 text-white/50"
                  }`}>
                    {product.badge}
                  </span>
                </div>

                {/* Product image */}
                <div className="relative aspect-square bg-zinc-950 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 33vw, 200px"
                    className={`object-cover transition-all duration-700 ${
                      activeProduct === i ? "scale-110" : "scale-100"
                    }`}
                  />
                  {/* Active glow overlay */}
                  {activeProduct === i && (
                    <div className="absolute inset-0 bg-red-600/10 border-t-2 border-red-600/50" />
                  )}
                </div>

                {/* Info */}
                <div className="px-3 py-2.5 flex flex-col gap-0.5">
                  <h3 className={`text-xs font-bold line-clamp-1 transition-colors ${
                    activeProduct === i ? "text-white" : "text-white/50"
                  }`}>
                    {product.name}
                  </h3>
                  <p className={`text-xs font-black transition-colors ${
                    activeProduct === i ? "text-red-500" : "text-white/30"
                  }`}>
                    LKR {product.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {bestProducts.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveProduct(i)}
                className={`transition-all duration-300 rounded-full ${
                  activeProduct === i ? "w-6 h-1.5 bg-red-600" : "w-1.5 h-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
