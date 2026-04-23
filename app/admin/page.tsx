"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { subscribeToAllOrders, updateOrderStatus, Order } from "@/lib/firestore-service"
import { ORDER_STATUS_STEPS, OrderStatus } from "@/components/shop-provider"
import { format } from "date-fns"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.email !== "www.abiesivan@gmail.com") {
        toast.error("Access denied. Admin only.")
        router.push("/login")
      }
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const unsubscribe = subscribeToAllOrders((fetchedOrders) => {
      setOrders(fetchedOrders)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success(`Order ${orderId} updated to ${newStatus}`)
    } catch (error: any) {
      toast.error("Failed to update status: " + error.message)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-white flex-1">
        <Header />
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <div className="text-sm text-white/50 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
            Total Orders: {orders.length}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-[#151515] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-red-500">{order.orderId}</h2>
                      <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">
                        {order.createdAt?.toDate ? format(order.createdAt.toDate(), "MMM d, HH:mm") : "Just now"}
                      </span>
                    </div>
                    <p className="text-lg font-medium">{order.name}</p>
                    <p className="text-sm text-white/60">{order.phone}</p>
                    <p className="text-sm text-white/60 max-w-md">{order.address}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <p className="text-2xl font-bold">Rs. {order.total.toFixed(2)}</p>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                      className="bg-black border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors cursor-pointer"
                    >
                      {ORDER_STATUS_STEPS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 border-t border-white/5 pt-6">
                  <div>
                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Products</h3>
                    <ul className="space-y-3">
                      {order.products.map((p, idx) => (
                        <li key={idx} className="flex justify-between items-center text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                          <div className="space-y-1">
                            <p className="font-bold">{p.name} <span className="text-red-500 ml-1">×{p.quantity}</span></p>
                            <div className="flex gap-2 text-xs text-white/40">
                              {p.color && <span>Color: {p.color}</span>}
                              {p.size && <span>Size: {p.size}</span>}
                              {p.dtfSize && <span>DTF: {p.dtfSize}</span>}
                            </div>
                          </div>
                          <p className="font-medium">Rs. {(p.price * p.quantity).toFixed(2)}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {order.imageUrl && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Custom Design</h3>
                      <div 
                        className="relative w-40 h-40 rounded-xl overflow-hidden border border-white/10 cursor-zoom-in hover:border-red-500/50 transition-all group"
                        onClick={() => setSelectedImage(order.imageUrl!)}
                      >
                        <img src={order.imageUrl} alt="Custom design" className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-xs font-bold">CLICK TO ENLARGE</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-20 bg-[#151515] border border-white/10 rounded-2xl">
              <p className="text-white/40">No orders found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            <img src={selectedImage} alt="Enlarged design" className="max-w-full max-h-full object-contain shadow-2xl" />
            <button 
              className="absolute top-0 right-0 m-4 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
