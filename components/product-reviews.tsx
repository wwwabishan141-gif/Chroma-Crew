"use client"

import { useState, useEffect } from "react"
import { Star, Send, User } from "lucide-react"
import { getProductReviews, addReview, type Review } from "@/lib/supabase-service"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { format } from "date-fns"

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      try {
        const data = await getProductReviews(productId)
        setReviews(data)
      } catch (err) {
        console.error("Failed to load reviews")
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error("Please login to leave a review")
      return
    }
    if (!comment.trim()) return

    setSubmitting(true)
    try {
      const newReview = await addReview({
        product_id: productId,
        user_id: user.id,
        user_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "Customer",
        rating,
        comment: comment.trim(),
      })
      setReviews([newReview, ...reviews])
      setComment("")
      setRating(5)
      toast.success("Review posted! Thanks for your feedback.")
    } catch (err) {
      toast.error("Failed to post review")
    } finally {
      setSubmitting(false)
    }
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null

  if (loading) return <div className="py-20 text-center text-white/40">Loading reviews...</div>

  return (
    <section className="mt-20 border-t border-white/10 pt-16">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12">
        {/* Left Side: Summary & Form */}
        <div className="w-full md:w-1/3 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Customer Reviews</h2>
            {averageRating ? (
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(Number(averageRating)) ? "fill-current" : "text-white/10"}`} />
                  ))}
                </div>
                <span className="text-white font-bold text-xl">{averageRating}</span>
                <span className="text-white/40 text-sm">({reviews.length} reviews)</span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-white/40">Honest Truth: We currently have 0 reviews.</p>
                <p className="text-red-500/80 text-sm font-medium italic">Be the very first to share your experience!</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white">Write a Review</h3>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="p-1 transition-transform active:scale-90"
                >
                  <Star className={`w-6 h-6 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-white/20"}`} />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Your thoughts on this product..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-red-600 transition-colors h-32 resize-none"
              required
            />
            <button
              disabled={submitting}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? "Posting..." : <><Send className="w-4 h-4" /> Post Review</>}
            </button>
            {!user && <p className="text-[10px] text-center text-white/40 uppercase tracking-widest pt-2">Login required to post</p>}
          </form>
        </div>

        {/* Right Side: List */}
        <div className="w-full md:w-2/3 space-y-6">
          {reviews.length === 0 ? (
            <div className="h-full flex items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl flex-col gap-2">
               <p className="text-white/20 font-medium italic text-lg">Still Zero Reviews</p>
               <p className="text-white/10 text-xs uppercase tracking-[0.2em]">Authenticity is our priority</p>
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{r.user_name}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{format(new Date(r.created_at!), "MMM dd, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-current" : "text-white/10"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export function ProductRatingBadge({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex text-amber-400">
        <Star className="w-4 h-4 fill-current" />
      </div>
      <span className="text-white font-bold">{rating.toFixed(1)}</span>
      <span className="text-white/40 text-xs">({count})</span>
    </div>
  )
}
