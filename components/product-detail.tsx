"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus, Heart, Check, ShoppingBag } from "lucide-react"
import { useShop } from "@/components/shop-provider"
import type { Product } from "@/lib/products"
import { subscribeToNewsletter } from "@/lib/supabase-service"
import { toast } from "sonner"
import { SocialShare } from "@/components/social-share"
import { ProductReviews, ProductRatingBadge } from "@/components/product-reviews"
import { RelatedProducts } from "@/components/related-products"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop()
  const [selectedView, setSelectedView] = useState<"front" | "back" | "detail">("front")
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "Black")
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "M")
  const [selectedDtfSize, setSelectedDtfSize] = useState<"A4" | "A3">("A4")
  const [quantity, setQuantity] = useState(1)
  const [cartPressed, setCartPressed] = useState(false)

  const wished = isWishlisted(product.id)
  const dtfSurcharge = selectedDtfSize === "A3" ? 400 : 0 // Updated to LKR reasonable surcharge
  const finalPrice = product.price + dtfSurcharge
  const viewOptions: Array<{ key: "front" | "back" | "detail"; label: string }> = [
    { key: "front", label: "Front View" },
    { key: "back", label: "Back View" },
    { key: "detail", label: "Detail View" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 py-8">
        <div className="space-y-4">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-red-600/70 bg-black/40 shadow-2xl shadow-red-600/5">
            {viewOptions.map((view) => (
              <div 
                key={view.key}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  selectedView === view.key ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Image 
                  src={product.images[view.key]} 
                  alt={`${product.name} ${view.label}`} 
                  fill 
                  priority={view.key === "front"}
                  loading={view.key === "front" ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 600px"
                  className="object-cover" 
                />
              </div>
            ))}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 text-white text-[10px] uppercase font-bold tracking-widest z-20">
              {viewOptions.find((v) => v.key === selectedView)?.label}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {viewOptions.map((view) => (
              <button
                key={view.key}
                type="button"
                onClick={() => setSelectedView(view.key)}
                className={`rounded-xl border px-3 py-2 text-sm transition-all ${
                  selectedView === view.key
                    ? "border-red-600 bg-red-600/20 text-white"
                    : "border-white/20 text-white/70 hover:border-red-500"
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-4 mt-3">
               <p className="text-red-500 text-3xl font-bold">Rs. {finalPrice.toLocaleString("en-LK")}</p>
               <ProductRatingBadge rating={0.0} count={0} />
            </div>
            <p className="text-white/60 text-sm mt-2">
              DTF Size: {selectedDtfSize} {selectedDtfSize === "A3" ? "(+ Rs. 400.00)" : "(base price)"}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-600/15 border border-green-600/30 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                🎨 Made to order — ships in 3–5 days
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-white/60 text-[10px] font-bold uppercase tracking-wider">
                🇱🇰 Sri Lanka delivery
              </span>
            </div>
          </div>

          <div className="space-y-4 py-6 border-y border-white/10">
             <p className="text-white/80 leading-relaxed">{product.description}</p>
             <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-white/60">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-red-500" /> Premium Cotton</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-red-500" /> DTF High-Res Print</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-red-500" /> Durable & Washable</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-red-500" /> Breathable Fabric</li>
             </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/80 text-xs font-bold uppercase tracking-widest">Color</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full rounded-xl bg-black/60 border border-red-600/50 hover:border-red-600 px-3 py-3 text-white transition-colors"
              >
                {product.colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-white/80 text-xs font-bold uppercase tracking-widest">Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full rounded-xl bg-black/60 border border-red-600/50 hover:border-red-600 px-3 py-3 text-white transition-colors"
              >
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-white/40 mt-1 italic">
                * Currently available in <span className="text-white/60">Regular Fit</span> only. Baggy (Oversized) fits coming soon!
              </p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-white/80 text-xs font-bold uppercase tracking-widest">DTF Print Size</label>
              <select
                value={selectedDtfSize}
                onChange={(e) => setSelectedDtfSize(e.target.value as "A4" | "A3")}
                className="w-full rounded-xl bg-black/60 border border-red-600/50 hover:border-red-600 px-3 py-3 text-white transition-colors"
              >
                <option value="A4">A4 (Standard)</option>
                <option value="A3">A3 (Large Print)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/15 p-3">
            <span className="text-white/80 font-medium">Quantity</span>
            <div className="flex items-center bg-red-600 rounded-lg overflow-hidden p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-red-700 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-10 text-center text-white font-bold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-red-700 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  toggleWishlist({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                  })
                }
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                  wished ? "bg-red-600 border-red-600 text-white" : "border-red-600/50 text-red-500 hover:bg-red-600/10 hover:border-red-600"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-6 h-6 ${wished ? "fill-current" : ""}`} />
              </button>
              <button
                className={`flex-1 py-4 font-bold text-lg rounded-xl transition-all ${
                  cartPressed ? "bg-green-600 text-white scale-[0.98]" : "bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/20"
                }`}
                onClick={() => {
                  addToCart(
                    {
                      id: product.id,
                      name: product.name,
                        price: finalPrice,
                      color: selectedColor,
                      size: selectedSize,
                        dtfSize: selectedDtfSize,
                    },
                    quantity,
                  )
                  setCartPressed(true)
                  toast.success("Added to Bag!", {
                    description: `${quantity}x ${product.name} ready for checkout.`,
                    icon: <ShoppingBag className="w-4 h-4 text-red-500" />,
                    action: {
                      label: "View Cart",
                      onClick: () => window.location.href = "/cart",
                    },
                  })
                  setTimeout(() => setCartPressed(false), 700)
                }}
              >
                {cartPressed ? (
                  <span className="inline-flex items-center gap-2">
                    <Check className="w-6 h-6" />
                    Added!
                  </span>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
            
            <div className="flex justify-center py-2">
               <SocialShare title={product.name} />
            </div>
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} />
      <RelatedProducts currentProductId={product.id} />
    </div>
  )
}
