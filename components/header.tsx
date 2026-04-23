"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Heart, Search, ShoppingCart, User, Menu, X } from "lucide-react"
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
        <div className={`max-w-7xl mx-auto px-4 md:px-6 py-4 transition-all duration-300`}>
          <div className="flex items-center justify-between gap-4 relative">
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

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-bold transition-all duration-300 ${isActive(item.key) ? "text-white" : "text-white/60 hover:text-white"}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="text-white hover:text-red-500 transition-colors p-2"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link href="/wishlist" className="hidden sm:flex text-white hover:text-red-500 transition-colors p-2">
                <Heart className="w-5 h-5" />
              </Link>

              <Link href="/cart" className={`relative text-white hover:text-red-500 transition-all p-2 ${cartBump ? "scale-110" : ""}`}>
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 rounded-full text-[10px] flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <button onClick={handleLogout} className="hidden sm:flex text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                  Logout
                </button>
              ) : (
                <Link href="/login" className="hidden sm:flex text-xs font-bold bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors">
                  Login
                </Link>
              )}

              <button className="lg:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-background border-b border-white/10 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-white/80 hover:bg-white/5 font-medium"
                >
                  {item.name}
                </Link>
              ))}
              {!user && (
                <Link href="/login" className="mt-2 bg-red-600 text-center py-3 rounded-xl font-bold">
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}

        {/* Search Bar Overlay */}
        {showSearch && (
          <div className="absolute top-full left-0 w-full bg-background border-b border-white/10 p-4 animate-in slide-in-from-top duration-200">
            <div className="max-w-3xl mx-auto flex gap-2">
              <input 
                type="text" 
                placeholder="Search for products..."
                autoFocus
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-red-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                className="bg-red-600 px-6 py-2 rounded-xl font-bold"
                onClick={() => {
                  router.push(`/shop?search=${searchQuery}`)
                  setShowSearch(false)
                }}
              >
                Search
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
