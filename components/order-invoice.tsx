"use client"

import { type Order } from "@/lib/supabase-service"
import { format } from "date-fns"

interface OrderInvoiceProps {
  order: Order
  onClose: () => void
}

export function OrderInvoice({ order, onClose }: OrderInvoiceProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #invoice-print-area, #invoice-print-area * { visibility: visible !important; }
          #invoice-print-area {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            padding: 40px !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal controls */}
        <div className="no-print flex justify-between items-center px-6 pt-5 pb-3 border-b border-white/10">
          <h2 className="text-white font-bold text-lg">Invoice — {order.order_id}</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors"
            >
              🖨️ Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Invoice content */}
        <div id="invoice-print-area" className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-sm">C</div>
                <span className="text-white font-black text-xl tracking-tight">ChromaCrew</span>
              </div>
              <p className="text-white/40 text-xs">Sri Lanka's Premium DTF Print Studio</p>
              <p className="text-white/40 text-xs">+94 75 129 7637 · wa.me/94751297637</p>
            </div>
            <div className="text-right">
              <p className="text-white/30 text-[10px] uppercase tracking-widest">Invoice</p>
              <p className="text-white font-bold text-lg">{order.order_id}</p>
              <p className="text-white/40 text-xs">
                {order.created_at ? format(new Date(order.created_at), "MMMM d, yyyy") : "—"}
              </p>
            </div>
          </div>

          <div className="border-t border-white/10" />

          {/* Customer info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Bill To</p>
              <p className="text-white font-semibold">{order.name}</p>
              <p className="text-white/60 text-sm">{order.phone}</p>
              <p className="text-white/50 text-xs mt-1 leading-relaxed">{order.address}</p>
            </div>
            <div className="text-right">
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                order.status === 'Delivered' ? 'bg-green-500/15 text-green-400 border-green-500/25' :
                order.status === 'Shipped' ? 'bg-blue-500/15 text-blue-400 border-blue-500/25' :
                'bg-yellow-500/15 text-yellow-400 border-yellow-500/25'
              }`}>
                {order.status}
              </span>
              {order.estimated_delivery && (
                <p className="text-white/40 text-xs mt-2">
                  Est. Delivery: {format(new Date(order.estimated_delivery), "MMM d, yyyy")}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-white/10" />

          {/* Items table */}
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Order Items</p>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left px-4 py-3 text-white/50 text-xs font-bold uppercase tracking-wider">Item</th>
                    <th className="text-center px-4 py-3 text-white/50 text-xs font-bold uppercase tracking-wider">Qty</th>
                    <th className="text-right px-4 py-3 text-white/50 text-xs font-bold uppercase tracking-wider">Price</th>
                    <th className="text-right px-4 py-3 text-white/50 text-xs font-bold uppercase tracking-wider">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((p: any, i: number) => (
                    <tr key={i} className="border-b border-white/5 last:border-0">
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">{p.name}</p>
                        <p className="text-white/40 text-xs">
                          {[p.size, p.color, p.fit, p.dtfSize].filter(Boolean).join(' · ')}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center text-white/70">{p.quantity}</td>
                      <td className="px-4 py-3 text-right text-white/70">Rs. {p.price?.toLocaleString("en-LK") ?? "—"}</td>
                      <td className="px-4 py-3 text-right text-white font-semibold">
                        Rs. {((p.price ?? 0) * (p.quantity ?? 1)).toLocaleString("en-LK")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm text-white/50">
                <span>Subtotal</span>
                <span>Rs. {order.total.toLocaleString("en-LK")}</span>
              </div>
              <div className="flex justify-between text-sm text-white/50">
                <span>Shipping</span>
                <span>Calculated on delivery</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-lg">
                <span className="text-white">Total</span>
                <span className="text-red-500">Rs. {order.total.toLocaleString("en-LK")}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10" />

          {/* Footer */}
          <p className="text-white/25 text-[10px] text-center">
            Thank you for shopping with ChromaCrew 🎨 · All sales are final · Custom orders cannot be returned unless defective
          </p>
        </div>
      </div>
    </div>
  )
}
