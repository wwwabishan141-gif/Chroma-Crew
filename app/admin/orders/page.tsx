"use client"

import { useEffect, useState, useMemo } from "react"
import { Header } from "@/components/header"
import { getAllOrders, updateOrderStatus, updateOrderNotes, updateEstimatedDelivery, type Order } from "@/lib/supabase-service"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { toast } from "sonner"

const ADMIN_EMAIL = "www.abiesivan@gmail.com"

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")

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

  const handleNotesChange = async (orderId: string, notes: string) => {
    try {
      await updateOrderNotes(orderId, notes)
      setOrders(orders.map(o => o.order_id === orderId ? { ...o, admin_notes: notes } : o))
      toast.success("Notes saved")
    } catch (err) {
      toast.error("Failed to save notes")
    }
  }

  const handleDeliveryChange = async (orderId: string, date: string) => {
    try {
      await updateEstimatedDelivery(orderId, date)
      setOrders(orders.map(o => o.order_id === orderId ? { ...o, estimated_delivery: date } : o))
      toast.success("Estimated delivery updated")
    } catch (err) {
      toast.error("Failed to update estimated delivery")
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.order_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            o.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "All" || o.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [orders, searchTerm, statusFilter])

  // Statistics
  const stats = useMemo(() => {
    const pending = orders.filter(o => o.status === "Received" || o.status === "Processing").length
    const printed = orders.filter(o => o.status === "Printed").length
    const shipped = orders.filter(o => o.status === "Shipped").length
    const delivered = orders.filter(o => o.status === "Delivered").length
    const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

    return { total: orders.length, pending, printed, shipped, delivered, revenue }
  }, [orders])

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
    <main className="min-h-screen bg-[#050505] text-white pb-24">
      <Header currentPage="admin" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-10">
        
        {/* Header & Stats */}
        <div>
          <h1 className="text-4xl font-bold mb-6 tracking-tight">Admin Dashboard</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-yellow-400/60 uppercase tracking-widest mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-purple-400/60 uppercase tracking-widest mb-1">In Production</p>
              <p className="text-2xl font-bold text-purple-400">{stats.printed}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-orange-400/60 uppercase tracking-widest mb-1">Shipped</p>
              <p className="text-2xl font-bold text-orange-400">{stats.shipped}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-green-400/60 uppercase tracking-widest mb-1">Delivered</p>
              <p className="text-2xl font-bold text-green-400">{stats.delivered}</p>
            </div>
            <div className="p-4 rounded-2xl bg-red-600/10 border border-red-600/20">
              <p className="text-[10px] text-red-400/80 uppercase tracking-widest mb-1">Revenue</p>
              <p className="text-lg font-bold text-red-500">Rs. {(stats.revenue / 1000).toFixed(1)}k</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5">
          <div className="flex-1 w-full">
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <div className="w-full md:w-64 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors appearance-none"
            >
              <option value="All">All Statuses</option>
              <option value="Received">Received</option>
              <option value="Processing">Processing</option>
              <option value="Printed">Printed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-white/5">
              <p className="text-white/40">No orders found matching your criteria.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.order_id} className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col xl:flex-row gap-8">
                  
                  {/* Left Column: Details */}
                  <div className="flex-1 space-y-8">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">{order.order_id}</h2>
                        <p className="text-sm text-white/40 mt-1">{format(new Date(order.created_at!), "MMM d, yyyy HH:mm")}</p>
                      </div>
                      <p className="text-3xl font-black text-red-500">Rs. {order.total.toLocaleString("en-LK")}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-2xl bg-black/40 border border-white/5">
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <span>👤</span> Customer Details
                        </p>
                        <p className="font-bold text-white mb-1">{order.name}</p>
                        <p className="text-white/60 text-sm mb-2">{order.phone}</p>
                        <p className="text-xs text-white/40 leading-relaxed">{order.address}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <span>🛍️</span> Order Items
                        </p>
                        <ul className="text-sm space-y-2">
                          {order.products.map((p: any, i: number) => (
                            <li key={i} className="flex justify-between items-start gap-2 pb-2 border-b border-white/5 last:border-0 last:pb-0">
                              <div>
                                <span className="text-white">{p.name}</span>
                                <div className="text-white/40 text-xs mt-0.5">
                                  {[p.size, p.color, p.fit, p.dtfSize].filter(Boolean).join(" · ")}
                                </div>
                              </div>
                              <span className="text-white/60 font-medium">×{p.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Admin inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Estimated Delivery Date</label>
                        <input
                          type="date"
                          value={order.estimated_delivery ? new Date(order.estimated_delivery).toISOString().split('T')[0] : ''}
                          onChange={(e) => handleDeliveryChange(order.order_id, e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Customer Notes (Visible to User)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a note..."
                            defaultValue={order.admin_notes || ""}
                            onBlur={(e) => {
                              if (e.target.value !== order.admin_notes) {
                                handleNotesChange(order.order_id, e.target.value)
                              }
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Status & Image */}
                  <div className="w-full xl:w-72 shrink-0 space-y-6">
                    <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1 text-center">Status Control</p>
                      <div className="flex flex-col gap-2">
                        {["Received", "Processing", "Printed", "Shipped", "Delivered"].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(order.order_id, s)}
                            className={`py-3 px-4 rounded-xl text-sm font-bold transition-all flex justify-between items-center ${
                              order.status === s 
                                ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 scale-[1.02]' 
                                : 'bg-white/5 hover:bg-white/10 text-white/50'
                            }`}
                          >
                            {s}
                            {order.status === s && <span>✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    {order.image_url && (
                      <div className="space-y-2">
                         <p className="text-[10px] text-white/30 uppercase tracking-widest text-center">Custom Design File</p>
                        <a 
                          href={order.image_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="block rounded-2xl overflow-hidden border border-white/10 bg-black/50 group relative aspect-square"
                        >
                          <img src={order.image_url} alt="Design" className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                            <span className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg">View Full Resolution</span>
                          </div>
                        </a>
                      </div>
                    )}
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
