"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { NeonText } from "@/components/neon/neon-text"
import { NeonCard } from "@/components/neon/neon-card"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatTime } from "@/lib/utils/format"
import { createClient } from "@/lib/supabase/client"
import type { Event } from "@/types"

const EVENT_TYPE_LABELS: Record<Event["event_type"], string> = {
  karaoke: "Karaoke",
  dj: "DJ",
  tema: "Tema",
  annet: "Annet",
}

export function UpcomingEventsSection() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      const supabase = createClient()
      const today = new Date().toISOString().split("T")[0]
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .gte("event_date", today)
        .order("event_date")
        .limit(3)

      if (!error && data) {
        setEvents(data)
      }
      setLoading(false)
    }

    fetchEvents()
  }, [])

  if (!loading && events.length === 0) {
    return (
      <section className="py-16 px-4 md:py-24">
        <div className="mx-auto max-w-7xl">
          <NeonText
            color="pink"
            as="h2"
            className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Kommende Events
          </NeonText>

          <div className="mx-auto max-w-lg">
            <NeonCard color="pink" className="text-center">
              <p className="mb-6 text-lg text-muted-foreground">
                Følg med for kommende events!
              </p>
              <Link
                href="/events"
                className={cn(
                  "inline-flex h-10 items-center justify-center rounded-lg border-2 border-neon-pink px-6 text-sm font-semibold text-neon-pink transition-all",
                  "hover:bg-neon-pink/10 hover:shadow-[0_0_20px_rgba(217,60,239,0.3)]",
                  "neon-border-pink"
                )}
              >
                Se alle events
              </Link>
            </NeonCard>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 md:py-24">
      <div className="mx-auto max-w-7xl">
        <NeonText
          color="pink"
          as="h2"
          className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Kommende Events
        </NeonText>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <NeonCard key={i} color="pink">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                      <span className="h-5 w-20 rounded bg-white/5 animate-pulse" />
                      <span className="h-4 w-24 rounded bg-white/5 animate-pulse" />
                    </div>
                    <span className="h-5 w-40 rounded bg-white/5 animate-pulse" />
                    <span className="h-4 w-full rounded bg-white/5 animate-pulse" />
                    <span className="h-4 w-16 rounded bg-white/5 animate-pulse" />
                  </div>
                </NeonCard>
              ))
            : events.map((event) => (
                <NeonCard key={event.id} color="pink">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-neon-pink/30 text-neon-pink bg-neon-pink/10 text-xs">
                        {EVENT_TYPE_LABELS[event.event_type]}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {formatDate(event.event_date)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    <p className="text-sm text-neon-cyan">
                      Kl. {formatTime(event.start_time)}
                      {event.end_time && ` - ${formatTime(event.end_time)}`}
                    </p>
                  </div>
                </NeonCard>
              ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/events"
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-lg border-2 border-neon-pink px-6 text-sm font-semibold text-neon-pink transition-all",
              "hover:bg-neon-pink/10 hover:shadow-[0_0_20px_rgba(217,60,239,0.3)]",
              "neon-border-pink"
            )}
          >
            Se alle events
          </Link>
        </div>
      </div>
    </section>
  )
}
