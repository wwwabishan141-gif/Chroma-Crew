"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { getCartItemKey, useShop } from "@/components/shop-provider"
import { createOrder } from "@/lib/firestore-service"
import { uploadDesign, base64ToFile } from "@/lib/storage-service"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { validateShippingForm } from "@/lib/validators"
import { Timestamp } from "firebase/firestore"

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useShop()
  const { user } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank">("cod")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal: "",
  })
  const [waLink, setWaLink] = useState("")

  // Volume discount tiers
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0)
  const discountPct = totalQty >= 50 ? 20 : totalQty >= 25 ? 15 : totalQty >= 10 ? 10 : totalQty >= 5 ? 5 : 0
  const discountAmt = cartTotal * (discountPct / 100)
  const finalTotal = cartTotal - discountAmt

  const generateOrderId = () => `CC-${Math.floor(100000 + Math.random() * 900000)}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) return
    
    // 1. Validation
    const validation = validateShippingForm(shipping)
    if (!validation.valid) {
      validation.errors.forEach(err => toast.error(err))
      return
    }

    const customItem = cart.find(item => item.id === "custom-dtf")
    if (customItem && !customItem.customImage) {
      toast.error("Please upload a design for your custom product")
      return
    }

    setIsSubmitting(true)
    const newOrderId = generateOrderId()

    try {
      let imageUrl = ""
      if (customItem && customItem.customImage) {
        const uploadToast = toast.loading("Uploading your custom design...")
        try {
          const file = base64ToFile(customItem.customImage, "design.png")
          imageUrl = await uploadDesign(newOrderId, file)
          toast.dismiss(uploadToast)
          toast.success("Design uploaded!")
        } catch (uploadErr: any) {
          toast.dismiss(uploadToast)
          toast.error("Design upload failed, but we will continue with order.")
        }
      }

      const orderData = {
        orderId: newOrderId,
        userId: user ? user.uid : null,
        name: shipping.fullName,
        phone: shipping.phone,
        address: `${shipping.address}, ${shipping.city}, ${shipping.state}, ${shipping.postal}`,
        products: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size,
          dtfSize: item.dtfSize
        })),
        total: finalTotal,
        imageUrl: imageUrl || null,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer',
        status: "Received" as const,
        createdAt: Timestamp.now()
      }

      // Save to Firestore
      await createOrder(orderData)
      
      // Build WhatsApp Message
      const productList = cart.map(i => `• ${i.name} (${i.size}/${i.color}) x${i.quantity}`).join("\n")
      const paymentLabel = paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'
      
      const text = `*New Order: ${newOrderId}*\n\n` +
                   `*Customer Details:*\n` +
                   `Name: ${shipping.fullName}\n` +
                   `Phone: ${shipping.phone}\n` +
                   `Address: ${shipping.address}, ${shipping.city}, ${shipping.state}, ${shipping.postal}\n\n` +
                   `*Products:*\n${productList}\n\n` +
                   `*Total: Rs. ${finalTotal.toFixed(2)}*\n` +
                   `Payment: ${paymentLabel}\n\n` +
                   `*Custom Design Link:* ${imageUrl || "None"}\n\n` +
                   `Please confirm my order. Thank you! 🙏`
      
      const link = `https://wa.me/94763425409?text=${encodeURIComponent(text)}`
      setWaLink(link)
      setOrderId(newOrderId)
      setSubmitted(true)
      clearCart()
      toast.success("Order placed successfully!")

      // Auto-open WhatsApp
      setTimeout(() => {
        window.location.href = link
      }, 2000)

    } catch (error: any) {
      toast.error("Failed to place order: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted && orderId) {
    return (
      <main className="min-h-screen bg-background text-white flex-1">
        <Header currentPage="shop" />
        <div className="max-w-3xl mx-auto px-6 py-16 text-center space-y-4">
          <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-white/70 text-lg">
            Your reference: <strong className="text-white">{orderId}</strong>
          </p>
          <div className="mt-8 rounded-2xl border border-green-600/30 bg-green-600/10 p-6 text-left">
            <p className="font-bold text-green-400 mb-2">📲 Action Required: Confirm on WhatsApp</p>
            <p className="text-white/70 text-sm mb-4">
              We've generated your order details. To finalize and start production, please click the button below to send the confirmation to our WhatsApp.
            </p>
            <a
              href={waLink}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 font-bold transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.413-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.654zm6.236-3.32c1.551.92 3.411 1.403 5.311 1.404 5.432 0 9.854-4.422 9.856-9.854 0-2.632-1.023-5.105-2.883-6.967-1.859-1.862-4.331-2.885-6.963-2.886-5.431 0-9.853 4.422-9.856 9.854-.001 1.905.501 3.766 1.456 5.353l-1.02 3.723 3.82-1.002zm11.754-6.844c-.305-.152-1.802-.888-2.081-.989-.279-.101-.482-.152-.684.152-.202.304-.785.989-.962 1.191-.177.202-.355.228-.66.076-.304-.152-1.284-.473-2.447-1.51-1.054-.94-1.765-2.102-1.968-2.406-.203-.304-.022-.468.129-.62.137-.136.305-.355.457-.533.152-.178.203-.304.305-.507.101-.202.05-.38-.026-.532-.076-.152-.684-1.648-.938-2.256-.247-.591-.499-.511-.684-.511-.178-.001-.38-.001-.584-.001-.203 0-.532.076-.811.38-.28.304-1.066 1.041-1.066 2.536 0 1.496 1.091 2.943 1.242 3.146.152.203 2.148 3.28 5.204 4.602.727.314 1.294.502 1.735.643.729.232 1.393.199 1.918.121.585-.087 1.802-.736 2.056-1.445.253-.708.253-1.316.177-1.445-.076-.129-.279-.203-.583-.355z"/></svg>
              Confirm on WhatsApp
            </a>
          </div>
          <div className="flex flex-wrap gap-3 justify-center pt-6">
            <Link href="/account" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-medium transition-all">
              Track Order
            </Link>
            <Link href="/shop" className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header currentPage="shop" />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Checkout</h1>
            <p className="text-white/60">Complete your details to place your custom order.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-white/40 uppercase tracking-wider">Shipping Details</p>
              <input
                required
                placeholder="Full Name"
                value={shipping.fullName}
                onChange={(e) => setShipping((s) => ({ ...s, fullName: e.target.value }))}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-4 outline-none focus:border-red-600 transition-all"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={shipping.email}
                  onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-4 outline-none focus:border-red-600 transition-all"
                />
                <input
                  required
                  placeholder="Phone Number"
                  value={shipping.phone}
                  onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-4 outline-none focus:border-red-600 transition-all"
                />
              </div>
              <textarea
                required
                placeholder="Shipping Address"
                value={shipping.address}
                onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-4 min-h-24 outline-none focus:border-red-600 transition-all"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  required
                  placeholder="City"
                  value={shipping.city}
                  onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                  className="rounded-xl bg-white/5 border border-white/10 p-4 outline-none focus:border-red-600 transition-all"
                />
                <input
                  required
                  placeholder="State"
                  value={shipping.state}
                  onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))}
                  className="rounded-xl bg-white/5 border border-white/10 p-4 outline-none focus:border-red-600 transition-all"
                />
                <input
                  required
                  placeholder="Postal Code"
                  value={shipping.postal}
                  onChange={(e) => setShipping((s) => ({ ...s, postal: e.target.value }))}
                  className="rounded-xl bg-white/5 border border-white/10 p-4 outline-none focus:border-red-600 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-white/40 uppercase tracking-wider">Payment Method</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-red-600 bg-red-600/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="w-5 h-5 accent-red-600"
                />
                <div className="flex flex-col">
                  <span className="font-bold">Cash on Delivery</span>
                  <span className="text-xs text-white/50">Pay when you receive</span>
                </div>
              </label>
              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-red-600 bg-red-600/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="w-5 h-5 accent-red-600"
                />
                <div className="flex flex-col">
                  <span className="font-bold">Bank Transfer</span>
                  <span className="text-xs text-white/50">Details shared after confirm</span>
                </div>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-5 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-red-600/20"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing Order...
              </span>
            ) : "Place Order"}
          </button>
        </form>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 p-6 bg-white/5 sticky top-28">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={getCartItemKey(item)} className="flex justify-between text-sm items-start gap-4">
                  <div className="space-y-1 flex-1">
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-white/40 text-xs">{item.size} / {item.color} x {item.quantity}</p>
                  </div>
                  <span className="font-medium text-white/80 whitespace-nowrap">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 mt-6 pt-6 space-y-3">
              {discountPct > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Volume Discount ({discountPct}%)</span>
                  <span className="text-green-400">-Rs. {discountAmt.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg text-white/60">Total</span>
                <span className="text-3xl font-bold text-red-600">Rs. {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-dashed border-white/20">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Notice</p>
              <p className="text-xs text-white/50 leading-relaxed">
                By placing this order, you agree to our Terms of Service. Custom prints are non-refundable once production starts.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
