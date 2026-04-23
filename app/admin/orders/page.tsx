"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { subscribeToAllOrders, updateOrderStatus, type Order } from "@/lib/firestore-service"
import { useAuth } from "@/hooks/use-auth"
import { format } from "date-fns"
import { toast } from "sonner"
import { ORDER_STATUS_STEPS, type OrderStatus } from "@/components/shop-provider"

const ADMIN_EMAIL = "www.abiesivan@gmail.com"

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      const unsubscribe = subscribeToAllOrders((fetchedOrders) => {
        setOrders(fetchedOrders)
        setLoading(false)
      })
      return () => unsubscribe()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, authLoading])

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success(`Order ${orderId} updated to ${newStatus}`)
    } catch (error: any) {
      toast.error("Failed to update status: " + error.message)
    }
  }

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Header currentPage="admin" />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full" />
        </div>
      </main>
    )
  }

  if (user?.email !== ADMIN_EMAIL) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Header currentPage="admin" />
        <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-6">
          <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="text-white/60 text-lg">
            You do not have permission to access the admin dashboard. This area is restricted to authorized administrators only.
          </p>
          <div className="pt-6">
            <a href="/" className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold transition-all">
              Return Home
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <Header currentPage="admin" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-1">Store Management</h1>
            <p className="text-white/50">Manage all incoming orders and update production status.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-center">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <div className="bg-red-600/10 border border-red-600/20 rounded-xl px-6 py-3 text-center">
              <p className="text-xs text-red-400 uppercase tracking-widest mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">Rs. {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/20 p-20 text-center">
            <p className="text-white/40">No orders found in the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div key={order.orderId} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex flex-wrap justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-white">{order.orderId}</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                        order.status === 'Shipped' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                        order.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-white/40">
                      {order.createdAt?.toDate ? format(order.createdAt.toDate(), "MMMM d, yyyy HH:mm:ss") : "Just now"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Grand Total</p>
                    <p className="text-2xl font-bold text-red-500">Rs. {order.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_0.8fr_1fr] gap-10">
                  {/* Column 1: Customer & Products */}
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Customer Info</p>
                      <div className="space-y-1">
                        <p className="font-bold text-lg">{order.name}</p>
                        <p className="text-white/70">{order.phone}</p>
                        <p className="text-white/50 text-sm leading-relaxed max-w-sm">{order.address}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Order Items</p>
                      <div className="space-y-2">
                        {order.products.map((p, i) => (
                          <div key={i} className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0">
                            <span className="text-white/80">{p.name} × {p.quantity}</span>
                            <span className="text-white/40">{p.size} / {p.color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Design Preview */}
                  <div className="space-y-4">
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Design Preview</p>
                    {order.imageUrl ? (
                      <div className="group relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
                        <img src={order.imageUrl} alt="Custom Design" className="w-full h-full object-contain" />
                        <a 
                          href={order.imageUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm font-bold"
                        >
                          View Original High-Res
                        </a>
                      </div>
                    ) : (
                      <div className="aspect-square rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-white/20 text-xs">
                        No Custom Design
                      </div>
                    )}
                  </div>

                  {/* Column 3: Status Actions */}
                  <div className="space-y-4">
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Update Progress</p>
                    <div className="grid grid-cols-1 gap-2">
                      {ORDER_STATUS_STEPS.map((step) => (
                        <button
                          key={step}
                          onClick={() => handleStatusUpdate(order.orderId, step)}
                          disabled={order.status === step}
                          className={`w-full py-3 rounded-xl text-xs font-bold transition-all active:scale-[0.98] ${
                            order.status === step 
                              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                              : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {order.status === step ? `✓ Current: ${step}` : `Move to ${step}`}
                        </button>
                      ))}
                    </div>
                    <div className="pt-4">
                      <a 
                        href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-green-600/40 text-green-400 hover:bg-green-600/10 text-xs font-bold transition-all"
                      >
                        Contact Customer via WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
