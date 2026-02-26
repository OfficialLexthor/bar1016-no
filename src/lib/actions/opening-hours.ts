"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function updateOpeningHours(
  hours: {
    day_of_week: number
    day_name: string
    is_open: boolean
    open_time: string | null
    close_time: string | null
  }[],
) {
  const supabase = await createClient()

  // Use upsert on day_of_week (unique constraint) so it works
  // whether the rows exist or not
  const { error } = await supabase
    .from("opening_hours")
    .upsert(
      hours.map((h) => ({
        day_of_week: h.day_of_week,
        day_name: h.day_name,
        is_open: h.is_open,
        open_time: h.open_time,
        close_time: h.close_time,
      })),
      { onConflict: "day_of_week" }
    )

  if (error) throw new Error(error.message)

  revalidatePath("/admin/apningstider")
  revalidatePath("/")
  revalidatePath("/kontakt")
  revalidatePath("/bordbestilling")
  revalidatePath("/om-oss")
}
