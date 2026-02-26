import type { Metadata } from "next"

import { cn } from "@/lib/utils"
import { SITE_NAME } from "@/lib/utils/constants"
import { formatPrice } from "@/lib/utils/format"
import { getNeonColor } from "@/lib/utils/neon-colors"
import { createClient } from "@/lib/supabase/server"
import type { MenuCategoryWithItems, NeonColor } from "@/types"

export const metadata: Metadata = {
  title: "Meny",
  description: `Utforsk drikkekartet hos ${SITE_NAME}. Signaturcocktails, klassikere, øl, vin, shots og mer.`,
}

export default async function MenyPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("menu_categories")
    .select(`
      *,
      menu_items (*)
    `)
    .eq("is_active", true)
    .order("sort_order")

  const categories = ((data ?? []) as MenuCategoryWithItems[]).map((cat) => ({
    ...cat,
    menu_items: cat.menu_items
      .filter((item) => item.is_active)
      .sort((a, b) => a.sort_order - b.sort_order),
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 neon-glow-cyan text-neon-cyan">
        Meny
      </h1>
      <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
        Utforsk vårt utvalg av cocktails, øl, vin og mer. Alle priser er i NOK.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const color = getNeonColor(category.neon_color as NeonColor)
          return (
            <div
              key={category.id}
              className={cn(
                "rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-6",
                `neon-border-${category.neon_color}`
              )}
            >
              <h2
                className={cn(
                  "text-xl font-bold mb-4",
                  `text-neon-${category.neon_color}`,
                  `neon-glow-${category.neon_color}`
                )}
              >
                {category.name}
              </h2>
              <ul className="space-y-3">
                {category.menu_items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-baseline justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <span className="text-white">{item.name}</span>
                      {item.description && (
                        <span className="text-gray-500 text-sm ml-2">
                          {item.description}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-300 tabular-nums whitespace-nowrap font-medium">
                      {formatPrice(item.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
