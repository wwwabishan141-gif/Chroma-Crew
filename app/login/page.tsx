"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [configError, setConfigError] = useState<string | null>(null)
  const [signupDone, setSignupDone] = useState(false)
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
          const newAttempts = failedAttempts + 1
          setFailedAttempts(newAttempts)
          if (newAttempts >= MAX_ATTEMPTS) {
            setLockoutRemaining(LOCKOUT_SECONDS)
            setFailedAttempts(0)
            throw new Error(`Too many failed attempts. Login locked for ${LOCKOUT_SECONDS} seconds.`)
          }
          throw new Error(`${error.message} (${MAX_ATTEMPTS - newAttempts} attempts remaining before lockout)`)
        }
        setFailedAttempts(0)
        toast.success("Logged in successfully!")
        router.push("/account")
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong"
      toast.error(message)
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong"
      toast.error(message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    toast.success("Logged out successfully")
  }

  if (signupDone) {
    return (
      <main className="min-h-screen bg-background text-white flex-1">
        <Header currentPage="login" />
        <div className="page-container max-w-md">
          <div className="page-card p-8 text-center space-y-5 border-red-600/20">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-3xl">
              📧
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Check Your Email</h1>
            <p className="text-white/60 leading-relaxed text-sm">
              We&apos;ve sent a verification link to <strong className="text-white">{email}</strong>.
              Click the link to activate your account before logging in.
            </p>
            <div className="p-4 rounded-xl bg-red-600/5 border border-red-600/20 text-white/70 text-sm text-left">
              <p className="font-bold text-red-400 mb-1">Tip</p>
              <p>If you don&apos;t see the email, check your Spam or Junk folder.</p>
            </div>
            <button
              type="button"
              onClick={() => { setSignupDone(false); setIsLogin(true) }}
              className="btn-primary w-full"
            >
              Back to Login
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-white flex-1">
      <Header currentPage="login" />
      <div className="page-container max-w-md">
        <div className="page-card p-8 md:p-10 border-red-600/20 space-y-6">
          <div className="text-center space-y-3">
            <Image src="/logo1.png" alt="ORBYT" width={56} height={56} className="w-14 h-14 mx-auto object-contain" />
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              {isLogin ? "Welcome Back" : "Join ORBYT"}
            </h1>
            <p className="text-white/50 text-sm">
              {isLogin ? "Sign in to track your orders." : "Create an account to save your order history."}
            </p>
          </div>

          {configError && (
            <div className="p-4 rounded-xl bg-red-600/10 border border-red-600/30 text-red-300 text-sm">
              ⚠️ {configError}
            </div>
          )}

          {isLocked && (
            <div className="p-4 rounded-xl bg-red-600/10 border border-red-600/30 text-sm flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="font-bold text-red-400">Too many failed attempts</p>
                <p className="text-white/60">Please wait <strong className="text-white">{lockoutRemaining}s</strong> before trying again.</p>
              </div>
            </div>
          )}

          {failedAttempts > 0 && !isLocked && (
            <div className="p-3 rounded-xl bg-red-600/5 border border-red-600/20 text-red-300 text-xs">
              ⚠️ {MAX_ATTEMPTS - failedAttempts} attempt{MAX_ATTEMPTS - failedAttempts !== 1 ? "s" : ""} remaining before temporary lockout.
            </div>
          )}

          {user ? (
            <div className="space-y-4 text-center">
              <p className="text-white/70">
                Signed in as <strong className="text-white">{user.email}</strong>
              </p>
              <button type="button" onClick={handleLogout} className="btn-secondary w-full">
                Logout
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleAuth}>
              {!isLogin && (
                <div>
                  <label className="form-label-orbyt">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-orbyt"
                    placeholder="Your name"
                  />
                </div>
              )}
              <div>
                <label className="form-label-orbyt">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-orbyt"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="form-label-orbyt">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-orbyt pr-16"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-red-400 text-xs font-bold transition-colors"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-white/50 hover:text-red-400 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || isLocked}
                className="btn-primary w-full text-base py-3.5"
              >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              </button>

              <p className="text-center text-white/50 text-sm pt-2">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setFailedAttempts(0); setLockoutRemaining(0) }}
                  className="text-red-400 font-bold hover:underline"
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
