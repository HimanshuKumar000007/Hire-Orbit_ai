"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, LogIn, Sparkles } from "lucide-react"
import { toast } from "sonner"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = getSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.replace("/dashboard");
    };
    checkUser();
  }, [router, supabase]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter your email and password.")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success("Welcome back! 🚀")
      setTimeout(() => {
        router.replace("/dashboard")
      }, 500)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md glass p-10 rounded-3xl shadow-glow flex flex-col gap-8 relative z-10 mx-4"
      >
        <div className="flex flex-col gap-2">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-2"
          >
            <Sparkles className="text-emerald-400 w-6 h-6" />
          </motion.div>
          <h1 className="text-4xl font-bold gradient-text">Welcome Back</h1>
          <p className="text-muted-foreground">Log in to your HireOrbitAi account</p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground px-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full pl-10 p-3 border border-white/10 bg-white/5 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all text-white placeholder:text-zinc-600"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground px-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 p-3 border border-white/10 bg-white/5 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all text-white placeholder:text-zinc-600"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="group relative bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-xl font-bold shadow-glow transition-all active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <LogIn className="w-5 h-5" />
          )}
          {loading ? "Signing In..." : "Sign In"}
        </button>
        
        <div className="flex flex-col gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account? <span onClick={() => router.push("/signup")} className="text-emerald-400 font-semibold cursor-pointer hover:underline transition-all hover:text-emerald-300">Sign up</span>
          </p>
          <p className="text-xs text-muted-foreground">
            <span onClick={() => router.push("/forgot-password")} className="cursor-pointer hover:text-emerald-400 transition-colors">Forgot Password?</span>
          </p>
          <div className="flex items-center gap-4 mt-2">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Secure Access</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
        </div>
      </motion.div>
      
      {/* Decorative footer */}
      <footer className="absolute bottom-8 left-0 right-0 text-center z-10">
        <p className="text-xs text-zinc-500 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
          All systems operational
        </p>
      </footer>
    </div>
  )
}