"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "/admin"

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error("Feil e-post eller passord")
      setLoading(false)
      return
    }

    toast.success("Logget inn!")
    router.push(redirect)
    router.refresh()
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <Label htmlFor="email" className="text-gray-300">
          E-post
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@bar1016.no"
          required
          className="bg-black/40 border-white/10 text-white placeholder:text-gray-500"
        />
      </div>
      <div>
        <Label htmlFor="password" className="text-gray-300">
          Passord
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="bg-black/40 border-white/10 text-white placeholder:text-gray-500"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-neon-cyan hover:bg-neon-cyan/80 text-black font-semibold"
      >
        {loading ? "Logger inn..." : "Logg inn"}
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-neon-cyan neon-glow-cyan">1016</span>{" "}
            <span className="text-neon-pink neon-glow-pink">BAR</span>
          </h1>
          <p className="text-gray-400 mt-2">Admin</p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
