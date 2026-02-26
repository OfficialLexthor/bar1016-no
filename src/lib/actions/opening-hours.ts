"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function updateOpeningHours(
  hours: {
    id: string
    is_open: boolean
    open_time: string | null
    close_time: string | null
  }[],
) {
  const supabase = await createClient()

  for (const hour of hours) {
    const { error } = await supabase
      .from("opening_hours")
      .update({
        is_open: hour.is_open,
        open_time: hour.open_time,
        close_time: hour.close_time,
      })
      .eq("id", hour.id)

    if (error) throw new Error(error.message)
  }

  revalidatePath("/admin/apningstider")
  revalidatePath("/")
  revalidatePath("/kontakt")
  revalidatePath("/bordbestilling")
  revalidatePath("/om-oss")
}
