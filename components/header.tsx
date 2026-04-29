"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Heart, ShoppingCart, Menu, X, User, Search } from "lucide-react"
import { useShop } from "@/components/shop-provider"
import { supabase } from "@/lib/supabase"

interface HeaderProps {
  currentPage?: string
}

const ICON_SIZE = "w-[22px] h-[22px]"

export function Header({ currentPage = "home" }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartBump, setCartBump] = useState(false)
  const [user, setUser] = useState<any>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { cartCount } = useShop()

  /* ── Auth ── */
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) =>
      setUser(session?.user ?? null)
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
  }

  /* ── Scroll ── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* ── Cart bump animation ── */
  useEffect(() => {
    if (cartCount > 0) {
      setCartBump(true)
      const t = setTimeout(() => setCartBump(false), 300)
      return () => clearTimeout(t)
    }
  }, [cartCount])

  /* ── Close search on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false)
      }
    }
    if (showSearch) {
      document.addEventListener("mousedown", handler)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
    return () => document.removeEventListener("mousedown", handler)
  }, [showSearch])

  const navItems = [
    { name: "Home", href: "/", key: "home" },
    { name: "Shop", href: "/shop", key: "shop" },
    { name: "Custom Design", href: "/custom-design", key: "custom-design" },
    { name: "About Us", href: "/about", key: "about" },
    { name: "Blog", href: "/blog", key: "blog" },
    { name: "FAQ", href: "/faq", key: "faq" },
    { name: "Account", href: "/account", key: "account" },
    { name: "Contacts", href: "/contacts", key: "contacts" },
  ]

  const isActive = (key: string) => currentPage === key

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
          ? "bg-background/95 backdrop-blur-lg border-b border-white/10 shadow-lg"
          : "bg-background/80 border-b border-transparent"
          }`}
      >
        {/* ══════════════ ROW 1 ══════════════ */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 grid grid-cols-3 items-center">

          {/* Left – Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
              <Image
                src="/website-logo-what-01.png"
                alt="Chroma Crew"
                width={70}
                height={70}
                className="w-[60px] md:w-[65px] h-auto object-contain"
                priority
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-white font-black text-xl tracking-tighter leading-none">ChromaCrew</span>
                <span className="text-red-500 font-bold text-[10px] tracking-[0.2em] leading-tight group-hover:text-white transition-colors">.LK</span>
              </div>
            </Link>
          </div>

          {/* Centre – Search */}
          <div className="flex justify-center" ref={searchRef}>
            {showSearch ? (
              /* ── Animated white search popup ── */
              <div
                className="
                  flex items-center gap-2
                  bg-white text-black
                  rounded-2xl px-4 py-2
                  shadow-2xl
                  w-[260px] md:w-[340px]
                  animate-in zoom-in-75 slide-in-from-top-1 duration-200
                "
              >
                <Search className="w-4 h-4 text-black/50 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
                      setShowSearch(false)
                      setSearchQuery("")
                    }
                    if (e.key === "Escape") setShowSearch(false)
                  }}
                  className="flex-1 outline-none bg-transparent text-sm text-black placeholder:text-black/40 font-medium"
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="text-black/30 hover:text-black transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* ── Search icon ── */
              <button
                onClick={() => setShowSearch(true)}
                aria-label="Search"
                className="flex items-center justify-center text-white/70 hover:text-white transition-colors p-1"
              >
                <Search className={ICON_SIZE} />
              </button>
            )}
          </div>

          {/* Right – Login + Wishlist + Cart + Hamburger */}
          <div className="flex items-center justify-end gap-3 md:gap-4">

            {/* Login / Logout (person icon on desktop, link on mobile) */}
            {user ? (
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="hidden sm:flex flex-col items-center gap-0.5 text-white/70 hover:text-red-400 transition-colors"
              >
                <User className={ICON_SIZE} />
                <span className="text-[9px] font-semibold uppercase tracking-wider leading-none">
                  Logout
                </span>
              </button>
            ) : (
              <Link
                href="/login"
                aria-label="Login"
                className="hidden sm:flex flex-col items-center gap-0.5 text-white/70 hover:text-white transition-colors"
              >
                <User className={ICON_SIZE} />
                <span className="text-[9px] font-semibold uppercase tracking-wider leading-none">
                  Login
                </span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden sm:flex flex-col items-center gap-0.5 text-white/70 hover:text-red-400 transition-colors"
            >
              <Heart className={ICON_SIZE} />
              <span className="text-[9px] font-semibold uppercase tracking-wider leading-none">
                Wishlist
              </span>
            </Link>

            {/* Cart (Hidden on mobile to match design) */}
            <Link
              href="/cart"
              aria-label="Cart"
              className={`hidden sm:flex relative flex-col items-center gap-0.5 text-white/70 hover:text-red-400 transition-all ${cartBump ? "scale-110" : ""}`}
            >
              <ShoppingCart className={ICON_SIZE} />
              <span className="text-[9px] font-semibold uppercase tracking-wider leading-none">
                Cart
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-600 rounded-full text-[9px] flex items-center justify-center font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger – mobile only */}
            <button
              className="lg:hidden text-white/70 hover:text-white p-1 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X className={ICON_SIZE} /> : <Menu className={ICON_SIZE} />}
            </button>
          </div>
        </div>

        {/* ══════════════ ROW 2 – Desktop Nav ══════════════ */}
        <div className="hidden lg:block border-t border-white/[0.06]">
          <nav className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex items-center justify-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`relative text-sm font-semibold transition-colors duration-200 group ${isActive(item.key) ? "text-white" : "text-white/55 hover:text-white"
                  }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-[11px] left-0 right-0 h-[2px] bg-red-600 rounded-full transition-all duration-200 ${isActive(item.key)
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100"
                    }`}
                />
              </Link>
            ))}
          </nav>
        </div>

        {/* ══════════════ MOBILE MENU ══════════════ */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-background/98 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive(item.key)
                    ? "text-white bg-white/5"
                    : "text-white/65 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile actions */}
              <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/70 hover:text-white transition-colors col-span-2 bg-red-600/10 border-red-600/30"
                >
                  <ShoppingCart className="w-4 h-4" /> 
                  Cart {cartCount > 0 && <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>}
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/70 hover:text-white transition-colors"
                >
                  <Heart className="w-4 h-4" /> Wishlist
                </Link>
                {user ? (
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false) }}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/70 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-bold text-white transition-colors"
                  >
                    <User className="w-4 h-4" /> Login
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
