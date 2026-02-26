"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { NeonColor } from "@/types"

export async function createMenuItem(data: {
  category_id: string
  name: string
  description?: string
  price: number
  sort_order?: number
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("menu_items").insert({
    category_id: data.category_id,
    name: data.name,
    description: data.description ?? null,
    price: data.price,
    sort_order: data.sort_order ?? 0,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/meny")
  revalidatePath("/admin/meny")
  revalidatePath("/tv-meny")
}

export async function updateMenuItem(
  id: string,
  data: {
    name?: string
    description?: string | null
    price?: number
    category_id?: string
    is_active?: boolean
    is_featured?: boolean
    sort_order?: number
  },
) {
  const supabase = await createClient()
  const { error } = await supabase.from("menu_items").update(data).eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/meny")
  revalidatePath("/admin/meny")
  revalidatePath("/tv-meny")
  revalidatePath("/")
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("menu_items").delete().eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/meny")
  revalidatePath("/admin/meny")
  revalidatePath("/tv-meny")
}

export async function createMenuCategory(data: {
  name: string
  slug: string
  neon_color: NeonColor
  sort_order?: number
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("menu_categories").insert({
    name: data.name,
    slug: data.slug,
    neon_color: data.neon_color,
    sort_order: data.sort_order ?? 0,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/meny")
  revalidatePath("/admin/meny")
  revalidatePath("/tv-meny")
}

export async function updateMenuCategory(
  id: string,
  data: {
    name?: string
    slug?: string
    neon_color?: NeonColor
    sort_order?: number
    is_active?: boolean
  },
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("menu_categories")
    .update(data)
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/meny")
  revalidatePath("/admin/meny")
  revalidatePath("/tv-meny")
}

export async function deleteMenuCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("menu_categories")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/meny")
  revalidatePath("/admin/meny")
  revalidatePath("/tv-meny")
}
