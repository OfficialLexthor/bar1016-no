"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createGalleryImage(data: {
  url: string
  alt?: string
  sort_order?: number
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("gallery_images").insert({
    url: data.url,
    alt: data.alt ?? null,
    sort_order: data.sort_order ?? 0,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/admin/galleri")
  revalidatePath("/")
}

export async function deleteGalleryImage(id: string, storagePath: string) {
  const supabase = await createClient()

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from("gallery")
    .remove([storagePath])

  if (storageError) throw new Error(storageError.message)

  // Delete from database
  const { error: dbError } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", id)

  if (dbError) throw new Error(dbError.message)
  revalidatePath("/admin/galleri")
  revalidatePath("/")
}
