import { getProductById } from "@/lib/products"
import type { CartItem } from "@/components/shop-provider"

export function getCartItemImage(item: CartItem): string {
  if (item.customImage) return item.customImage
  if (item.customImages?.[0]?.image) return item.customImages[0].image
  if (item.image) return item.image

  const product = getProductById(item.id)
  if (product) return product.images?.front || product.image

  return "/products/dtf-front.svg"
}

export function isDataUrl(src: string): boolean {
  return src.startsWith("data:")
}
