"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import {
  getUserOrders,
  getOrderTimeline,
  type Order,
  type OrderTimelineEntry,
} from "@/lib/supabase-service"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import Link from "next/link"
import { OrderInvoice } from "@/components/order-invoice"

const WHATSAPP_NUMBER = "94751297637"

const STATUS_STEPS = ["Received", "Processing", "Printed", "Shipped", "Delivered"] as const

const STATUS_META: Record<string, { icon: string; color: string; bg: string; border: string }> = {
  Received:   { icon: "📦", color: "text-white/70",    bg: "bg-white/5",    border: "border-white/20" },
  Processing: { icon: "⚙️",  color: "text-red-300",   bg: "bg-red-600/10", border: "border-red-600/25" },
  Printed:    { icon: "🖨️",  color: "text-red-400",   bg: "bg-red-600/15", border: "border-red-600/30" },
  Shipped:    { icon: "🚚",  color: "text-red-400",   bg: "bg-red-600/20", border: "border-red-600/35" },
  Delivered:  { icon: "✅",  color: "text-white",      bg: "bg-red-600",    border: "border-red-600" },
}

function ProgressTracker({ status }: { status: string }) {
  const currentIdx = STATUS_STEPS.indexOf(status as any)

  return (
    <div className="pt-2 pb-4 px-1">
      {/* Step circles */}
      <div className="relative flex items-center justify-between">
        {/* Connecting line behind circles */}
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-white/10 z-0" />
        <div
          className="absolute top-5 left-0 h-[2px] bg-gradient-to-r from-red-900 to-red-500 z-0 transition-all duration-700"
          style={{ width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
        />

        {STATUS_STEPS.map((step, idx) => {
          const done = idx < currentIdx
          const active = idx === currentIdx
          const meta = STATUS_META[step]
          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-500 ${
                  done
                    ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/30"
                    : active
                    ? `${meta.bg} ${meta.border} shadow-lg shadow-red-600/25`
                    : "bg-white/5 border-white/10"
                }`}
              >
                {done ? "✓" : meta.icon}
              </div>
              <span
                className={`text-[9px] uppercase tracking-widest font-bold ${
                  done ? "text-red-400" : active ? meta.color : "text-white/25"
                }`}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TimelineSection({ orderId }: { orderId: string }) {
  const [timeline, setTimeline] = useState<OrderTimelineEntry[]>([])
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const loadTimeline = async () => {
    if (loaded) { setOpen(!open); return }
    const data = await getOrderTimeline(orderId)
    setTimeline(data)
    setLoaded(true)
    setOpen(true)
  }

  return (
    <div className="border-t border-white/5 px-6 pt-4 pb-5">
      <button
        onClick={loadTimeline}
        className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors font-medium"
      >
        <span>{open ? "▾" : "▸"}</span>
        Order Timeline
      </button>
      {open && (
        <div className="mt-4 space-y-3">
          {timeline.length === 0 ? (
            <p className="text-white/30 text-xs">No timeline entries yet.</p>
          ) : (
            timeline.map((entry, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="mt-1 flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-600" />
                  {i < timeline.length - 1 && <div className="w-px h-6 bg-white/10" />}
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">{entry.status}</p>
                  {entry.note && <p className="text-white/50 text-xs mt-0.5">{entry.note}</p>}
                  <p className="text-white/25 text-[10px] mt-0.5">
                    {entry.created_at ? format(new Date(entry.created_at), "MMM d, yyyy · h:mm a") : ""}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        try {
          const userOrders = await getUserOrders(user.id)
          setOrders(userOrders)
        } catch (err) {
          console.error("Error fetching orders:", err)
        }
      }
      setLoading(false)
    }
    fetchSession()
  }, [])

  const handleContactSupport = (orderId: string) => {
    const msg = `Hi ORBYT! I need help with my order *${orderId}*. Could you please assist me?`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank")
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex-1">
        <Header currentPage="account" />
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full" />
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background text-white flex-1">
        <Header currentPage="account" />
        <div className="page-container max-w-lg text-center">
          <div className="empty-state space-y-5">
            <h1 className="text-3xl font-black uppercase tracking-tight">Please Login</h1>
            <p className="text-white/60">Sign in to view your order tracking and history.</p>
            <Link href="/login" className="btn-primary">
              Login Now
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-white flex-1 pb-24">
      <Header currentPage="account" />

      {invoiceOrder && (
        <OrderInvoice order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
      )}

      <div className="page-container max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 md:mb-12">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full border border-red-600/40 bg-red-600/10 text-red-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Account
            </span>
            <h1 className="text-3xl md:text-4xl text-white font-black tracking-tight uppercase">My Orders</h1>
            <p className="text-white/50 text-sm">{user.email}</p>
          </div>
          <div className="text-right px-5 py-3 rounded-2xl page-card border-red-600/20 shrink-0">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Total Orders</p>
            <p className="text-2xl font-black text-red-400">{orders.length}</p>
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="empty-state space-y-4">
              <p className="text-4xl">🛒</p>
              <p className="text-white/60">You haven&apos;t placed any orders yet.</p>
              <Link href="/shop" className="btn-primary text-sm">
                Start Shopping →
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const meta = STATUS_META[order.status] ?? STATUS_META["Received"]
              return (
                <div
                  key={order.order_id}
                  className="page-card overflow-hidden border-red-600/10"
                >
                  {/* Card header */}
                  <div className="px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/[0.06]">
                    <div>
                      <p className="text-xl font-bold tracking-tight">{order.order_id}</p>
                      <p className="text-xs text-white/35 mt-0.5">
                        Placed {order.created_at ? format(new Date(order.created_at), "MMMM d, yyyy") : ""}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border ${meta.bg} ${meta.color} ${meta.border}`}
                    >
                      {meta.icon} {order.status}
                    </span>
                  </div>

                  {/* Progress tracker */}
                  <div className="px-6 pt-5">
                    <ProgressTracker status={order.status} />
                  </div>

                  {/* Estimated delivery */}
                  {order.estimated_delivery && (
                    <div className="px-6 pb-3">
                      <p className="inline-flex items-center gap-2 text-xs text-white/50 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                        📅 Estimated delivery:{" "}
                        <span className="text-white font-semibold">
                          {format(new Date(order.estimated_delivery), "EEEE, MMMM d, yyyy")}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Admin notes */}
                  {order.admin_notes && (
                    <div className="px-6 pb-3">
                      <div className="rounded-xl bg-red-600/5 border border-red-600/20 px-4 py-3 text-sm text-white/80">
                        <span className="font-bold text-red-400 text-xs uppercase tracking-widest block mb-1">
                          📋 Note from ORBYT
                        </span>
                        {order.admin_notes}
                      </div>
                    </div>
                  )}

                  {/* Items & design */}
                  <div className="px-6 pb-5 flex flex-col md:flex-row gap-6 justify-between">
                    <div className="flex-1 space-y-3">
                      <p className="text-[10px] text-white/30 uppercase tracking-widest">Items</p>
                      <ul className="space-y-1.5">
                        {order.products.map((p: any, i: number) => (
                          <li key={i} className="text-sm flex items-baseline gap-2">
                            <span className="text-white font-medium">{p.name}</span>
                            <span className="text-white/35 text-xs">
                              ({[p.size, p.color, p.fit, p.dtfSize].filter(Boolean).join(" · ")}) ×{p.quantity}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xl font-bold text-white pt-1">
                        Rs. {order.total.toLocaleString("en-LK")}
                      </p>
                    </div>
                    {order.image_url && (
                      <div className="shrink-0">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Design</p>
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 bg-black/50">
                          <img
                            src={order.image_url}
                            alt="Custom Design"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="px-6 pb-5 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
                    <button
                      onClick={() => handleContactSupport(order.order_id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/10 border border-red-600/25 text-red-400 text-xs font-bold hover:bg-red-600/20 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.858L0 24l6.335-1.54A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.847 0-3.575-.5-5.065-1.371l-.363-.214-3.76.915.947-3.657-.236-.375A9.947 9.947 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                      </svg>
                      Contact Support
                    </button>
                    <button
                      onClick={() => setInvoiceOrder(order)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold hover:bg-white/10 hover:text-white transition-colors"
                    >
                      🧾 Download Invoice
                    </button>
                  </div>

                  {/* Timeline */}
                  <TimelineSection orderId={order.order_id} />
                </div>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}
