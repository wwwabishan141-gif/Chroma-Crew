"use client"

import { products } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

export function FeaturedSection() {
  // Select a curated mix of streetwear/anime/car t-shirts to represent our subcultures
  const featuredIds = ["tee-001", "tee-004", "tee-010", "tee-012"]
  const featuredProducts = products.filter((p) => featuredIds.includes(p.id))

  return (
    <section className="py-16 md:py-20 px-4 md:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12">
          <div>
            <span className="inline-block px-3 py-1 rounded-full border border-red-600/40 bg-red-600/10 text-red-400 text-[10px] font-black uppercase tracking-widest mb-3">
              Hot Drops
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-wide uppercase">Featured Drop</h2>
            <p className="text-white/50 mt-2 text-sm md:text-base">Limited quantities. Premium heavyweight cotton cuts. Once it drops, it is gone.</p>
          </div>
          <a
            href="/shop"
            className="group inline-flex items-center gap-1 text-red-500 font-bold text-sm mt-4 md:mt-0 hover:text-red-400 transition-colors"
          >
            Shop All Collections <span className="group-hover:translate-x-1 transition-transform">→</span>
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
