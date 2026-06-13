"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PromisesSection } from "@/components/promises-section"
import { FeaturedSection } from "@/components/featured-section"
import { BestSellers } from "@/components/best-sellers"
import { BrandStory } from "@/components/brand-story"
import { SocialProof } from "@/components/social-proof"
import { InstagramTikTokSection } from "@/components/instagram-tiktok-section"
import { FAQSection } from "@/components/faq-section"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex-1">
      <Header currentPage="home" />
      <HeroSection />
      <PromisesSection />
      <FeaturedSection />
      <BestSellers />
      <BrandStory />
      <SocialProof />
      <InstagramTikTokSection />
      <FAQSection />
    </main>
  )
}
