"use client"

import { useEffect, useState } from "react"
import { subscribeToProductReviews, addReview, getAverageRating, type Review } from "@/lib/review-service"
import { validateReview, sanitizeText } from "@/lib/validators"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import Link from "next/link"

function StarRating({
  rating,
  onRate,
  interactive = false,
  size = "w-5 h-5",
}: {
  rating: number
  onRate?: (r: number) => void
  interactive?: boolean
  size?: string
}) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
        >
          <svg
            viewBox="0 0 24 24"
            className={`${size} transition-colors`}
            fill={(hover || rating) >= star ? "#ef4444" : "none"}
            stroke={(hover || rating) >= star ? "#ef4444" : "#555"}
            strokeWidth="1.5"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const unsubscribe = subscribeToProductReviews(productId, setReviews)
    return () => unsubscribe()
  }, [productId])

  const avgRating = getAverageRating(reviews)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error("Please login to leave a review")
      return
    }

    const validation = validateReview({ rating, comment })
    if (!validation.valid) {
      validation.errors.forEach((err) => toast.error(err))
      return
    }

    setSubmitting(true)
    try {
      await addReview({
        productId,
        userId: user.uid,
        userName: user.displayName || user.email?.split("@")[0] || "Anonymous",
        rating,
        comment: sanitizeText(comment),
      })
      toast.success("Review submitted!")
      setRating(0)
      setComment("")
      setShowForm(false)
    } catch (error: any) {
      toast.error("Failed to submit review: " + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const userAlreadyReviewed = user ? reviews.some((r) => r.userId === user.uid) : false

  return (
    <section className="mt-12 pt-10 border-t border-white/10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Customer Reviews</h2>
          <div className="flex items-center gap-3 mt-2">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-white/70 text-sm">
              {avgRating > 0 ? `${avgRating} out of 5` : "No reviews yet"} · {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>

        {user ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 transition-colors"
          >
            {userAlreadyReviewed ? "Update Review" : "Write a Review"}
          </button>
        ) : (
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-semibold rounded-xl border border-white/20 hover:bg-white/5 transition-colors"
          >
            Login to Review
          </Link>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-white/15 bg-white/5 p-6 space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-white/80 mb-2 block">Your Rating</label>
            <StarRating rating={rating} onRate={setRating} interactive size="w-7 h-7" />
          </div>
          <div>
            <label className="text-sm font-medium text-white/80 mb-2 block">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              maxLength={1000}
              className="w-full rounded-xl bg-white/10 border border-white/20 p-3 outline-none focus:border-red-600 resize-none text-sm"
            />
            <p className="text-right text-white/30 text-xs mt-1">{comment.length}/1000</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 font-semibold text-sm transition-all disabled:opacity-40 active:scale-95"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-xl border border-white/15 text-white/60 text-sm hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-white/50 text-sm">
            No reviews yet. Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-white/10 p-5 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-red-600/20 flex items-center justify-center text-red-400 font-bold text-sm shrink-0">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{review.userName}</p>
                    <p className="text-white/40 text-xs">
                      {review.createdAt?.toDate
                        ? new Intl.DateTimeFormat("en-LK", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(review.createdAt.toDate())
                        : "Just now"}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} size="w-4 h-4" />
              </div>
              <p className="text-white/75 text-sm mt-3 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

/** Compact rating display for product cards */
export function ProductRatingBadge({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToProductReviews(productId, setReviews)
    return () => unsubscribe()
  }, [productId])

  if (reviews.length === 0) return null

  const avg = getAverageRating(reviews)

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <svg viewBox="0 0 24 24" fill="#ef4444" className="w-3.5 h-3.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="text-white/70">{avg}</span>
      <span className="text-white/40">({reviews.length})</span>
    </div>
  )
}
