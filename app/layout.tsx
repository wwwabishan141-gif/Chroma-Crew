// ORBYT - Final Deployment Trigger
import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Poppins } from "next/font/google"
import { Providers } from "@/components/providers"
import { CookieConsent } from "@/components/cookie-consent"
import { BackToTop } from "@/components/back-to-top"
import './globals.css'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://orbyt.lk'),
  title: 'ORBYT — Premium Streetwear & Custom DTF Tees | Sri Lanka',
  description: 'Luxury streetwear graphic tees and custom DTF printing. Premium heavyweight cotton, Colombo designed, islandwide delivery with Cash on Delivery.',
  keywords: ['ORBYT', 'streetwear Sri Lanka', 'custom t-shirts', 'DTF printing Colombo', 'graphic tees', 'premium streetwear'],
  openGraph: {
    title: 'ORBYT — Premium Streetwear & Custom DTF Tees',
    description: 'Luxury streetwear graphic tees and custom DTF printing delivered islandwide in Sri Lanka.',
    url: 'https://orbyt.lk',
    siteName: 'ORBYT',
    locale: 'en_LK',
    type: 'website',
    images: [{ url: '/logo1.png', width: 512, height: 512, alt: 'ORBYT' }],
  },
  icons: {
    icon: [
      { url: '/logo1.png', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/logo1.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <CookieConsent />
          <BackToTop />
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
