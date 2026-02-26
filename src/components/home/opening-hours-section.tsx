"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { NeonText } from "@/components/neon/neon-text"
import { NeonCard } from "@/components/neon/neon-card"
import { DAY_NAMES } from "@/lib/utils/constants"
import { createClient } from "@/lib/supabase/client"
import type { OpeningHours } from "@/types"

export function OpeningHoursSection() {
  const [hours, setHours] = useState<OpeningHours[]>([])
  const [loading, setLoading] = useState(true)
  const today = new Date().getDay()

  useEffect(() => {
    async function fetchHours() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("opening_hours")
        .select("*")
        .order("day_of_week")

      if (!error && data) {
        setHours(data)
      }
      setLoading(false)
    }

    fetchHours()
  }, [])

  return (
    <section className="py-16 px-4 md:py-24">
      <div className="mx-auto max-w-7xl">
        <NeonText
          color="gold"
          as="h2"
          className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Åpningstider
        </NeonText>

        <div className="mx-auto max-w-md">
          <NeonCard color="gold">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg px-4 py-2"
                  >
                    <span className="h-4 w-20 rounded bg-white/5 animate-pulse" />
                    <span className="h-4 w-24 rounded bg-white/5 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {hours.map((hour) => {
                  const isToday = hour.day_of_week === today

                  return (
                    <li
                      key={hour.day_of_week}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-4 py-2 transition-colors",
                        isToday && "bg-neon-gold/10"
                      )}
                    >
                      <span
                        className={cn(
                          "font-medium",
                          isToday
                            ? "text-neon-gold neon-glow-gold"
                            : "text-foreground"
                        )}
                      >
                        {DAY_NAMES[hour.day_of_week]}
                        {isToday && (
                          <span className="ml-2 text-xs text-neon-gold/70">
                            (i dag)
                          </span>
                        )}
                      </span>
                      <span
                        className={cn(
                          "text-sm",
                          hour.is_open
                            ? "font-medium text-neon-green"
                            : "text-muted-foreground"
                        )}
                      >
                        {hour.is_open
                          ? `${hour.open_time?.slice(0, 5)} - ${hour.close_time?.slice(0, 5)}`
                          : "Stengt"}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </NeonCard>
        </div>
      </div>
    </section>
  )
}
