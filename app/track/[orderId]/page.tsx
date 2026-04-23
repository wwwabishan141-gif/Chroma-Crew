"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { ORDER_STATUS_STEPS, type OrderStatus } from "@/components/shop-provider"
import { format } from "date-fns"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Order } from "@/lib/firestore-service"

const STEP_LABELS: Record<OrderStatus, string> = {
  Received: "Received",
  Processing: "Processing",
  Printed: "Printed",
  Shipped: "Shipped",
  Delivered: "Delivered",
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  Received: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Processing: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Printed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Shipped: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Delivered: "bg-green-500/10 text-green-400 border-green-500/20",
}

function OrderTimeline({ status }: { status: OrderStatus }) {
  const activeIndex = ORDER_STATUS_STEPS.indexOf(status)
  return (
    <div className="relative mt-8 mb-12 sm:mb-14 max-w-2xl mx-auto">
      {/* Background Line */}
      <div className="absolute top-3 sm:top-4 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full" />
      
      {/* Progress Line */}
      <div 
        className="absolute top-3 sm:top-4 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-700" 
        style={{ width: `${(activeIndex / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
      />
      
      {/* Nodes */}
      <ol className="relative z-10 flex justify-between w-full">
        {ORDER_STATUS_STEPS.map((step, i) => {
          const done = i <= activeIndex
          const current = i === activeIndex
          return (
            <li key={step} className="relative flex flex-col items-center">
              <span
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-500 ${
                  done 
                    ? "bg-green-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.5)] border border-green-400" 
                    : "bg-[#1A1A1A] text-white/30 border border-white/20"
                } ${current ? "ring-4 ring-green-500/20" : ""}`}
              >
                {done ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3 sm:w-4 sm:h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className={`absolute top-8 sm:top-10 text-[10px] sm:text-xs font-medium w-20 text-center left-1/2 -translate-x-1/2 ${
                current ? "text-green-400 font-bold" : done ? "text-white/80" : "text-white/40"
              }`}>
                {STEP_LABELS[step]}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default function TrackOrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const unwrappedParams = use(params)
  const { orderId } = unwrappedParams
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const orderRef = doc(db, "orders", orderId)
    const unsubscribe = onSnapshot(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        setOrder({ id: snapshot.id, ...snapshot.data() } as Order)
      } else {
        setOrder(null)
      }
      setLoading(false)
    })
    
    return () => unsubscribe()
  }, [orderId])
  
  if (loading) {
    return (
      <main className="min-h-screen bg-background text-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-background text-white flex flex-col">
        <Header />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-4">
          <h1 className="text-3xl font-bold">Order Not Found</h1>
          <p className="text-white/60">
            We couldn't find an order with ID <strong className="text-white">{orderId}</strong>.
          </p>
          <div className="pt-6 flex justify-center gap-4">
            <Link href="/account" className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 font-medium">
              View My Account
            </Link>
            <Link href="/shop" className="px-5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header />
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>
        
        <div className="rounded-2xl border border-white/12 p-5 sm:p-8 space-y-8 bg-[#151515]">
          <div className="flex flex-wrap justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="text-white/50 text-sm mb-1">Order Reference</p>
              <div className="flex items-center gap-3">
                <p className="font-bold text-xl">{order.orderId}</p>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border uppercase tracking-wider ${STATUS_COLORS[order.status]}`}>
                  {STEP_LABELS[order.status]}
                </span>
              </div>
              <p className="text-white/50 text-sm mt-2">
                Placed on {order.createdAt?.toDate ? format(order.createdAt.toDate(), "MMM d, yyyy HH:mm") : "Just now"}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-white/50 text-sm mb-1">Total Amount</p>
              <p className="text-red-400 font-bold text-xl">Rs. {order.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="py-6">
            <OrderTimeline status={order.status} />
          </div>

          <div className="border-t border-white/10 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-white/90">Shipping Details</h3>
              <div className="text-sm text-white/60 space-y-1">
                <p className="text-white font-medium">{order.name}</p>
                <p className="whitespace-pre-line">{order.address}</p>
                <p className="pt-2">{order.phone}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3 text-white/90">Items Ordered</h3>
              <ul className="text-sm text-white/60 space-y-2">
                {order.products.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-start gap-4">
                    <span>
                      {item.name} <span className="text-white/30">×{item.quantity}</span>
                      {item.dtfSize && <span className="block text-xs text-white/30 mt-0.5">Size: {item.dtfSize}</span>}
                    </span>
                    <span className="shrink-0">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {order.imageUrl && (
            <div className="border-t border-white/10 pt-6">
              <h3 className="font-semibold text-lg mb-4 text-white/90">Custom Design</h3>
              <a href={order.imageUrl} target="_blank" rel="noreferrer" className="inline-block relative w-32 h-32 rounded-xl overflow-hidden border border-white/10 hover:border-red-500/50 transition-colors shadow-lg">
                <img src={order.imageUrl} alt="Custom design" className="object-cover w-full h-full" />
              </a>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm mb-4">Have a question about your order?</p>
          <a
            href={`https://wa.me/94763425409?text=Hi%2C+I+have+a+question+about+my+order+${order.orderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contact Support via WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}
