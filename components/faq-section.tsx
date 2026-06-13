"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "How do your t-shirts fit? Should I size up?",
    answer: "Our t-shirts are tailored for a premium modern boxy fit. They hang slightly loose with clean drop shoulders. We recommend ordering your standard size for a comfortable streetwear drape. If you want a highly oversized/baggy aesthetic, size up by one. You can find detailed measurements in our Size Guide link.",
  },
  {
    question: "How long does delivery take? Do you have Cash on Delivery?",
    answer: "Yes, Cash on Delivery is available islandwide in Sri Lanka. For Colombo and suburbs, delivery typically takes 1 to 2 business days. For out-of-Colombo areas (Jaffna, Kandy, Galle, etc.), it takes 2 to 4 business days. You pay cash only when our courier hands you the package.",
  },
  {
    question: "How should I wash my graphic tees to protect the print?",
    answer: "To ensure your graphic remains vibrant forever, turn the t-shirt inside out before washing. Machine wash cold with similar colors. Do not use bleach. Line dry in the shade. **Crucial:** Never iron directly on the printed graphics—iron the shirt inside out on a low setting.",
  },
  {
    question: "What is your return and size exchange policy?",
    answer: "We want your fit to be perfect. If the t-shirt doesn't drape the way you want, we offer size exchanges within 7 days of delivery. The garment must be unworn and unwashed. In the rare event that you receive a defective print or damaged item, we will replace it free of charge immediately.",
  },
  {
    question: "How do I request a custom streetwear design?",
    answer: "If you have a specific idea, car graphic, anime scene, or personal logo you want on a premium heavyweight tee, click 'CUSTOM REQUESTS' in our hero section or go to Custom Design in the menu. You can upload your image (transparent PNG preferred) or type a description, and our team will check your design's resolution and confirm details on WhatsApp before printing.",
  },
]

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section className="py-16 md:py-20 px-4 md:px-6 bg-background">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="inline-block px-3 py-1 rounded-full border border-red-600/40 bg-red-600/10 text-red-400 text-[10px] font-black uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-wide uppercase">Common Questions</h2>
          <p className="text-white/50 text-sm md:text-base">Everything you need to know before joining the crew.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className="rounded-xl border border-white/8 bg-white/[0.01] overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left text-white font-bold text-sm md:text-base hover:bg-white/[0.02] transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-red-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 border-t border-white/5 bg-white/[0.005] animate-in fade-in duration-200">
                    <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
