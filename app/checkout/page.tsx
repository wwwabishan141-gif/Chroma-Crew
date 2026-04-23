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

  const generateOrderId = () => `CC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) return
    
    // 1. Validation for shipping details
    const validation = validateShippingForm(shipping)
    if (!validation.valid) {
      validation.errors.forEach(err => toast.error(err))
      return
    }

    // 2. Validation for custom product
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
          throw new Error("Design upload failed. Please try a smaller image or check your connection.")
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

      await createOrder(orderData)
      
      const productList = orderData.products.map(i => `${i.name} x${i.quantity}`).join(", ")
      const paymentLabel = paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'
      const domain = window.location.origin
      
      const text = `Hi, I just placed an order on Chroma Crew.\n\nOrder ID: ${newOrderId}\nName: ${orderData.name}\nProducts: ${productList}\nTotal: Rs. ${orderData.total.toFixed(2)}\nAddress: ${orderData.address}\n\nCustom Design:\n${imageUrl || "None"}\n\nPlease confirm my order. Thank you.`
      
      const link = `https://wa.me/94763425409?text=${encodeURIComponent(text)}`
      setWaLink(link)
      setOrderId(newOrderId)
      setSubmitted(true)
      clearCart()
      toast.success("Order placed successfully!")

      setTimeout(() => {
        window.open(link, "_blank")
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
          <h1 className="text-4xl mb-2">Order Confirmed</h1>
          <p className="text-white/70">
            Thanks for your order. Your reference:{" "}
            <strong className="text-white">{orderId}</strong>
          </p>
          <p className="text-white/60 text-sm">
            We will review your order and contact you if we need anything. Track your progress any time from your account page.
          </p>
          <div className="mt-4 rounded-xl border border-green-600/30 bg-green-600/10 px-5 py-4 text-sm text-green-300 text-left">
            <p className="font-semibold mb-1">📲 Next step: Confirm on WhatsApp</p>
            <p className="text-green-400/80">We will reach out to confirm your order details and arrange delivery. You can also message us directly:</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 font-semibold flex items-center gap-2"
            >
              Confirm on WhatsApp
            </a>
            <Link href="/account" className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 font-medium">
              My account
            </Link>
            <Link href="/shop" className="px-5 py-2.5 rounded-xl border border-white/25 hover:bg-white/10">
              Continue shopping
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
        <form className="space-y-4" onSubmit={handleSubmit}>
          <h1 className="text-4xl mb-2">Checkout</h1>
          <p className="text-white/70 mb-6">Enter shipping details and choose payment method.</p>

          <div className="grid grid-cols-1 gap-4">
            <input
              required
              placeholder="Full Name"
              value={shipping.fullName}
              onChange={(e) => setShipping((s) => ({ ...s, fullName: e.target.value }))}
              className="w-full rounded-xl bg-white/10 border border-white/20 p-3 outline-none focus:border-red-600"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={shipping.email}
              onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
              className="w-full rounded-xl bg-white/10 border border-white/20 p-3 outline-none focus:border-red-600"
            />
            <input
              required
              placeholder="Phone Number"
              value={shipping.phone}
              onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
              className="w-full rounded-xl bg-white/10 border border-white/20 p-3 outline-none focus:border-red-600"
            />
            <textarea
              required
              placeholder="Shipping Address"
              value={shipping.address}
              onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
              className="w-full rounded-xl bg-white/10 border border-white/20 p-3 min-h-24 outline-none focus:border-red-600"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                required
                placeholder="City"
                value={shipping.city}
                onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                className="rounded-xl bg-white/10 border border-white/20 p-3 outline-none focus:border-red-600"
              />
              <input
                required
                placeholder="State"
                value={shipping.state}
                onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))}
                className="rounded-xl bg-white/10 border border-white/20 p-3 outline-none focus:border-red-600"
              />
              <input
                required
                placeholder="Postal Code"
                value={shipping.postal}
                onChange={(e) => setShipping((s) => ({ ...s, postal: e.target.value }))}
                className="rounded-xl bg-white/10 border border-white/20 p-3 outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/20 p-4 space-y-3">
            <p className="font-semibold">Payment Method</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="accent-red-600"
              />
              Cash on Delivery (COD)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "bank"}
                onChange={() => setPaymentMethod("bank")}
                className="accent-red-600"
              />
              Bank Transfer
            </label>
            {paymentMethod === "bank" && (
              <p className="text-sm text-white/70">
                Bank transfer details will be shared after order confirmation.
              </p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? "Processing Order..." : "Place Order"}
          </button>
        </form>

        <aside className="rounded-2xl border border-white/15 p-5 h-fit bg-white/5">
          <h2 className="text-2xl mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={getCartItemKey(item)} className="flex justify-between text-sm items-start">
                <div className="space-y-1">
                  <p className="font-medium">{item.name} x {item.quantity}</p>
                  {item.color && <p className="text-white/50 text-xs">{item.color} / {item.size}</p>}
                </div>
                <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 mt-6 pt-4 space-y-2">
            {discountPct > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Volume discount ({discountPct}%)</span>
                <span>-Rs. {discountAmt.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-red-500">Rs. {finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
