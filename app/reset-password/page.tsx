"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Supabase sends the reset token as a hash fragment in the URL.
    // We listen to the auth state change to capture the RECOVERY session.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast.success("Password updated successfully! Please log in.")
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password.")
    } finally {
      setLoading(false)
    }
  }

  const getStrength = (p: string) => {
    if (p.length === 0) return 0
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^a-zA-Z0-9]/.test(p)) score++
    return score
  }

  const strength = getStrength(password)
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength]
  const strengthColor = ["", "bg-white", "bg-yellow-500", "bg-blue-500", "bg-green-500"][strength]

  return (
    <main className="min-h-screen bg-black text-white">
      <Header currentPage="login" />
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl">
            🔐
          </div>
          <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
          <p className="text-white/50 text-sm">
            {sessionReady
              ? "Enter your new password below."
              : "Verifying your reset link..."}
          </p>
        </div>

        {!sessionReady ? (
          <div className="flex justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            {/* New Password */}
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-widest font-bold">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 pr-12 rounded-xl bg-white/5 border border-white/10 focus:border-white outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i <= strength ? strengthColor : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${["", "text-neutral-300", "text-yellow-400", "text-blue-400", "text-green-400"][strength]}`}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-4 rounded-xl bg-white/5 border outline-none transition-all ${
                  confirmPassword.length > 0 && confirmPassword !== password
                    ? "border-white focus:border-white"
                    : confirmPassword.length > 0 && confirmPassword === password
                    ? "border-green-500 focus:border-green-500"
                    : "border-white/10 focus:border-white"
                }`}
              />
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <p className="text-neutral-300 text-xs">Passwords do not match.</p>
              )}
              {confirmPassword.length > 0 && confirmPassword === password && (
                <p className="text-green-400 text-xs">✓ Passwords match.</p>
              )}
            </div>

            <ul className="text-xs text-white/35 space-y-1 pt-1">
              <li className={password.length >= 8 ? "text-green-400" : ""}>✓ At least 8 characters</li>
              <li className={/[A-Z]/.test(password) ? "text-green-400" : ""}>✓ One uppercase letter</li>
              <li className={/[0-9]/.test(password) ? "text-green-400" : ""}>✓ One number</li>
            </ul>

            <button
              type="submit"
              disabled={loading || password !== confirmPassword || password.length < 8}
              className="w-full py-4 rounded-xl bg-white hover:bg-neutral-800 font-bold text-lg disabled:opacity-40 shadow-xl shadow-red-600/20 transition-all active:scale-95"
            >
              {loading ? "Updating..." : "Set New Password"}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
