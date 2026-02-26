"use client"

import { useEffect, useRef } from "react"

const NEON_COLORS = [
  "#0798E8",
  "#D93CEF",
  "#FFC729",
  "#4ade80",
  "#fb923c",
  "#f87171",
  "#c084fc",
]

interface Particle {
  x: number
  y: number
  radius: number
  color: string
  vx: number
  vy: number
  alpha: number
  alphaDirection: number
  alphaSpeed: number
}

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 0.5,
    color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.6 + 0.1,
    alphaDirection: Math.random() > 0.5 ? 1 : -1,
    alphaSpeed: Math.random() * 0.005 + 0.002,
  }
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    let animationId: number
    let particles: Particle[] = []

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()

    const particleCount = prefersReducedMotion ? 10 : 60

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(canvas.width, canvas.height))
    }

    if (prefersReducedMotion) {
      // Draw static particles once
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      }
      ctx.globalAlpha = 1

      const handleResize = () => {
        resize()
        particles = []
        for (let i = 0; i < particleCount; i++) {
          particles.push(createParticle(canvas.width, canvas.height))
        }
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (const p of particles) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = p.alpha
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }

      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        // Update position
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Fade in/out
        p.alpha += p.alphaDirection * p.alphaSpeed
        if (p.alpha >= 0.7) {
          p.alpha = 0.7
          p.alphaDirection = -1
        }
        if (p.alpha <= 0.05) {
          p.alpha = 0.05
          p.alphaDirection = 1
        }

        // Draw particle with glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.shadowBlur = 0
      }

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      resize()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
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
      aria-hidden="true"
    />
  )
}
