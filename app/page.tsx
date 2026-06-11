"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedSection } from "@/components/featured-section"
import { ElevateSection } from "@/components/elevate-section"
import { PromisesSection } from "@/components/promises-section"
import { HowToOrderSection } from "@/components/how-to-order"
import { CustomDesignSection } from "@/components/custom-design-section"
import { BulkPricingBanner } from "@/components/bulk-pricing-banner"

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <main className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* Animated Logo - Using uploaded logo */}
      <div className="relative mb-8">
        <div className="relative w-32 h-32 animate-pulse">
          <Image
            src="/website-logo-what-01.png"
            alt="ChromaCrew"
            fill
            className="object-contain"
            priority
            sizes="128px"
          />
        </div>
        {/* Orbiting rings */}
        <div className="absolute top-1/2 left-1/2 w-[152px] h-[152px] -translate-x-1/2 -translate-y-1/2">
          <div className="w-full h-full rounded-full border-2 border-red-600/30 animate-[spin_2s_linear_infinite]" />
        </div>
        <div className="absolute top-1/2 left-1/2 w-[176px] h-[176px] -translate-x-1/2 -translate-y-1/2">
          <div className="w-full h-full rounded-full border-2 border-red-600/20 animate-[spin_3s_linear_infinite_reverse]" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mt-4">
        <div
          className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading Text */}
      <p className="text-white/75 mt-4 text-sm font-medium">Loading experience...</p>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  )
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />
  }

  return (
    <main className="min-h-screen bg-background flex-1 animate-in fade-in duration-500">
        <Header currentPage="home" />
        <HeroSection />
        <PromisesSection />
        <FeaturedSection />
        <HowToOrderSection />
        <CustomDesignSection />
        <BulkPricingBanner />
        <ElevateSection />
      </main>
  )
}
