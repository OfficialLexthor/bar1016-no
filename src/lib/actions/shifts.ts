"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// /vakt/[token] er force-dynamic og trenger ingen revalidering —
// admin- og dashboard-sidene revalideres her.
function revalidate() {
  revalidatePath("/admin/vaktplan")
  revalidatePath("/admin")
}

export async function createEmployee(data: {
  name: string
  neon_color?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("employees").insert({
    name: data.name,
    neon_color: data.neon_color ?? "cyan",
  })

  if (error) throw new Error(error.message)
  revalidate()
}

export async function updateEmployee(
  id: string,
  data: {
    name?: string
    neon_color?: string
    is_active?: boolean
  },
) {
  const supabase = await createClient()
  const { error } = await supabase.from("employees").update(data).eq("id", id)

  if (error) throw new Error(error.message)
  revalidate()
}

export async function deleteEmployee(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("employees").delete().eq("id", id)

  if (error) throw new Error(error.message)
  revalidate()
}

export async function regenerateEmployeeToken(id: string): Promise<string> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("employees")
    .update({ share_token: crypto.randomUUID() })
    .eq("id", id)
    .select("share_token")
    .single()

  if (error) throw new Error(error.message)
  revalidate()
  return data.share_token
}

export async function createShift(data: {
  employee_id: string
  shift_date: string
  start_time: string
  end_time: string
  role?: string
  note?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("shifts").insert({
    employee_id: data.employee_id,
    shift_date: data.shift_date,
    start_time: data.start_time,
    end_time: data.end_time,
    role: data.role ?? null,
    note: data.note ?? null,
  })

  if (error) throw new Error(error.message)
  revalidate()
}

export async function updateShift(
  id: string,
  data: {
    employee_id?: string
    shift_date?: string
    start_time?: string
    end_time?: string
    role?: string | null
    note?: string | null
  },
) {
  const supabase = await createClient()
  const { error } = await supabase.from("shifts").update(data).eq("id", id)

  if (error) throw new Error(error.message)
  revalidate()
}

export async function deleteShift(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("shifts").delete().eq("id", id)

  if (error) throw new Error(error.message)
  revalidate()
}
