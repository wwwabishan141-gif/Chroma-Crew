"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import {
  getCartItemKey,
  ORDER_STATUS_STEPS,
  type OrderStatus,
  useShop,
} from "@/components/shop-provider"
import { useMemo, useState } from "react"
import { format } from "date-fns"
import { useAuth } from "@/hooks/use-auth"

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

export default function AccountPage() {
  const { orders, downloads } = useShop()
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<"orders" | "downloads">("orders")

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-white flex-1">
        <Header currentPage="account" />
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header currentPage="account" />
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
        <h1 className="text-4xl font-bold mb-2">My account</h1>
        {!user ? (
          <div className="rounded-xl border border-white/15 p-6 mt-6 space-y-4">
            <p className="text-white/70">Sign in to view your orders and track their status in real-time.</p>
            <Link href="/login" className="inline-flex px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-medium">
              Login
            </Link>
          </div>
        ) : (
          <p className="text-white/60 mb-6">Welcome back, {user.displayName || user.email}.</p>
        )}

        <div className="flex gap-2 border-b border-white/15 mb-6">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === "orders" ? "border-red-500 text-white" : "border-transparent text-white/50"
            }`}
            onClick={() => setTab("orders")}
          >
            Order tracking
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === "downloads" ? "border-red-500 text-white" : "border-transparent text-white/50"
            }`}
            onClick={() => setTab("downloads")}
          >
            Download history
          </button>
        </div>

        {tab === "orders" && (
          <div className="space-y-6">
            {!user ? (
              <p className="text-white/60 italic">Please login to see your orders.</p>
            ) : orders.length === 0 ? (
              <p className="text-white/60">
                No orders yet.{" "}
                <Link href="/shop" className="text-red-500 underline">
                  Browse the shop
                </Link>
                .
              </p>
            ) : (
              orders.map((order) => {
                return (
                  <div key={order.orderId} className="rounded-2xl border border-white/12 p-5 space-y-3 bg-white/5">
                    <div className="flex flex-wrap justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-lg">{order.orderId}</p>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border uppercase tracking-wider ${STATUS_COLORS[order.status]}`}>
                            {STEP_LABELS[order.status]}
                          </span>
                        </div>
                        <p className="text-white/50 text-sm mt-1">
                          {order.createdAt?.toDate ? format(order.createdAt.toDate(), "MMM d, yyyy HH:mm") : "Just now"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-400 font-semibold">Rs. {order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    <OrderTimeline status={order.status} />

                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs text-white/40 mb-2 uppercase tracking-widest">Items</p>
                      <ul className="text-sm text-white/65 space-y-1">
                        {order.products.map((item, idx) => (
                          <li key={idx}>
                            {item.name} × {item.quantity}
                            {item.dtfSize ? ` (${item.dtfSize})` : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {order.imageUrl && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-xs text-white/40 mb-2 uppercase tracking-widest">Custom Design</p>
                        <a href={order.imageUrl} target="_blank" rel="noreferrer" className="inline-block relative w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                           <img src={order.imageUrl} alt="Design" className="object-cover w-full h-full" />
                        </a>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {tab === "downloads" && (
          <div className="space-y-3">
            {downloads.length === 0 ? (
              <p className="text-white/60">
                Purchase includes digital guides — they appear here after checkout.
              </p>
            ) : (
              downloads.map((d) => (
                <div
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/12 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{d.title}</p>
                    <p className="text-white/45 text-xs">{format(new Date(d.createdAt), "MMM d, yyyy")}</p>
                  </div>
                  <Link href={d.href} className="text-sm text-red-500 hover:underline">
                    Open
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  )
}
