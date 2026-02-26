"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRealtimeMenu } from "@/hooks/use-realtime-menu"
import { getNeonColor } from "@/lib/utils/neon-colors"
import { formatPrice } from "@/lib/utils/format"
import type { MenuCategoryWithItems, NeonColor } from "@/types"

function TvClock() {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    function updateClock() {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("nb", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      )
      setDate(
        now.toLocaleDateString("nb", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      )
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-right">
      <div className="text-2xl font-bold text-neon-cyan drop-shadow-[0_0_15px_rgba(7,152,232,0.8)] font-mono">
        {time}
      </div>
      <div className="text-sm text-gray-300 font-light capitalize">{date}</div>
    </div>
  )
}

function TvParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const particles: {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      alpha: number
      alphaDir: number
    }[] = []

    const colors = [
      "#0798E8", "#D93CEF", "#FFC729", "#4ade80",
      "#fb923c", "#f87171", "#c084fc",
    ]

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.1,
        alphaDir: (Math.random() - 0.5) * 0.005,
      })
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.alpha += p.alphaDir

        if (p.alpha <= 0.05 || p.alpha >= 0.6) p.alphaDir *= -1
        if (p.x < 0) p.x = canvas!.width
        if (p.x > canvas!.width) p.x = 0
        if (p.y < 0) p.y = canvas!.height
        if (p.y > canvas!.height) p.y = 0

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = p.color
        ctx!.globalAlpha = p.alpha
        ctx!.fill()

        // Glow effect
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx!.fillStyle = p.color
        ctx!.globalAlpha = p.alpha * 0.15
        ctx!.fill()
      }

      ctx!.globalAlpha = 1
      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{
        background:
          "radial-gradient(circle, #050505 0%, #0a0a0a 30%, #1a0a1a 70%, #000510 100%)",
      }}
    />
  )
}

function CategoryColumn({
  category,
}: {
  category: MenuCategoryWithItems
}) {
  const color = getNeonColor(category.neon_color as NeonColor)

  return (
    <div className="mb-6">
      <h2
        className="text-lg font-bold tracking-wider uppercase mb-2 pb-1 border-b"
        style={{
          color: color.hex,
          textShadow: `0 0 10px ${color.shadowColor}, 0 0 20px ${color.shadowColor}`,
          borderColor: `${color.hex}40`,
        }}
      >
        {category.name}
      </h2>
      <div className="space-y-1">
        {category.menu_items.map((item) => (
          <div key={item.id} className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium leading-tight">
                {item.name}
              </div>
              {item.description && (
                <div className="text-gray-400 text-xs leading-tight truncate">
                  {item.description}
                </div>
              )}
            </div>
            <div
              className="text-sm font-bold whitespace-nowrap"
              style={{ color: "#FFC729" }}
            >
              {formatPrice(item.price)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TvMenuPage() {
  const { categories, loading } = useRealtimeMenu()

  // Distribute categories across 4 columns
  const columns: MenuCategoryWithItems[][] = [[], [], [], []]
  let colHeights = [0, 0, 0, 0]

  for (const cat of categories) {
    const itemCount = cat.menu_items.length + 2 // +2 for header space
    const shortestCol = colHeights.indexOf(Math.min(...colHeights))
    columns[shortestCol].push(cat)
    colHeights[shortestCol] += itemCount
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <TvParticleCanvas />
      <div className="relative z-10 h-full flex flex-col p-4">
        {/* Header */}
        <header className="text-center mb-4 relative">
          <div className="absolute top-0 right-0 flex flex-col items-end gap-2">
            <TvClock />
          </div>
          <div className="flex justify-center items-center mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="1016"
              width={80}
              height={60}
              className="h-16 w-auto drop-shadow-[0_0_20px_rgba(7,152,232,0.6)]"
            />
          </div>
          <p className="text-xs text-gray-400 tracking-[0.3em] uppercase">
            Premium Drinks & Cocktails
          </p>
        </header>

        {/* Menu Grid */}
        <div className="flex-1 grid grid-cols-4 gap-4 overflow-hidden">
          {columns.map((col, i) => (
            <div key={i} className="overflow-hidden">
              {col.map((cat) => (
                <CategoryColumn key={cat.id} category={cat} />
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center mt-2">
          <p className="text-xs text-gray-500 tracking-[0.2em]">
            PREMIUM DRINKS &bull; EXCEPTIONAL SERVICE &bull; NEON ATMOSPHERE
          </p>
        </footer>
      </div>
    </div>
  )
}
