"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRealtimeMenu } from "@/hooks/use-realtime-menu"
import { getNeonColor } from "@/lib/utils/neon-colors"
import { formatPrice } from "@/lib/utils/format"
import type { MenuCategoryWithItems, NeonColor } from "@/types"

// Hardcoded fallback menu for when Supabase is not connected
const FALLBACK_MENU: MenuCategoryWithItems[] = [
  {
    id: "1", name: "Signatur Cocktails", slug: "signatur-cocktails", sort_order: 0,
    neon_color: "cyan" as NeonColor, is_active: true, created_at: "", updated_at: "",
    menu_items: [
      { id: "1", category_id: "1", name: "Strawberry Daiquiri", description: "Bacardi Carta Blanca, Sukker, Jordbær, Lime", price: 169, is_active: true, sort_order: 0, created_at: "", updated_at: "" },
      { id: "2", category_id: "1", name: "Mojito", description: "Bacardi Carta Blanca, Sukker, Lime, Mynte", price: 169, is_active: true, sort_order: 1, created_at: "", updated_at: "" },
      { id: "3", category_id: "1", name: "Mango Daiquiri", description: "Bacardi Carta Blanca, Sukker, Mango, Lime", price: 169, is_active: true, sort_order: 2, created_at: "", updated_at: "" },
      { id: "4", category_id: "1", name: "Long Island Ice Tea", description: "Gin, Vodka, Rom, Tequila, Tripplesec, Sourmix, Cola, Lime", price: 169, is_active: true, sort_order: 3, created_at: "", updated_at: "" },
      { id: "5", category_id: "1", name: "Hugo Spritz", description: "St-Germain Hylleblomstlikør, Prosecco, Soda, Sitron, Mynte", price: 169, is_active: true, sort_order: 4, created_at: "", updated_at: "" },
      { id: "6", category_id: "1", name: "Aperol Spritz", description: "Aperol, Prosecco, Soda Appelsin", price: 169, is_active: true, sort_order: 5, created_at: "", updated_at: "" },
    ],
  },
  {
    id: "2", name: "Klassiske Cocktails", slug: "klassiske-cocktails", sort_order: 1,
    neon_color: "pink" as NeonColor, is_active: true, created_at: "", updated_at: "",
    menu_items: [
      { id: "7", category_id: "2", name: "Whiskey Sour", description: "Whiskey, Sitronjuice, Sukkerlake, Eggehvite, Angostura Bitter", price: 159, is_active: true, sort_order: 0, created_at: "", updated_at: "" },
      { id: "8", category_id: "2", name: "Sure Føtter", description: "Eristoff Vodka, Jägermeister, Midori, Cola, Sourmix, Peach", price: 159, is_active: true, sort_order: 1, created_at: "", updated_at: "" },
      { id: "9", category_id: "2", name: "Snowball", description: "Eristoff Vodka, Eggelikør, Sprite, Lime", price: 159, is_active: true, sort_order: 2, created_at: "", updated_at: "" },
      { id: "10", category_id: "2", name: "Pink Russian", description: "Pink Gin, Russian, Lime", price: 159, is_active: true, sort_order: 3, created_at: "", updated_at: "" },
      { id: "11", category_id: "2", name: "Moscow Mule", description: "Barcardi Vodka, Ingefærøl, Lime", price: 159, is_active: true, sort_order: 4, created_at: "", updated_at: "" },
      { id: "12", category_id: "2", name: "Mie's", description: "Bacardi Razz, Peachtree, Sourmix, Lime, Sprite", price: 159, is_active: true, sort_order: 5, created_at: "", updated_at: "" },
      { id: "13", category_id: "2", name: "Lennart", description: "Eristoff Vodka, Xante, Sprite, Lime", price: 159, is_active: true, sort_order: 6, created_at: "", updated_at: "" },
      { id: "14", category_id: "2", name: "Dark & Stormy", description: "Bacardi Spiced, Ingefærøl, Lime", price: 159, is_active: true, sort_order: 7, created_at: "", updated_at: "" },
      { id: "15", category_id: "2", name: "Clover Club", description: "Bombay Sapphire Gin, Bringebærsirup, Sitronjuice, Eggehvite", price: 159, is_active: true, sort_order: 8, created_at: "", updated_at: "" },
      { id: "16", category_id: "2", name: "Amaretto Sour", description: "Amaretto, Sitronjuice, Sukkerlake, Eggehvite, Angostura Bitter", price: 159, is_active: true, sort_order: 9, created_at: "", updated_at: "" },
      { id: "17", category_id: "2", name: "Aloe Vera", description: "Bacardi Lemon, Melonlikør, Sourmix, Lime", price: 159, is_active: true, sort_order: 10, created_at: "", updated_at: "" },
    ],
  },
  {
    id: "3", name: "Øl", slug: "ol", sort_order: 2,
    neon_color: "green" as NeonColor, is_active: true, created_at: "", updated_at: "",
    menu_items: [
      { id: "18", category_id: "3", name: "Mango IPA 0,4", description: null, price: 139, is_active: true, sort_order: 0, created_at: "", updated_at: "" },
      { id: "19", category_id: "3", name: "Borg 0,5", description: null, price: 118, is_active: true, sort_order: 1, created_at: "", updated_at: "" },
      { id: "20", category_id: "3", name: "Borg 0,4", description: null, price: 98, is_active: true, sort_order: 2, created_at: "", updated_at: "" },
      { id: "21", category_id: "3", name: "Borg 0,3", description: null, price: 76, is_active: true, sort_order: 3, created_at: "", updated_at: "" },
    ],
  },
  {
    id: "4", name: "Flaskeøl", slug: "flaskeol", sort_order: 3,
    neon_color: "orange" as NeonColor, is_active: true, created_at: "", updated_at: "",
    menu_items: [
      { id: "22", category_id: "4", name: "Sol", description: null, price: 97, is_active: true, sort_order: 0, created_at: "", updated_at: "" },
      { id: "23", category_id: "4", name: "Nøgne Ø IPA", description: null, price: 109, is_active: true, sort_order: 1, created_at: "", updated_at: "" },
      { id: "24", category_id: "4", name: "Heineken", description: null, price: 119, is_active: true, sort_order: 2, created_at: "", updated_at: "" },
      { id: "25", category_id: "4", name: "Borg Lite", description: null, price: 119, is_active: true, sort_order: 3, created_at: "", updated_at: "" },
    ],
  },
  {
    id: "5", name: "Cider/Rusbrus", slug: "cider-rusbrus", sort_order: 4,
    neon_color: "red" as NeonColor, is_active: true, created_at: "", updated_at: "",
    menu_items: [
      { id: "26", category_id: "5", name: "Smirnoff Ice", description: null, price: 97, is_active: true, sort_order: 0, created_at: "", updated_at: "" },
      { id: "27", category_id: "5", name: "Grevens Pære", description: null, price: 109, is_active: true, sort_order: 1, created_at: "", updated_at: "" },
      { id: "28", category_id: "5", name: "Ginger Joe", description: null, price: 97, is_active: true, sort_order: 2, created_at: "", updated_at: "" },
      { id: "29", category_id: "5", name: "Bulmers", description: null, price: 129, is_active: true, sort_order: 3, created_at: "", updated_at: "" },
      { id: "30", category_id: "5", name: "Breezer", description: null, price: 97, is_active: true, sort_order: 4, created_at: "", updated_at: "" },
    ],
  },
  {
    id: "6", name: "Whiskey", slug: "whiskey", sort_order: 5,
    neon_color: "gold" as NeonColor, is_active: true, created_at: "", updated_at: "",
    menu_items: [
      { id: "31", category_id: "6", name: "Teeling Single Malt", description: null, price: 139, is_active: true, sort_order: 0, created_at: "", updated_at: "" },
      { id: "32", category_id: "6", name: "Jack Daniels", description: null, price: 139, is_active: true, sort_order: 1, created_at: "", updated_at: "" },
      { id: "33", category_id: "6", name: "Angels Envy", description: null, price: 149, is_active: true, sort_order: 2, created_at: "", updated_at: "" },
    ],
  },
  {
    id: "7", name: "Husets Vin", slug: "husets-vin", sort_order: 6,
    neon_color: "purple" as NeonColor, is_active: true, created_at: "", updated_at: "",
    menu_items: [
      { id: "34", category_id: "7", name: "Prosecco Glass", description: null, price: 139, is_active: true, sort_order: 0, created_at: "", updated_at: "" },
      { id: "35", category_id: "7", name: "Glass", description: null, price: 139, is_active: true, sort_order: 1, created_at: "", updated_at: "" },
      { id: "36", category_id: "7", name: "Flaske", description: null, price: 599, is_active: true, sort_order: 2, created_at: "", updated_at: "" },
    ],
  },
  {
    id: "8", name: "Shots", slug: "shots", sort_order: 7,
    neon_color: "orange" as NeonColor, is_active: true, created_at: "", updated_at: "",
    menu_items: [
      { id: "37", category_id: "8", name: "Patrón Silver Tequila", description: null, price: 129, is_active: true, sort_order: 0, created_at: "", updated_at: "" },
      { id: "38", category_id: "8", name: "Over 20%", description: null, price: 119, is_active: true, sort_order: 1, created_at: "", updated_at: "" },
      { id: "39", category_id: "8", name: "Under 20%", description: null, price: 109, is_active: true, sort_order: 2, created_at: "", updated_at: "" },
    ],
  },
  {
    id: "9", name: "Kaffe", slug: "kaffe", sort_order: 8,
    neon_color: "green" as NeonColor, is_active: true, created_at: "", updated_at: "",
    menu_items: [
      { id: "40", category_id: "9", name: "Kaffe m/Baileys", description: null, price: 139, is_active: true, sort_order: 0, created_at: "", updated_at: "" },
      { id: "41", category_id: "9", name: "Irish Coffee", description: null, price: 159, is_active: true, sort_order: 1, created_at: "", updated_at: "" },
      { id: "42", category_id: "9", name: "Kaffe", description: null, price: 50, is_active: true, sort_order: 2, created_at: "", updated_at: "" },
    ],
  },
  {
    id: "10", name: "Øvrig", slug: "ovrig", sort_order: 9,
    neon_color: "cyan" as NeonColor, is_active: true, created_at: "", updated_at: "",
    menu_items: [
      { id: "43", category_id: "10", name: "Otard (Cognac)", description: null, price: 139, is_active: true, sort_order: 0, created_at: "", updated_at: "" },
      { id: "44", category_id: "10", name: "Brastad (Cognac)", description: null, price: 139, is_active: true, sort_order: 1, created_at: "", updated_at: "" },
      { id: "45", category_id: "10", name: "Heineken (alkoholfri)", description: null, price: 55, is_active: true, sort_order: 2, created_at: "", updated_at: "" },
      { id: "46", category_id: "10", name: "Brus", description: null, price: 50, is_active: true, sort_order: 3, created_at: "", updated_at: "" },
    ],
  },
]

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
  const { categories: realtimeCategories, loading } = useRealtimeMenu()

  // Use realtime data if available, otherwise fallback
  const categories = realtimeCategories.length > 0 ? realtimeCategories : FALLBACK_MENU

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
