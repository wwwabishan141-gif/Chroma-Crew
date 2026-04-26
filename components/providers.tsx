"use client"

import { ShopProvider } from "@/components/shop-provider"
import { LanguageProvider } from "@/components/language-provider"
import { PromoBanner, CookieConsentBanner, NewsletterPopup } from "@/components/site-chrome"
import { CrispChat } from "@/components/crisp-chat"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { SiteFooter } from "@/components/site-footer"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ShopProvider>
          <Toaster position="bottom-right" richColors theme="dark" />
          <PromoBanner />
          <div className="flex min-h-screen flex-col">{children}</div>
          <SiteFooter />
          <CookieConsentBanner />
          <NewsletterPopup />
          <CrispChat />
          <WhatsAppButton />
      </ShopProvider>
    </LanguageProvider>
  )
}
