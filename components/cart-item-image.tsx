"use client"

import Image from "next/image"
import { getCartItemImage, isDataUrl } from "@/lib/cart-utils"
import type { CartItem } from "@/components/shop-provider"

interface CartItemImageProps {
  item: CartItem
  size?: "sm" | "md"
  className?: string
}

const sizeMap = {
  sm: "w-16 h-16",
  md: "w-20 h-20",
}

export function CartItemImage({ item, size = "md", className = "" }: CartItemImageProps) {
  const src = getCartItemImage(item)

  return (
    <div
      className={`${sizeMap[size]} rounded-xl overflow-hidden border border-white/10 bg-black shrink-0 relative ${className}`}
    >
      {isDataUrl(src) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={item.name} className="w-full h-full object-contain p-1" />
      ) : (
        <Image src={src} alt={item.name} fill className="object-contain p-1" sizes="80px" />
      )}
    </div>
  )
}
