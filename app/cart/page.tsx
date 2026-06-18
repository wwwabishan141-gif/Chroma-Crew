"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { PageHeader } from "@/components/page-header"
import { CartItemImage } from "@/components/cart-item-image"
import { getCartItemKey, useShop } from "@/components/shop-provider"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useShop()

  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header currentPage="cart" />
      <div className="page-container max-w-4xl">
        <PageHeader
          badge="Checkout"
          title="Your Cart"
          description={cart.length > 0 ? `${cart.length} item${cart.length !== 1 ? "s" : ""} ready for checkout.` : undefined}
        />

        {cart.length === 0 ? (
          <div className="empty-state space-y-5">
            <ShoppingBag className="w-12 h-12 text-red-400 mx-auto" />
            <p className="text-white/70">Your cart is empty. Add products to continue checkout.</p>
            <Link href="/shop" className="btn-primary">
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              {cart.map((item) => {
                const rowKey = getCartItemKey(item)
                return (
                  <div key={rowKey} className="page-card p-4 md:p-5">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                      <CartItemImage item={item} />
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-white">{item.name}</h2>
                        <p className="text-white/50 text-sm mt-0.5">
                          {[item.color, item.size, item.fit, item.dtfSize, item.customPlacement]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        <p className="text-red-400 font-bold mt-2">
                          {item.id === "custom-dtf"
                            ? "Custom order — see breakdown at checkout"
                            : `Rs. ${(item.price * item.quantity).toLocaleString("en-LK")}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-black border border-white/10 rounded-xl overflow-hidden">
                          <button
                            type="button"
                            className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white hover:bg-red-600/20 transition-colors"
                            onClick={() => updateQuantity(rowKey, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-white font-semibold text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white hover:bg-red-600/20 transition-colors"
                            onClick={() => updateQuantity(rowKey, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="p-2 text-white/40 hover:text-red-400 transition-colors"
                          onClick={() => removeFromCart(rowKey)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="page-card p-6 space-y-4 border-red-600/20">
              <div className="flex items-center justify-between">
                <span className="text-white/60 uppercase text-xs tracking-widest font-semibold">Order Total</span>
                <span className="text-2xl font-black text-white">
                  Rs. {cartTotal.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  className="btn-secondary flex-1 text-sm"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
                <Link href="/checkout" className="btn-primary flex-1 text-sm text-center">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
