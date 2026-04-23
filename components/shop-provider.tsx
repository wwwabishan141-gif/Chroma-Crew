"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  color?: string
  size?: string
  dtfSize?: "A4" | "A3"
  customImage?: string
}

export type WishlistItem = {
  id: string
  name: string
  price: number
  image?: string
}

function cartItemKey(item: Pick<CartItem, "id" | "color" | "size" | "dtfSize">) {
  return [item.id, item.color ?? "", item.size ?? "", item.dtfSize ?? ""].join("::")
}

type ShopContextType = {
  cart: CartItem[]
  wishlist: WishlistItem[]
  cartCount: number
  wishlistCount: number
  cartTotal: number
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  updateQuantity: (key: string, quantity: number) => void
  removeFromCart: (key: string) => void
  clearCart: () => void
  toggleWishlist: (item: WishlistItem) => void
  isWishlisted: (id: string) => boolean
  removeFromWishlist: (id: string) => void
  clearWishlist: () => void
}

const ShopContext = createContext<ShopContextType | null>(null)

const CART_KEY = "chromacrew_cart"
const WISHLIST_KEY = "chromacrew_wishlist"

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_KEY)
    const storedWishlist = localStorage.getItem(WISHLIST_KEY)
    if (storedCart) setCart(JSON.parse(storedCart))
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist))
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  }, [wishlist])

  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (p) =>
          p.id === item.id &&
          p.color === item.color &&
          p.size === item.size &&
          p.dtfSize === item.dtfSize,
      )
      if (existing) {
        return prev.map((p) =>
          p === existing ? { ...p, quantity: p.quantity + quantity } : p,
        )
      }
      return [...prev, { ...item, quantity }]
    })
  }

  const updateQuantity = (key: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((item) => (cartItemKey(item) === key ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (key: string) => {
    setCart((prev) => prev.filter((item) => cartItemKey(item) !== key))
  }

  const clearCart = () => setCart([])

  const toggleWishlist = (item: WishlistItem) => {
    setWishlist((prev) =>
      prev.some((w) => w.id === item.id)
        ? prev.filter((w) => w.id !== item.id)
        : [...prev, item],
    )
  }

  const isWishlisted = (id: string) => wishlist.some((w) => w.id === id)
  const removeFromWishlist = (id: string) => setWishlist((prev) => prev.filter((w) => w.id !== id))
  const clearWishlist = () => setWishlist([])

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      wishlistCount: wishlist.length,
      cartTotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      removeFromWishlist,
      clearWishlist,
    }),
    [cart, wishlist],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) throw new Error("useShop must be used within ShopProvider")
  return context
}

export function getCartItemKey(item: CartItem) {
  return cartItemKey(item)
}
