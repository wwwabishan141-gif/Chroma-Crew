"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Heart, Search, ShoppingCart, User, Menu, X } from "lucide-react"
import { useShop } from "@/components/shop-provider"

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
  const router = useRouter()
  const { cartCount, user } = useShop()
  const isLoggedIn = !!user
  const userName = user?.displayName || user?.email?.split('@')[0] || "User"

  const handleLogout = async () => {
    const { auth } = await import("@/lib/firebase")
    const { signOut } = await import("firebase/auth")
    await signOut(auth)
    router.refresh()
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

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [currentPage])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen || showSearch) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [menuOpen, showSearch])

  // ESC key listener for search
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSearch(false)
    }
    if (showSearch) {
      window.addEventListener("keydown", handleEsc)
    }
    return () => window.removeEventListener("keydown", handleEsc)
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
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${isScrolled
        ? "bg-background/95 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-black/40"
        : "bg-background/80 border-b border-transparent shadow-none"
        }`}>
        <div className={`max-w-7xl mx-auto px-4 md:px-6 transition-all duration-300 ease-in-out ${isScrolled ? "py-2" : "py-4 md:py-6"}`}>
          {/* Top Row: Logo | Search | Icons */}
          <div className="flex items-center justify-between gap-4 mb-4 md:mb-6 relative">
            {/* LEFT: Logo */}
            <div className="flex-initial flex justify-start items-center">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <Image
                  src="/website-logo-what-01.png"
                  alt="Chroma Crew Logo"
                  width={50}
                  height={50}
                  className="w-[60px] md:w-[65px] h-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* CENTER: Search (absolute centered) */}
            <div className="absolute left-1/2 -translate-x-1/2 h-10 flex items-center z-10">
              {showSearch ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const query = searchQuery.trim()
                    if (query) {
                      router.push(`/shop?search=${encodeURIComponent(query)}`)
                      setShowSearch(false)
                      setSearchQuery("")
                    }
                  }}
                  className="flex items-center bg-white rounded-md overflow-hidden shadow-lg animate-in fade-in zoom-in-95 duration-200"
                >
                  <Search className="w-4 h-4 md:w-5 md:h-5 text-black/50 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder=""
                    className="bg-transparent text-black px-3 py-2 outline-none w-48 md:w-72 font-medium"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowSearch(false)}
                    className="mr-3 text-black/40 hover:text-black transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  aria-label="Open search"
                  onClick={() => setShowSearch(true)}
                  className="text-white hover:text-red-500 hover:scale-110 transition-all p-2"
                >
                  <Search className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* RIGHT: Icons */}
            <div className="flex items-center gap-5 md:gap-6 shrink-0">
              {/* User */}
              <div className="hidden md:flex">
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-white/80 hover:text-white hover:scale-105 transition-all"
                  >
                    <User className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-bold truncate max-w-[100px]">{userName}</span>
                  </button>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 text-white/80 hover:text-white hover:scale-105 transition-all">
                    <User className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-bold">Login</span>
                  </Link>
                )}
              </div>

              {/* Wishlist */}
              <Link href="/wishlist" className="hidden md:flex items-center gap-2 text-white/80 hover:text-white hover:scale-105 transition-all">
                <Heart className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm font-bold">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className={`relative text-white hover:text-red-500 transition-all p-1 ${cartBump ? "scale-110" : "scale-100"}`}
                aria-label={`Shopping cart, ${cartCount} items`}
              >
                <ShoppingCart className={`w-6 h-6 md:w-7 md:h-7 transition-transform ${cartBump ? "animate-bounce" : ""}`} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[1.2rem] h-[1.2rem] px-1 bg-red-600 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Hamburger — mobile only */}
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden text-white hover:text-red-500 transition-colors p-1"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Bottom Row: Desktop nav */}
          <nav className="hidden md:flex justify-center items-center gap-4 lg:gap-6 flex-wrap">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-xs lg:text-sm font-bold transition-all duration-300 ${isActive(item.key)
                  ? "text-white"
                  : "text-white/60 hover:text-white"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile full-width slide-down menu */}
        <div
          className={`absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl shadow-2xl border-b border-white/10 lg:hidden overflow-hidden transition-all duration-300 ease-in-out origin-top ${menuOpen ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
            }`}
        >
          <div className="flex flex-col py-2 overflow-y-auto max-h-[85vh]">
            <nav className="flex flex-col px-4 py-2 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive(item.key)
                    ? "bg-red-600/15 text-red-400 border border-red-600/30"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="px-8 pt-4 pb-6 mt-2 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="py-3 text-base text-white/80 hover:text-white transition-colors flex items-center gap-3"
              >
                <Heart className="w-5 h-5" /> Wishlist
              </Link>
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => { handleLogout(); setMenuOpen(false) }}
                  className="py-3 text-base text-white/80 hover:text-white transition-colors flex items-center gap-3 w-full text-left"
                >
                  <User className="w-5 h-5" /> Logout ({userName})
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-base text-white/80 hover:text-white transition-colors flex items-center gap-3"
                >
                  <User className="w-5 h-5" /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}
