"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function markMessageAsRead(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/meldinger")
}

export async function deleteMessage(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/meldinger")
}
