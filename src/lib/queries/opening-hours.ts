import { createClient } from "@/lib/supabase/server"
import type { OpeningHours } from "@/types"

export async function getOpeningHours(): Promise<OpeningHours[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("opening_hours")
    .select("*")
    .order("day_of_week")

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

/**
 * Build a human-readable summary of opening hours for inline text.
 * Example: "torsdag til lørdag fra klokken 18:00"
 */
export function formatOpeningHoursSummary(hours: OpeningHours[]): string {
  const openDays = hours.filter((h) => h.is_open)

  if (openDays.length === 0) {
    return "Se åpningstider"
  }

  const dayNames = openDays.map((d) => d.day_name.toLowerCase())
  const firstOpen = openDays[0]

  if (dayNames.length === 1) {
    return `${dayNames[0]} fra kl. ${firstOpen.open_time?.slice(0, 5)}`
  }

  return `${dayNames[0]} til ${dayNames[dayNames.length - 1]} fra kl. ${firstOpen.open_time?.slice(0, 5)}`
}

/**
 * Build Schema.org openingHoursSpecification from DB rows.
 */
export function buildOpeningHoursSchema(hours: OpeningHours[]) {
  const dayMap: Record<number, string> = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  }

  const openDays = hours.filter((h) => h.is_open)

  // Group by matching open_time + close_time
  const groups: Record<string, { days: string[]; opens: string; closes: string }> = {}
  for (const day of openDays) {
    const key = `${day.open_time}-${day.close_time}`
    if (!groups[key]) {
      groups[key] = {
        days: [],
        opens: day.open_time?.slice(0, 5) ?? "00:00",
        closes: day.close_time?.slice(0, 5) ?? "00:00",
      }
    }
    groups[key].days.push(dayMap[day.day_of_week])
  }

  return Object.values(groups).map((group) => ({
    "@type": "OpeningHoursSpecification" as const,
    dayOfWeek: group.days,
    opens: group.opens,
    closes: group.closes,
  }))
}
