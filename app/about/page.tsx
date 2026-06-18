import { Header } from "@/components/header"
import { PageHeader } from "@/components/page-header"
import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header currentPage="about" />
      <div className="page-container max-w-4xl">

        <PageHeader
          badge="Who We Are"
          title="Built in Colombo. Worn Everywhere."
          description="ORBYT is a premium streetwear and custom DTF printing brand. We craft heavyweight graphic tees and custom prints with zero shortcuts — every order handled personally."
        />

        <section className="page-card p-8 md:p-10 space-y-4 mb-12 border-red-600/20 bg-red-600/[0.03]">
          <h2 className="text-xl font-bold text-red-400 uppercase tracking-wider">Our Mission</h2>
          <p className="text-white/75 leading-relaxed">
            We started ORBYT because great DTF prints should be accessible to everyone — from a single custom tee to a small batch run. Every order we receive is handled personally. We check every file, press every transfer with care, and only send it when we&apos;re happy with it.
          </p>
        </section>

        <section className="space-y-6 mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-tight">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { step: "01", title: "Place Your Order", desc: "Browse our shop or use the custom design builder to upload your artwork. Pick colour, size, and print size." },
              { step: "02", title: "We Print & Press", desc: "Your order is printed on premium DTF film and heat-pressed onto your garment with care." },
              { step: "03", title: "Delivered to You", desc: "Shipped islandwide. Track your order status anytime from your account page." },
            ].map((item) => (
              <div key={item.step} className="page-card page-card-hover p-6 space-y-3">
                <span className="text-4xl font-black text-red-600/40">{item.step}</span>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-tight">What We Promise</h2>
          <div className="space-y-3">
            {[
              { title: "No Minimum Orders", desc: "Order just one piece. We treat every order — big or small — with the same attention." },
              { title: "File Support Included", desc: "Not sure if your file is print-ready? Send it to us and we&apos;ll check it before we print anything." },
              { title: "Transparent Pricing", desc: "The price you see is what you pay. No hidden fees." },
              { title: "Direct Contact", desc: "You&apos;re talking to the people actually running the shop — not a call centre." },
            ].map((val) => (
              <div key={val.title} className="flex gap-4 p-4 rounded-xl page-card page-card-hover">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-red-600 shrink-0" />
                <div>
                  <p className="font-semibold text-white">{val.title}</p>
                  <p className="text-white/60 text-sm mt-0.5">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="page-card p-8 space-y-4 text-center border-red-600/20">
          <p className="text-white/60 text-sm">Based in Colombo, Sri Lanka · Online orders only · Cash on Delivery available</p>
          <Link href="/contacts" className="btn-primary text-sm">
            Get in Touch
          </Link>
        </section>

      </div>
    </main>
  )
}
