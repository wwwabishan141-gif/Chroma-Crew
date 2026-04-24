"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Heart, Search, ShoppingCart, Menu, X } from "lucide-react"
import { useShop } from "@/components/shop-provider"
import { supabase } from "@/lib/supabase"

interface HeaderProps {
  currentPage?: string
}

export function Header({ currentPage = "home" }: HeaderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartBump, setCartBump] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { cartCount } = useShop()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (cartCount > 0) {
      setCartBump(true)
      const timer = setTimeout(() => setCartBump(false), 300)
      return () => clearTimeout(timer)
    }
  }, [cartCount])

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
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${isScrolled
        ? "bg-background/95 backdrop-blur-lg border-b border-white/10 shadow-lg"
        : "bg-background/80 border-b border-transparent shadow-none"
        }`}>

        {/* ── ROW 1: Logo │ Search │ Login + Wishlist + Cart ── */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-3 pb-2">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity shrink-0">
              <Image
                src="/website-logo-what-01.png"
                alt="Chroma Crew Logo"
                width={50}
                height={50}
                className="w-[50px] md:w-[60px] h-auto object-contain"
                priority
              />
            </Link>

            {/* Search – center (desktop) */}
            <div className="hidden lg:flex flex-1 justify-center">
              {showSearch ? (
                <div className="flex gap-2 w-full max-w-md animate-in slide-in-from-top duration-200">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    autoFocus
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        router.push(`/shop?search=${searchQuery}`)
                        setShowSearch(false)
                      }
                    }}
                  />
                  <button
                    className="bg-red-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors"
                    onClick={() => { router.push(`/shop?search=${searchQuery}`); setShowSearch(false) }}
                  >
                    Go
                  </button>
                  <button onClick={() => setShowSearch(false)} className="text-white/40 hover:text-white p-2 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="text-white/60 hover:text-white transition-colors p-2"
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Right icons: Login + Wishlist + Cart + Hamburger */}
            <div className="flex items-center gap-3">
              {/* Login / Logout – desktop */}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white border border-white/15 hover:border-white/30 px-4 py-2 rounded-full transition-all"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-white border border-white/15 hover:border-red-600 hover:text-red-400 px-4 py-2 rounded-full transition-all"
                >
                  Login
                </Link>
              )}

              {/* Wishlist */}
              <Link href="/wishlist" className="hidden sm:flex text-white/70 hover:text-red-400 transition-colors p-1.5" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <Link href="/cart" className={`relative text-white/70 hover:text-red-400 transition-all p-1.5 ${cartBump ? "scale-110" : ""}`} aria-label="Cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[9px] flex items-center justify-center font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile search */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="lg:hidden text-white/70 hover:text-white transition-colors p-1.5"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Hamburger */}
              <button
                className="lg:hidden text-white/70 hover:text-white p-1.5 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Nav Links (desktop only) ── */}
        <div className="hidden lg:block border-t border-white/5">
          <nav className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex items-center justify-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold transition-all duration-200 relative group ${
                  isActive(item.key)
                    ? "text-white"
                    : "text-white/55 hover:text-white"
                }`}
              >
                {item.name}
                {/* Active underline */}
                <span className={`absolute -bottom-[9px] left-0 right-0 h-[2px] bg-red-600 transition-all duration-200 ${
                  isActive(item.key) ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100"
                }`} />
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile search bar drop-down */}
        {showSearch && (
          <div className="lg:hidden border-t border-white/10 p-3 animate-in slide-in-from-top duration-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search products..."
                autoFocus
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push(`/shop?search=${searchQuery}`)
                    setShowSearch(false)
                    setMenuOpen(false)
                  }
                }}
              />
              <button
                className="bg-red-600 px-4 py-2 rounded-xl font-bold text-sm"
                onClick={() => { router.push(`/shop?search=${searchQuery}`); setShowSearch(false) }}
              >
                Go
              </button>
            </div>
          </div>
        )}

        {/* Mobile full menu */}
        {menuOpen && (
          <div className="lg:hidden bg-background/98 border-t border-white/10 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive(item.key)
                      ? "text-white bg-white/5"
                      : "text-white/65 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="mt-3 pt-3 border-t border-white/10 flex gap-3">
                <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/70 hover:text-white transition-colors">
                  ♡ Wishlist
                </Link>
                {user ? (
                  <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/70 hover:text-white transition-colors">
                    Logout
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-bold text-white transition-colors">
                    Login
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
