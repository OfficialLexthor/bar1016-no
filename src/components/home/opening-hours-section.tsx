"use client"

import { cn } from "@/lib/utils"
import { NeonText } from "@/components/neon/neon-text"
import { NeonCard } from "@/components/neon/neon-card"
import { DAY_NAMES } from "@/lib/utils/constants"

const OPENING_HOURS = [
  { dayOfWeek: 0, isOpen: false, openTime: null, closeTime: null },
  { dayOfWeek: 1, isOpen: false, openTime: null, closeTime: null },
  { dayOfWeek: 2, isOpen: false, openTime: null, closeTime: null },
  { dayOfWeek: 3, isOpen: false, openTime: null, closeTime: null },
  { dayOfWeek: 4, isOpen: true, openTime: "18:00", closeTime: "03:00" },
  { dayOfWeek: 5, isOpen: true, openTime: "18:00", closeTime: "03:00" },
  { dayOfWeek: 6, isOpen: true, openTime: "18:00", closeTime: "03:00" },
] as const

export function OpeningHoursSection() {
  const today = new Date().getDay()

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
            <ul className="space-y-3">
              {OPENING_HOURS.map((hours) => {
                const isToday = hours.dayOfWeek === today

                return (
                  <li
                    key={hours.dayOfWeek}
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
                      {DAY_NAMES[hours.dayOfWeek]}
                      {isToday && (
                        <span className="ml-2 text-xs text-neon-gold/70">
                          (i dag)
                        </span>
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        hours.isOpen
                          ? "font-medium text-neon-green"
                          : "text-muted-foreground"
                      )}
                    >
                      {hours.isOpen
                        ? `${hours.openTime} - ${hours.closeTime}`
                        : "Stengt"}
                    </span>
                  </li>
                )
              })}
            </ul>
          </NeonCard>
        </div>
      </div>
    </section>
  )
}
