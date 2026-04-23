"use client"

import { products, type Product } from "@/lib/products"
import Link from "next/link"
import Image from "next/image"

export function RelatedProducts({
  currentProductId,
  maxItems = 4,
}: {
  currentProductId: string
  maxItems?: number
}) {
  const current = products.find((p) => p.id === currentProductId)
  if (!current) return null

  // Find related products: same category or overlapping design themes
  const related = products
    .filter((p) => p.id !== currentProductId)
    .map((p) => {
      let score = 0
      if (p.category === current.category) score += 2
      const themeOverlap = p.designThemes.filter((t) =>
        current.designThemes.includes(t)
      ).length
      score += themeOverlap
      return { product: p, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)
    .map((r) => r.product)

  // If not enough related, fill with random products
  if (related.length < maxItems) {
    const remaining = products.filter(
      (p) => p.id !== currentProductId && !related.some((r) => r.id === p.id)
    )
    const shuffled = remaining.sort(() => Math.random() - 0.5)
    related.push(...shuffled.slice(0, maxItems - related.length))
  }

  if (related.length === 0) return null

  return (
    <section className="mt-12 pt-10 border-t border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group rounded-xl border border-white/10 overflow-hidden hover:border-red-500/40 transition-all hover:shadow-lg hover:shadow-red-500/5"
          >
            <div className="relative aspect-square bg-[#151515] overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <p className="text-white text-sm font-medium truncate group-hover:text-red-400 transition-colors">
                {product.name}
              </p>
              <p className="text-white/60 text-sm mt-1">
                Rs. {product.price.toLocaleString("en-LK")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
