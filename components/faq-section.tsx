"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

const faqs = [
  {
    question: "How do your t-shirts fit? Should I size up?",
    answer: "Our t-shirts are tailored for a premium modern boxy fit. They hang slightly loose with clean drop shoulders. We recommend ordering your standard size for a comfortable streetwear drape. If you want a highly oversized/baggy aesthetic, size up by one. You can find detailed measurements in our Size Guide.",
  },
  {
    question: "How long does delivery take? Do you have Cash on Delivery?",
    answer: "Yes, Cash on Delivery is available islandwide in Sri Lanka. For Colombo and suburbs, delivery typically takes 1–2 business days. For out-of-Colombo areas (Jaffna, Kandy, Galle, etc.), it takes 2–4 business days. You pay cash only when our courier hands you the package.",
  },
  {
    question: "How should I wash my graphic tees to protect the print?",
    answer: "Turn the t-shirt inside out before washing. Machine wash cold with similar colors. Do not use bleach. Line dry in the shade. Never iron directly on the printed graphics — iron the shirt inside out on a low setting to keep your graphic looking vibrant forever.",
  },
  {
    question: "What is your return and size exchange policy?",
    answer: "We want your fit to be perfect. If the t-shirt doesn't drape the way you want, we offer size exchanges within 7 days of delivery. The garment must be unworn and unwashed. In the rare event that you receive a defective print or damaged item, we will replace it free of charge immediately.",
  },
  {
    question: "How do I request a custom streetwear design?",
    answer: "Click 'Create Your Tee' on our hero section or go to Custom Design in the menu. You can upload your image (transparent PNG preferred) or type a description, and our team will confirm details on WhatsApp before printing. We handle anime scenes, car graphics, personal logos, and more.",
  },
]

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section className="py-20 md:py-28 px-4 md:px-6 bg-background relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-60 bg-red-900/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10 space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <span className="inline-block px-3 py-1 rounded-full border border-red-600/40 bg-red-600/10 text-red-400 text-[10px] font-black uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-none">
            Common <span className="text-red-500">Questions</span>
          </h2>
          <p className="text-white/40 text-sm md:text-base">
            Everything you need to know before joining the crew.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-red-600/35 bg-red-600/[0.03] shadow-[0_0_30px_-8px_rgba(220,38,38,0.25)]"
                    : "border-white/[0.07] bg-white/[0.015] hover:border-white/15"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 group"
                >
                  {/* Left glow indicator */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`shrink-0 w-0.5 h-5 rounded-full transition-all duration-300 ${
                        isOpen ? "bg-red-500" : "bg-white/10 group-hover:bg-white/20"
                      }`}
                    />
                    <span className={`font-bold text-sm md:text-base leading-snug transition-colors ${isOpen ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                      {faq.question}
                    </span>
                  </div>

                  {/* Rotating chevron */}
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                      isOpen ? "rotate-180 text-red-500" : "rotate-0 text-white/30 group-hover:text-white/60"
                    }`}
                  />
                </button>

                {/* Answer — smooth expand */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 pt-0 border-t border-white/[0.05] ml-10">
                    <p className="text-white/55 text-sm leading-relaxed mt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <p className="text-white/35 text-sm mb-4">Still have questions?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/faq"
              className="px-6 py-3 rounded-full border border-white/15 bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white font-semibold text-sm transition-all"
            >
              Full FAQ Page
            </Link>
            <a
              href="https://wa.me/94751297637"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full border border-green-600/40 bg-green-600/10 hover:bg-green-600/20 text-green-400 font-bold text-sm transition-all flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
