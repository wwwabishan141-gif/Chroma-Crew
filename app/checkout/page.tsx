"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { getCartItemKey, useShop } from "@/components/shop-provider"
import { createOrder, tryUploadDesign, base64ToFile } from "@/lib/supabase-service"
import { toast } from "sonner"
import { validateShippingForm } from "@/lib/validators"
import { supabase } from "@/lib/supabase"

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useShop()
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
      let imageUrl: string | null = null
      if (customItem && customItem.customImage) {
        const uploadToast = toast.loading("Uploading your design...")
        const file = base64ToFile(customItem.customImage, "design.png")
        imageUrl = await tryUploadDesign(newOrderId, file)
        toast.dismiss(uploadToast)
        if (imageUrl) {
          toast.success("Design uploaded!")
        } else {
          toast.warning("Design upload failed — order will continue without image.")
        }
      }

      const { data: { user } } = await supabase.auth.getUser()

      const orderData = {
        order_id: newOrderId,
        user_id: user ? user.id : null,
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
        image_url: imageUrl,
        status: "Received" as const
      }

      // Save to Supabase
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
                   `*Design Image:* ${imageUrl || "None"}\n\n` +
                   `Please confirm my order. Thank you! 🙏`
      
      const link = `https://wa.me/94763425409?text=${encodeURIComponent(text)}`
      setWaLink(link)
      setOrderId(newOrderId)
      setSubmitted(true)
      clearCart()
      toast.success("Order placed successfully!")

      // Auto-open WhatsApp
      window.open(link, "_blank")

    } catch (error: any) {
      toast.error("Failed to place order: " + error.message)
      console.error(error)
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
              Your order has been saved in our system. To finalize and start production, please send the confirmation to our WhatsApp.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 font-bold transition-all active:scale-95"
            >
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
            <p className="text-white/60">Using Supabase Backend for secure processing.</p>
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
            className="w-full py-5 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-xl transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-red-600/20"
          >
            {isSubmitting ? "Processing..." : "Place Order"}
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
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg text-white/60">Total</span>
                <span className="text-3xl font-bold text-red-600">Rs. {finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
