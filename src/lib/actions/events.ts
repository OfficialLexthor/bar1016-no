"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createEvent(data: {
  title: string
  description?: string
  event_date: string
  start_time: string
  end_time?: string
  event_type: string
  image_url?: string
  is_published?: boolean
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("events").insert({
    title: data.title,
    description: data.description ?? null,
    event_date: data.event_date,
    start_time: data.start_time,
    end_time: data.end_time ?? null,
    event_type: data.event_type,
    image_url: data.image_url ?? null,
    is_published: data.is_published ?? true,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/events")
  revalidatePath("/admin/events")
  revalidatePath("/")
}

export async function updateEvent(
  id: string,
  data: {
    title?: string
    description?: string | null
    event_date?: string
    start_time?: string
    end_time?: string | null
    event_type?: string
    image_url?: string | null
    is_published?: boolean
  },
) {
  const supabase = await createClient()
  const { error } = await supabase.from("events").update(data).eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/events")
  revalidatePath("/admin/events")
  revalidatePath("/")
}

export async function deleteEvent(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/events")
  revalidatePath("/admin/events")
  revalidatePath("/")
}
