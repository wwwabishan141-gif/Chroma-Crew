"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { getUserOrders, type Order } from "@/lib/supabase-service"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import Link from "next/link"

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

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

  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <Header currentPage="account" />
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full" />
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Header currentPage="account" />
        <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-6">
          <h1 className="text-3xl font-bold">Please Login</h1>
          <p className="text-white/60">You need to be logged in to view your order tracking.</p>
          <Link href="/login" className="inline-block px-8 py-3 bg-red-600 rounded-xl font-bold hover:bg-red-700 transition-colors">
            Login Now
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <Header currentPage="account" />
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-1">My Account</h1>
            <p className="text-white/50">{user.email}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/30 uppercase tracking-widest">Total Orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
        </div>

        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-white/10 p-10 text-center bg-white/5">
              <p className="text-white/50 mb-4">You haven't placed any orders yet.</p>
              <Link href="/shop" className="text-red-500 font-bold hover:underline">Start Shopping →</Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.order_id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <div>
                    <p className="text-xl font-bold">{order.order_id}</p>
                    <p className="text-xs text-white/40">{format(new Date(order.created_at!), "MMMM d, yyyy")}</p>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-xs font-bold border ${
                    order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                    order.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="p-6 flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Items</p>
                      <ul className="space-y-1">
                        {order.products.map((p: any, i: number) => (
                          <li key={i} className="text-sm">
                            <span className="text-white font-medium">{p.name}</span>
                            <span className="text-white/40 ml-2">({p.size}/{p.color}) x{p.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2">
                      <p className="text-lg font-bold text-red-500">Rs. {order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  {order.image_url && (
                    <div className="shrink-0">
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2 text-right md:text-left">Design</p>
                      <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 bg-black">
                        <img src={order.image_url} alt="Custom Design" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Tracker */}
                <div className="px-6 pb-8">
                  <div className="relative h-1 bg-white/10 rounded-full mt-6">
                    <div 
                      className="absolute top-0 left-0 h-full bg-red-600 rounded-full transition-all duration-1000"
                      style={{ 
                        width: order.status === 'Delivered' ? '100%' : 
                               order.status === 'Shipped' ? '75%' : 
                               order.status === 'Printed' ? '50%' :
                               order.status === 'Processing' ? '25%' : '5%' 
                      }}
                    />
                    <div className="flex justify-between mt-3 text-[9px] uppercase tracking-tighter text-white/30 font-bold">
                      <span>Received</span>
                      <span>Processing</span>
                      <span>Printed</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
