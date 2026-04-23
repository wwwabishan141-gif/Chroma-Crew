"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { getAllOrders, updateOrderStatus, type Order } from "@/lib/supabase-service"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { toast } from "sonner"

const ADMIN_EMAIL = "www.abiesivan@gmail.com"

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user?.email === ADMIN_EMAIL) {
        try {
          const allOrders = await getAllOrders()
          setOrders(allOrders)
        } catch (err) {
          toast.error("Failed to load orders")
        }
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(o => o.order_id === orderId ? { ...o, status: newStatus as any } : o))
      toast.success(`Order ${orderId} updated to ${newStatus}`)
    } catch (err) {
      toast.error("Failed to update status")
    }
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full" /></div>

  if (user?.email !== ADMIN_EMAIL) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-white/50">This area is for authorized administrators only.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <Header currentPage="admin" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <h1 className="text-4xl font-bold mb-10">Admin Dashboard</h1>

        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order.order_id} className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{order.order_id}</h2>
                    <p className="text-sm text-white/40">{format(new Date(order.created_at!), "MMM d, yyyy HH:mm")}</p>
                  </div>
                  <p className="text-2xl font-bold text-red-500">Rs. {order.total.toFixed(2)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Customer</p>
                    <p className="font-bold">{order.name}</p>
                    <p className="text-white/60">{order.phone}</p>
                    <p className="text-xs text-white/40 max-w-xs">{order.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Items</p>
                    <ul className="text-sm space-y-1">
                      {order.products.map((p: any, i: number) => (
                        <li key={i}>{p.name} ({p.size}/{p.color}) x{p.quantity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-64 space-y-4">
                <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Status Control</p>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {["Received", "Processing", "Printed", "Shipped", "Delivered"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(order.order_id, s)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        order.status === s 
                          ? 'bg-red-600 text-white' 
                          : 'bg-white/5 hover:bg-white/10 text-white/50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {order.image_url && (
                  <a 
                    href={order.image_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block mt-4 rounded-xl overflow-hidden border border-white/10 bg-black group relative"
                  >
                    <img src={order.image_url} alt="Design" className="w-full h-32 object-contain p-2" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold transition-opacity">
                      View Original
                    </div>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
