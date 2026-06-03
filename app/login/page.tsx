"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { toast } from "sonner"

const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 30

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [configError, setConfigError] = useState<string | null>(null)
  const [signupDone, setSignupDone] = useState(false)

  // Rate limiting state
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockoutRemaining, setLockoutRemaining] = useState(0)
  const lockoutTimer = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()
  const isLocked = lockoutRemaining > 0

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setConfigError("Supabase credentials are missing.")
      return
    }
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutRemaining > 0) {
      lockoutTimer.current = setTimeout(() => setLockoutRemaining((r) => r - 1), 1000)
    }
    return () => { if (lockoutTimer.current) clearTimeout(lockoutTimer.current) }
  }, [lockoutRemaining])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked) return
    setLoading(true)

    try {
      if (!isSupabaseConfigured) throw new Error("Supabase is not configured.")

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          // Increment failed attempts and apply lockout if needed
          const newAttempts = failedAttempts + 1
          setFailedAttempts(newAttempts)
          if (newAttempts >= MAX_ATTEMPTS) {
            setLockoutRemaining(LOCKOUT_SECONDS)
            setFailedAttempts(0)
            throw new Error(`Too many failed attempts. Login locked for ${LOCKOUT_SECONDS} seconds.`)
          }
          throw new Error(`${error.message} (${MAX_ATTEMPTS - newAttempts} attempts remaining before lockout)`)
        }
        // Reset on success
        setFailedAttempts(0)
        toast.success("Logged in successfully!")
        router.push("/shop")
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name },
            emailRedirectTo: `${window.location.origin}/login`,
          },
        })
        if (error) throw error
        setSignupDone(true)
      }
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      toast.success("Password reset email sent! Check your inbox.")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    toast.success("Logged out successfully")
  }

  // Email verification sent screen
  if (signupDone) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Header currentPage="login" />
        <div className="max-w-md mx-auto px-6 py-20 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-4xl">
            📧
          </div>
          <h1 className="text-3xl font-bold">Check Your Email</h1>
          <p className="text-white/60 leading-relaxed">
            We've sent a verification link to <strong className="text-white">{email}</strong>.
            Please click the link in the email to activate your account before logging in.
          </p>
          <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/15 text-yellow-300/80 text-sm text-left">
            <p className="font-bold text-yellow-400 mb-1">💡 Tip</p>
            <p>If you don't see the email, check your <strong>Spam</strong> or <strong>Junk</strong> folder.</p>
          </div>
          <button
            onClick={() => { setSignupDone(false); setIsLogin(true) }}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold transition-all"
          >
            Back to Login
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Header currentPage="login" />
      <div className="max-w-md mx-auto px-6 py-16">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-white/40 text-sm">
            {isLogin ? "Sign in to track your orders." : "Join ChromaCrew today."}
          </p>
        </div>

        {configError && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
            ⚠️ {configError}
          </div>
        )}

        {/* Lockout warning banner */}
        {isLocked && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="font-bold text-red-400">Too many failed attempts</p>
              <p>Please wait <strong>{lockoutRemaining}s</strong> before trying again.</p>
            </div>
          </div>
        )}

        {failedAttempts > 0 && !isLocked && (
          <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs">
            ⚠️ {MAX_ATTEMPTS - failedAttempts} attempt{MAX_ATTEMPTS - failedAttempts !== 1 ? "s" : ""} remaining before temporary lockout.
          </div>
        )}

        {user ? (
          <div className="space-y-4 text-center">
            <p className="text-white/70">You are signed in as <strong className="text-white">{user.email}</strong>.</p>
            <button
              onClick={handleLogout}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-semibold transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleAuth}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-red-600 outline-none transition-all"
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-red-600 outline-none transition-all"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 pr-16 rounded-xl bg-white/5 border border-white/10 focus:border-red-600 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs font-bold transition-colors"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

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
              type="submit"
              disabled={loading || isLocked}
              className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-lg disabled:opacity-50 shadow-xl shadow-red-600/20 transition-all active:scale-95"
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </button>

            <p className="text-center text-white/60 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setFailedAttempts(0); setLockoutRemaining(0) }}
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
