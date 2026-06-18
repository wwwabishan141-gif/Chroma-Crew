"use client"

import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { useShop } from "@/components/shop-provider"
import { Heart, ShoppingCart } from "lucide-react"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, addToCart } = useShop()

  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header currentPage="wishlist" />
      <div className="page-container max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-12">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full border border-red-600/40 bg-red-600/10 text-red-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Saved
            </span>
            <h1 className="text-3xl md:text-4xl text-white font-black tracking-tight uppercase">Wishlist</h1>
            <p className="text-white/65 text-sm">Your saved pieces — ready when you are.</p>
          </div>
          {wishlist.length > 0 && (
            <button
              type="button"
              className="btn-secondary text-sm shrink-0"
              onClick={clearWishlist}
            >
              Clear All
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-state space-y-5">
            <Heart className="w-12 h-12 text-red-400 mx-auto" />
            <p className="text-white/70">No saved products yet. Browse the catalog and add items you like.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/shop" className="btn-primary">
                Explore Shop
              </Link>
              <Link href="/" className="btn-secondary">
                Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishlist.map((item) => (
              <div key={item.id} className="page-card page-card-hover p-5 flex flex-col gap-4">
                <div className="w-full aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/50 relative">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-contain p-4"
                    unoptimized={(item.image || "").startsWith("data:")}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{item.name}</h2>
                  <p className="text-red-400 font-bold mt-1">Rs. {item.price.toLocaleString("en-LK")}</p>
                </div>
                <div className="flex gap-2 mt-auto">
                  <button
                    type="button"
                    className="btn-primary flex-1 text-sm gap-2"
                    onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image }, 1)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    className="btn-secondary text-sm px-4"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
