"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success("Logged in successfully")
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name }
          }
        })
        if (error) throw error
        toast.success("Check your email for confirmation link!")
      }
      router.push("/shop")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first.")
      return
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      toast.success("Password reset email sent!")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      toast.success("Logged out successfully")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header currentPage="login" />
      <div className="max-w-xl mx-auto px-6 py-16">
        <h1 className="text-4xl mb-6">{isLogin ? "Login" : "Sign Up"}</h1>

        {user ? (
          <div className="space-y-4">
            <p className="text-white/70">You are signed in as {user.email}.</p>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 font-semibold transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleAuth}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/10 border border-white/20 focus:border-red-600 outline-none transition-all"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 focus:border-red-600 outline-none transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 focus:border-red-600 outline-none transition-all"
            />
            {isLogin && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-xs text-red-500 hover:text-red-400 hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}
            <button 
              disabled={loading}
              className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-lg disabled:opacity-50 shadow-xl shadow-red-600/20 transition-all active:scale-95"
            >
              {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
            </button>
            <p className="text-center text-white/60">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-red-500 font-bold hover:underline"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </form>
        )}
      </div>
    </main>
  )
}
