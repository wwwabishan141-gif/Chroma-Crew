import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore"
import { db } from "./firebase"

export interface Review {
  id?: string
  productId: string
  userId: string
  userName: string
  rating: number // 1-5
  comment: string
  createdAt: any
}

const REVIEWS_COLLECTION = "reviews"

export const addReview = async (
  review: Omit<Review, "id" | "createdAt">
): Promise<string> => {
  // Check if user already reviewed this product
  const existing = await getDocs(
    query(
      collection(db, REVIEWS_COLLECTION),
      where("productId", "==", review.productId),
      where("userId", "==", review.userId)
    )
  )

  if (!existing.empty) {
    // Update existing review
    const existingDoc = existing.docs[0]
    await deleteDoc(doc(db, REVIEWS_COLLECTION, existingDoc.id))
  }

  const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
    ...review,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

export const subscribeToProductReviews = (
  productId: string,
  callback: (reviews: Review[]) => void
) => {
  const q = query(
    collection(db, REVIEWS_COLLECTION),
    where("productId", "==", productId),
    orderBy("createdAt", "desc")
  )

  return onSnapshot(q, (snapshot) => {
    const reviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[]
    callback(reviews)
  })
}

export const getAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}
