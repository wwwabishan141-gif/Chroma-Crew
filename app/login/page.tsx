"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, sendPasswordResetEmail } from "firebase/auth"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
        toast.success("Logged in successfully")
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(userCredential.user, { displayName: name })
        toast.success("Account created successfully")
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
      await sendPasswordResetEmail(auth, email)
      toast.success("Password reset email sent! Check your inbox.")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
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
            <p className="text-white/70">You are signed in as {user.displayName || user.email}.</p>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 rounded bg-red-600 hover:bg-red-700 font-semibold"
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
                className="w-full p-3 rounded bg-white/10 border border-white/20 focus:border-red-600 outline-none"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-white/10 border border-white/20 focus:border-red-600 outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-white/10 border border-white/20 focus:border-red-600 outline-none"
            />
            {isLogin && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-xs text-red-500/70 hover:text-red-400 hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}
            <button 
              disabled={loading}
              className="w-full py-3 rounded bg-red-600 hover:bg-red-700 font-semibold disabled:opacity-50"
            >
              {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
            </button>
            <p className="text-center text-white/60">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-red-500 hover:underline"
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
