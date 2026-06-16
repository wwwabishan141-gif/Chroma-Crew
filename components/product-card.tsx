"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Eye } from "lucide-react"
import { useShop } from "@/components/shop-provider"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image?: string
}

export function ProductCard({ id, name, price, image }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { toggleWishlist, isWishlisted } = useShop()
  const wished = isWishlisted(id)

  return (
    <Link
      href={`/product/${id}`}
      className="group relative block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <div
        className={`relative bg-card aspect-[3/4] rounded-xl overflow-hidden transition-all duration-500 ${
          isHovered ? "shadow-glow-red scale-[1.02]" : "shadow-lg"
        }`}
      >
        {/* Wishlist button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleWishlist({ id, name, price, image })
          }}
          className={`absolute top-3 right-3 z-30 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
            wished
              ? "bg-red-600 border-red-600 text-white scale-110"
              : "bg-black/50 border-white/20 text-white/70 hover:border-red-500 hover:text-white backdrop-blur-sm"
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${wished ? "fill-current" : ""}`} />
        </button>

        {/* Corner Decorations — expand on hover */}
        <div className={`absolute top-0 left-0 border-t-2 border-l-2 border-red-600 rounded-tl-xl transition-all duration-300 ${isHovered ? "w-8 h-8" : "w-5 h-5"}`} />
        <div className={`absolute top-0 right-0 border-t-2 border-r-2 border-red-600 rounded-tr-xl transition-all duration-300 ${isHovered ? "w-8 h-8" : "w-5 h-5"}`} />
        <div className={`absolute bottom-0 left-0 border-b-2 border-l-2 border-red-600 rounded-bl-xl transition-all duration-300 ${isHovered ? "w-8 h-8" : "w-5 h-5"}`} />
        <div className={`absolute bottom-0 right-0 border-b-2 border-r-2 border-red-600 rounded-br-xl transition-all duration-300 ${isHovered ? "w-8 h-8" : "w-5 h-5"}`} />

        {/* Product Image — zoom on hover, no black overlay */}
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className={`object-cover transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-background flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}

        {/* Slide-up glass drawer on hover */}
        <div
          className={`absolute inset-x-0 bottom-0 z-20 glass-drawer px-4 pt-10 pb-4 transition-all duration-300 ease-out ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <p className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1">{name}</p>
          <p className="text-red-400 font-black text-base mb-3">Rs. {price.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <span className="flex-1 text-center py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5">
              <Eye className="w-3 h-3" />
              View Details
            </span>
          </div>
        </div>
      </div>

      {/* Product Info below card (visible when not hovered) */}
      <div
        className={`mt-3 transition-all duration-300 ${
          isHovered ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
        }`}
      >
        <h3 className="text-white/90 font-semibold text-sm line-clamp-1 mb-1">{name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-red-500 font-black text-sm">Rs. {price.toLocaleString()}</p>
          <div className="flex gap-1">
            <span className="inline-block px-1.5 py-0.5 rounded-full bg-red-600/15 border border-red-600/25 text-red-400 text-[9px] font-bold uppercase tracking-wide">New</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
