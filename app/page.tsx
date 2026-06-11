"use client"

// Removed unused React hooks and next/image
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedSection } from "@/components/featured-section"
import { ElevateSection } from "@/components/elevate-section"
import { PromisesSection } from "@/components/promises-section"
import { HowToOrderSection } from "@/components/how-to-order"
import { CustomDesignSection } from "@/components/custom-design-section"
import { BulkPricingBanner } from "@/components/bulk-pricing-banner"

// Loading screen removed per user request

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex-1">
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
