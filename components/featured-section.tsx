"use client"

import { products } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

export function FeaturedSection() {
  const featuredIds = ["tee-001", "tee-004", "tee-010", "tee-012"]
  const featuredProducts = products.filter((p) => featuredIds.includes(p.id))

  return (
    <section className="py-20 md:py-24 px-4 md:px-6 bg-background relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="inline-block px-3 py-1 rounded-full border border-red-600/40 bg-red-600/10 text-red-400 text-[10px] font-black uppercase tracking-widest mb-4">
              Hot Drops
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-none">
              Featured <span className="text-red-500">Drop</span>
            </h2>
            <p className="text-white/40 mt-3 text-sm md:text-base max-w-sm">
              Limited quantities. Premium heavyweight cotton cuts. Once it drops, it&apos;s gone.
            </p>
          </div>
          <a
            href="/shop"
            className="group inline-flex items-center gap-2 text-red-500 font-bold text-sm mt-6 md:mt-0 hover:text-red-400 transition-colors border border-red-600/30 hover:border-red-500/50 rounded-full px-5 py-2.5 bg-red-600/5 hover:bg-red-600/10"
          >
            Shop All Collections
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
