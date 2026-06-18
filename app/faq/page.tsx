"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { PageHeader } from "@/components/page-header"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "What is DTF printing?",
    a: "Direct-to-Film (DTF) printing transfers your artwork onto a special film using adhesive powder, which is then heat-pressed onto fabric. It works on almost any colour garment and produces bright, vibrant prints with a soft feel.",
  },
  {
    q: "What file format do you need?",
    a: "PNG at 300 DPI with a transparent background is ideal. We also accept PDF and SVG. Avoid JPG files as they don't support transparency. Not sure about your file? Contact us and we'll check it for free before printing.",
  },
  {
    q: "What is your turnaround time?",
    a: "Most orders are ready and shipped within 3–5 business days after your order is confirmed and your file is approved. If you need it faster, contact us before ordering and we'll do our best.",
  },
  {
    q: "Do you have a minimum order quantity?",
    a: "No minimum! You can order just one custom tee or one DTF transfer. Volume discounts apply automatically when you order more.",
  },
  {
    q: "Where do you ship?",
    a: "We currently ship island-wide within Sri Lanka. We are an online-only business — there is no physical walk-in shop.",
  },
  {
    q: "How do I care for my DTF-printed garment?",
    a: "Wait 24 hours after pressing before washing. Turn inside out, wash in cold or warm water with a mild detergent. Tumble dry on low or hang dry. Avoid bleach or fabric softener directly on the print.",
  },
  {
    q: "What if my file isn't print-ready?",
    a: "We'll pause your order and contact you with a clear list of what needs fixing. No file will be printed until you've approved it. Simple fixes are done free; complex redraws may incur a small charge.",
  },
  {
    q: "Can I get a refund or reprint?",
    a: "If there is a defect in our printing, contact us within 7 days of delivery with photos. We will reprint or issue a credit. We can't cover issues caused by incorrect file submissions after approval.",
  },
  {
    q: "How do I track my order?",
    a: "After placing an order, you can track its status (Received → Processing → Printed → Shipped → Delivered) from your Account page.",
  },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header currentPage="faq" />
      <div className="page-container max-w-3xl">
        <PageHeader
          badge="Support"
          title="FAQ"
          description="Everything you need to know before placing your first order."
        />

        <div className="space-y-3 mb-10">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={item.q} className="page-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 hover:bg-red-600/5 transition-colors"
                >
                  <h2 className="text-sm md:text-base font-bold text-white">{item.q}</h2>
                  <ChevronDown
                    className={`w-5 h-5 text-red-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-white/5">
                    <p className="text-white/70 text-sm leading-relaxed pt-4">{item.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="page-card p-8 text-center space-y-4 border-red-600/20">
          <p className="text-white/70">Still have a question?</p>
          <Link href="/contacts" className="btn-primary text-sm">
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  )
}
