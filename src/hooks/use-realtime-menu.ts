"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { MenuCategoryWithItems } from "@/types"

export function useRealtimeMenu() {
  const [categories, setCategories] = useState<MenuCategoryWithItems[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMenu = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("menu_categories")
      .select(`
        *,
        menu_items (*)
      `)
      .eq("is_active", true)
      .order("sort_order")

    if (error) {
      console.error("Error fetching menu:", error)
      return
    }

    const sorted = (data as MenuCategoryWithItems[]).map((cat) => ({
      ...cat,
      menu_items: cat.menu_items
        .filter((item) => item.is_active)
        .sort((a, b) => a.sort_order - b.sort_order),
    }))

    setCategories(sorted)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchMenu()

    const supabase = createClient()

    const itemsChannel = supabase
      .channel("menu_items_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items" },
        () => fetchMenu(),
      )
      .subscribe()

    const categoriesChannel = supabase
      .channel("menu_categories_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_categories" },
        () => fetchMenu(),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(itemsChannel)
      supabase.removeChannel(categoriesChannel)
    }
  }, [fetchMenu])

  return { categories, loading }
}
