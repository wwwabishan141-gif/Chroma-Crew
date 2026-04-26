"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { getCartItemKey, useShop } from "@/components/shop-provider"
import { useLanguage } from "@/components/language-provider"

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useShop()
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header currentPage="cart" />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl mb-8">{t("your_cart")}</h1>

        {cart.length === 0 ? (
          <div className="text-center space-y-5">
            <p className="text-white/70">{t("empty_cart")}</p>
            <Link
              href="/shop"
              className="inline-flex px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors font-semibold"
            >
              {t("go_to_shop")}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => {
              const rowKey = getCartItemKey(item)
              return (
              <div key={rowKey} className="border border-white/10 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl">{t(`prod_${item.id.replace('-', '_')}_name` as any) !== `prod_${item.id.replace('-', '_')}_name` ? t(`prod_${item.id.replace('-', '_')}_name` as any) : item.name}</h2>
                    <p className="text-white/60 text-sm">
                      {item.color ?? "Default"} / {item.size ?? "Default"}
                      {item.dtfSize ? ` / ${item.dtfSize}` : ""}
                      {item.customPlacement ? ` / ${item.customPlacement}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 bg-white/10 rounded"
                      onClick={() => updateQuantity(rowKey, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="px-3 py-1 bg-white/10 rounded"
                      onClick={() => updateQuantity(rowKey, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="font-semibold">
                    {item.id === "custom-dtf" ? t("contact_us_info") : `Rs. ${(item.price * item.quantity).toFixed(2)}`}
                  </div>
                  <button className="text-red-500" onClick={() => removeFromCart(rowKey)}>
                    {t("remove")}
                  </button>
                </div>
              </div>
            )})}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <button className="px-4 py-2 border border-white/20 rounded" onClick={clearCart}>
                {t("clear_cart")}
              </button>
              <div className="text-2xl">{t("total")}: Rs. {cartTotal.toFixed(2)}</div>
              <Link href="/checkout" className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700">
                {t("proceed_to_checkout")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
