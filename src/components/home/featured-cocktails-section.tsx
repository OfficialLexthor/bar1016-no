"use client"

import { useEffect, useState } from "react"
import { NeonText } from "@/components/neon/neon-text"
import { NeonCard } from "@/components/neon/neon-card"
import { formatPrice } from "@/lib/utils/format"
import { createClient } from "@/lib/supabase/client"
import type { MenuItem, NeonColor } from "@/types"

interface MenuItemWithCategory extends MenuItem {
  menu_categories: {
    name: string
    neon_color: NeonColor
  } | null
}

export function FeaturedCocktailsSection() {
  const [cocktails, setCocktails] = useState<MenuItemWithCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCocktails() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("menu_items")
        .select("*, menu_categories(name, neon_color)")
        .eq("is_active", true)
        .eq("is_featured", true)
        .limit(6)

      if (!error && data) {
        setCocktails(data as MenuItemWithCategory[])
      }
      setLoading(false)
    }

    fetchCocktails()
  }, [])

  if (!loading && cocktails.length === 0) {
    return null
  }

  return (
    <section className="py-16 px-4 md:py-24">
      <div className="mx-auto max-w-7xl">
        <NeonText
          color="cyan"
          as="h2"
          className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Utvalgte Cocktails
        </NeonText>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <NeonCard key={i} color="cyan">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <span className="h-5 w-32 rounded bg-white/5 animate-pulse" />
                      <span className="h-4 w-14 rounded bg-white/5 animate-pulse" />
                    </div>
                    <span className="h-4 w-full rounded bg-white/5 animate-pulse" />
                    <span className="h-4 w-2/3 rounded bg-white/5 animate-pulse" />
                  </div>
                </NeonCard>
              ))
            : cocktails.map((cocktail) => (
                <NeonCard key={cocktail.id} color={cocktail.menu_categories?.neon_color ?? "cyan"}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold text-neon-cyan">
                        {cocktail.name}
                      </h3>
                      <span className="shrink-0 font-mono text-sm font-medium text-neon-gold">
                        {formatPrice(cocktail.price)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {cocktail.description}
                    </p>
                  </div>
                </NeonCard>
              ))}
        </div>
      </div>
    </section>
  )
}
