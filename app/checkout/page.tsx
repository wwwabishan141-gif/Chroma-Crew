"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/header"
import { PageHeader } from "@/components/page-header"
import { CartItemImage } from "@/components/cart-item-image"
import { getCartItemKey, useShop } from "@/components/shop-provider"
import { createOrder, uploadDesign, base64ToFile } from "@/lib/supabase-service"
import { toast } from "sonner"
import { validateShippingForm } from "@/lib/validators"
import { supabase } from "@/lib/supabase"

const PAYHERE_MERCHANT_ID = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || ""
// Use sandbox for testing, switch to www.payhere.lk for live
const PAYHERE_BASE = process.env.NEXT_PUBLIC_PAYHERE_SANDBOX === "true"
  ? "https://sandbox.payhere.lk/pay/checkout"
  : "https://www.payhere.lk/pay/checkout"

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useShop()
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank" | "payhere">("cod")
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
  })
  const [waLink, setWaLink] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("shipping_info")
    if (saved) {
      try {
        setShipping(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse shipping info", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("shipping_info", JSON.stringify(shipping))
    }
  }, [shipping, isLoaded])

  // Volume discount tiers
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0)
  const discountPct = totalQty >= 50 ? 20 : totalQty >= 25 ? 15 : totalQty >= 10 ? 10 : totalQty >= 5 ? 5 : 0
  const discountAmt = cartTotal * (discountPct / 100)
  const finalTotal = cartTotal - discountAmt

  const generateOrderId = () => `ORBYT-${Math.floor(100000 + Math.random() * 900000)}`

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
      let allImageUrls: string[] = []
      
      if (customItem) {
        if (customItem.customImages && customItem.customImages.length > 0) {
          const uploadToast = toast.loading(`Uploading ${customItem.customImages.length} design(s)...`)
          try {
            for (let i = 0; i < customItem.customImages.length; i++) {
              const design = customItem.customImages[i]
              const file = base64ToFile(design.image, `design-${i}.png`)
              const uploadedUrl = await uploadDesign(`${newOrderId}-${design.placement.replace(/\s+/g, '')}`, file)
              allImageUrls.push(`${design.placement}: ${uploadedUrl}`)
            }
            imageUrl = allImageUrls[0].split(': ')[1]
            toast.dismiss(uploadToast)
            toast.success("Designs uploaded!")
          } catch (uploadErr: any) {
            toast.dismiss(uploadToast)
            const msg = uploadErr?.message || "Unknown error"
            toast.error(`Upload failed: ${msg}`, { duration: 10000 })
            console.error("UPLOAD DEBUG:", uploadErr)
          }
        } else if (customItem.customImage) {
           const uploadToast = toast.loading("Uploading your design...")
           const file = base64ToFile(customItem.customImage, "design.png")
           try {
             imageUrl = await uploadDesign(newOrderId, file)
             allImageUrls.push(`Design: ${imageUrl}`)
             toast.dismiss(uploadToast)
             toast.success("Design uploaded!")
           } catch (uploadErr: any) {
             toast.dismiss(uploadToast)
             const msg = uploadErr?.message || "Unknown error"
             toast.error(`Upload failed: ${msg}`, { duration: 10000 })
             console.error("UPLOAD DEBUG:", uploadErr)
           }
        }
      }

      const { data: { user } } = await supabase.auth.getUser()

      const orderData = {
        order_id: newOrderId,
        user_id: user ? user.id : null,
        name: shipping.fullName,
        phone: shipping.phone,
        address: `${shipping.address}, ${shipping.city}, ${shipping.state}`,
        products: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size,
          dtfSize: item.dtfSize,
          fit: item.fit
        })),
        total: finalTotal,
        image_url: imageUrl,
        status: "Received" as const,
        payment_method: paymentMethod,
        payment_status: paymentMethod === "payhere" ? "pending" : "unpaid",
      }

      // Save to Supabase
      await createOrder(orderData)

      // ─── PayHere online payment flow ───
      if (paymentMethod === "payhere") {
        try {
          // Get hash from server
          const hashRes = await fetch("/api/payhere-hash", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              merchant_id: PAYHERE_MERCHANT_ID,
              order_id: newOrderId,
              amount: finalTotal,
              currency: "LKR",
            }),
          })
          const { hash } = await hashRes.json()

          if (!hash) {
            toast.error("Payment setup failed. Please try again or use another payment method.")
            setIsSubmitting(false)
            return
          }

          // Build the PayHere form and auto-submit
          const form = document.createElement("form")
          form.method = "POST"
          form.action = PAYHERE_BASE

          const fields: Record<string, string> = {
            merchant_id: PAYHERE_MERCHANT_ID,
            return_url: `${window.location.origin}/account`,
            cancel_url: `${window.location.origin}/checkout`,
            notify_url: `${window.location.origin}/api/payhere-notify`,
            order_id: newOrderId,
            items: cart.map(i => i.name).join(", "),
            currency: "LKR",
            amount: finalTotal.toFixed(2),
            first_name: shipping.fullName.split(" ")[0] || shipping.fullName,
            last_name: shipping.fullName.split(" ").slice(1).join(" ") || "",
            email: shipping.email,
            phone: shipping.phone,
            address: shipping.address,
            city: shipping.city,
            country: "Sri Lanka",
            hash: hash,
          }

          Object.entries(fields).forEach(([key, val]) => {
            const input = document.createElement("input")
            input.type = "hidden"
            input.name = key
            input.value = val
            form.appendChild(input)
          })

          document.body.appendChild(form)
          clearCart()
          form.submit()
          return
        } catch (payErr: any) {
          toast.error("Payment error: " + payErr.message)
          setIsSubmitting(false)
          return
        }
      }
      
      // ─── COD / Bank Transfer flow (WhatsApp confirmation) ───
      const productList = cart.map(i => {
        let details = `• ${i.name} (${i.size || 'N/A'}/${i.color || 'N/A'}/${i.fit || 'Regular Fit'}) x${i.quantity}`
        if (i.dtfSize || i.customPlacement) {
          let customDetails = []
          if (i.dtfSize) customDetails.push(`DTF: ${i.dtfSize}`)
          if (i.customPlacement) customDetails.push(`Pos: ${i.customPlacement}`)
          details += `\n  ↳ [ ${customDetails.join(" | ")} ]`
        }
        return details
      }).join("\n")
      const paymentLabel = paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'
      
      const text = `*New Order: ${newOrderId}*\n\n` +
                   `*Customer Details:*\n` +
                   `Name: ${shipping.fullName}\n` +
                   `Phone: ${shipping.phone}\n` +
                   `Address: ${shipping.address}, ${shipping.city}, ${shipping.state}\n\n` +
                   `*Products:*\n${productList}\n\n` +
                   `*Total: Rs. ${finalTotal.toFixed(2)}*\n` +
                   `Payment: ${paymentLabel}\n\n` +
                   `*Design Images:*\n` +
                   (allImageUrls.length > 0 ? allImageUrls.join('\n') : "None") + `\n\n` +
                   `Please confirm my order. Thank you! 🙏`
      
      const link = `https://wa.me/94751297637?text=${encodeURIComponent(text)}`
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
        <div className="page-container max-w-lg text-center">
          <div className="empty-state space-y-5 border-red-600/25">
            <div className="w-16 h-16 bg-red-600/15 rounded-full flex items-center justify-center mx-auto border border-red-600/30">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight">Order Confirmed</h1>
            <p className="text-white/60">
              Your reference: <strong className="text-white">{orderId}</strong>
            </p>
            <div className="page-card p-6 text-left border-red-600/20 space-y-4">
              <p className="font-bold text-red-400">Action Required: Confirm on WhatsApp</p>
              <p className="text-white/60 text-sm">
                Your order has been saved. To finalize and start production, send the confirmation to our WhatsApp.
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full gap-2"
              >
                Confirm on WhatsApp
              </a>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/account" className="btn-secondary text-sm">
                Track Order
              </Link>
              <Link href="/shop" className="btn-primary text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header currentPage="shop" />
      <div className="page-container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <PageHeader
            badge="Checkout"
            title="Complete Order"
            description="Finalizing your order on orbyt.lk"
            centered={false}
          />

          <div className="space-y-4">
            <p className="form-label-orbyt">Shipping Details</p>
            <input
              required
              placeholder="Full Name"
              value={shipping.fullName}
              onChange={(e) => setShipping((s) => ({ ...s, fullName: e.target.value }))}
              className="input-orbyt"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                type="email"
                placeholder="Email Address"
                value={shipping.email}
                onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
                className="input-orbyt"
              />
              <input
                required
                placeholder="Phone Number"
                value={shipping.phone}
                onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                className="input-orbyt"
              />
            </div>
            <textarea
              required
              placeholder="Shipping Address"
              value={shipping.address}
              onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
              className="input-orbyt min-h-24 resize-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="City"
                value={shipping.city}
                onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                className="input-orbyt"
              />
              <input
                required
                placeholder="Province"
                value={shipping.state}
                onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))}
                className="input-orbyt"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="form-label-orbyt">Payment Method</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-red-600 bg-red-600/10' : 'border-white/10 bg-white/[0.02] hover:border-red-600/30'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="w-5 h-5 accent-red-600"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-white">Cash on Delivery</span>
                  <span className="text-xs text-white/50">Pay when you receive</span>
                </div>
              </label>
              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-red-600 bg-red-600/10' : 'border-white/10 bg-white/[0.02] hover:border-red-600/30'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="w-5 h-5 accent-red-600"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-white">Bank Transfer</span>
                  <span className="text-xs text-white/50">Details shared after confirm</span>
                </div>
              </label>
              {/* --- PAYHERE TEMPORARILY DISABLED UNTIL DOMAIN PURCHASE ---
              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'payhere' ? 'border-green-500 bg-green-600/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "payhere"}
                  onChange={() => setPaymentMethod("payhere")}
                  className="w-5 h-5 accent-green-500"
                />
                <div className="flex flex-col">
                  <span className="font-bold">Pay Online</span>
                  <span className="text-xs text-white/50">Card / Bank — via PayHere</span>
                </div>
              </label>
              */}
            </div>
            {paymentMethod === "payhere" && (
              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-green-300/80 text-sm flex items-start gap-3">
                <span className="text-lg mt-0.5">🔒</span>
                <div>
                  <p className="font-bold text-green-400 mb-1">Secure Online Payment</p>
                  <p className="text-xs text-green-300/60">You'll be redirected to PayHere's secure payment page. Your card details are never stored on our website. Supports Visa, Mastercard, and local bank payments.</p>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || cart.length === 0}
            className="btn-primary w-full py-4 text-lg disabled:opacity-50"
          >
            {isSubmitting
              ? "Processing..."
              : paymentMethod === "payhere"
                ? "Pay Online Now"
                : "Place Order"}
          </button>
        </form>

        <aside className="space-y-6">
          <div className="page-card p-6 border-red-600/15 sticky top-28">
            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-6">Order Summary</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={getCartItemKey(item)} className="flex gap-3 items-start">
                  <CartItemImage item={item} size="sm" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-bold text-white text-sm leading-tight">{item.name}</p>
                    <p className="text-white/45 text-xs">
                      {[item.size, item.color, item.fit].filter(Boolean).join(" · ")} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-red-400 text-sm whitespace-nowrap">
                    Rs. {(item.price * item.quantity).toLocaleString("en-LK")}
                  </span>
                </div>
              ))}
            </div>

            {discountPct > 0 && (
              <div className="flex justify-between text-sm text-white/60 mt-4 pt-4 border-t border-white/10">
                <span>Volume discount ({discountPct}%)</span>
                <span className="text-red-400">- Rs. {discountAmt.toLocaleString("en-LK")}</span>
              </div>
            )}

            <div className="border-t border-white/10 mt-4 pt-4 flex justify-between items-center">
              <span className="text-white/60 uppercase text-xs tracking-widest font-semibold">Total</span>
              <span className="text-2xl font-black text-white">Rs. {finalTotal.toLocaleString("en-LK")}</span>
            </div>
          </div>
        </aside>
        </div>
      </div>
    </main>
  )
}
