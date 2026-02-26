"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function updateReservationStatus(
  id: string,
  status: "confirmed" | "cancelled",
  adminNotes?: string,
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("reservations")
    .update({
      status,
      admin_notes: adminNotes ?? null,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/reservasjoner")
}

export async function deleteReservation(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("reservations").delete().eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/reservasjoner")
}
