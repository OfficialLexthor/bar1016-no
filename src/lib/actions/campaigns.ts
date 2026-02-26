"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createCampaign(data: {
  title: string
  description?: string
  image_url?: string
  start_date: string
  end_date: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("campaigns").insert({
    title: data.title,
    description: data.description ?? null,
    image_url: data.image_url ?? null,
    start_date: data.start_date,
    end_date: data.end_date,
    is_active: true,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/admin/kampanjer")
  revalidatePath("/")
}

export async function updateCampaign(
  id: string,
  data: {
    title?: string
    description?: string | null
    image_url?: string | null
    start_date?: string
    end_date?: string
    is_active?: boolean
  },
) {
  const supabase = await createClient()
  const { error } = await supabase.from("campaigns").update(data).eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/kampanjer")
  revalidatePath("/")
}

export async function deleteCampaign(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("campaigns").delete().eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/kampanjer")
  revalidatePath("/")
}
