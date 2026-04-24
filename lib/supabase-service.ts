import { supabase } from './supabase'

export interface Order {
  id?: string
  order_id: string
  name: string
  phone: string
  address: string
  products: any[]
  total: number
  image_url: string | null
  status: "Received" | "Processing" | "Printed" | "Shipped" | "Delivered"
  created_at?: string
  user_id?: string | null
}

export interface Review {
  id?: string
  product_id: string
  user_id: string
  user_name: string
  rating: number
  comment: string
  created_at?: string
}

/**
 * Uploads a design image to Supabase Storage
 */
export const uploadDesign = async (orderId: string, file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${orderId}-${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from('designs')
    .upload(filePath, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('designs')
    .getPublicUrl(filePath)

  return publicUrl
}

/**
 * Creates a new order in Supabase
 */
export const createOrder = async (orderData: Omit<Order, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()

  if (error) throw error
  return data[0]
}

/**
 * Fetches orders for a specific user
 */
export const getUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Order[]
}

/**
 * Fetches all orders (for admin)
 */
export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Order[]
}

/**
 * Updates order status
 */
export const updateOrderStatus = async (orderId: string, status: string) => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('order_id', orderId)

  if (error) throw error
}

// Helper to convert base64 to File
export const base64ToFile = (base64: string, filename: string) => {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

/**
 * Reviews System
 */
export const addReview = async (review: Omit<Review, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select()

  if (error) throw error
  return data[0]
}

export const getProductReviews = async (productId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Review[]
}

/**
 * Newsletter System
 */
export const subscribeToNewsletter = async (email: string) => {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert([{ email }])

  if (error) throw error
}
