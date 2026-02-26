import type { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { SITE_NAME, SOCIAL_LINKS } from "@/lib/utils/constants"
import { formatDate, formatTime } from "@/lib/utils/format"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/types"

export const metadata: Metadata = {
  title: "Events",
  description: `Kommende events og arrangementer hos ${SITE_NAME}. Sjekk ut hva som skjer og ikke gå glipp av noe!`,
}

const EVENT_TYPE_LABELS: Record<Event["event_type"], string> = {
  karaoke: "Karaoke",
  dj: "DJ",
  tema: "Tema",
  annet: "Annet",
}

const EVENT_TYPE_COLORS: Record<Event["event_type"], string> = {
  karaoke: "text-neon-gold border-neon-gold/30 bg-neon-gold/10",
  dj: "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10",
  tema: "text-neon-pink border-neon-pink/30 bg-neon-pink/10",
  annet: "text-neon-purple border-neon-purple/30 bg-neon-purple/10",
}

export default async function EventsPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("event_date", today)
    .order("event_date")

  const { data: pastEvents } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .lt("event_date", today)
    .order("event_date", { ascending: false })
    .limit(6)

  const upcomingEvents = (events ?? []) as Event[]
  const recentPastEvents = (pastEvents ?? []) as Event[]

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 neon-glow-pink text-neon-pink">
        Events & Arrangementer
      </h1>
      <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
        Hos {SITE_NAME} skjer det alltid noe. Hold deg oppdatert på kommende events!
      </p>

      {upcomingEvents.length > 0 ? (
        <>
          <h2 className="text-2xl font-bold text-white mb-6">Kommende events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-6 neon-border-pink"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge className={EVENT_TYPE_COLORS[event.event_type]}>
                    {EVENT_TYPE_LABELS[event.event_type]}
                  </Badge>
                  <span className="text-sm text-gray-400">
                    {formatDate(event.event_date)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-gray-400 text-sm mb-3">
                    {event.description}
                  </p>
                )}
                <p className="text-sm text-neon-cyan">
                  Kl. {formatTime(event.start_time)}
                  {event.end_time && ` - ${formatTime(event.end_time)}`}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 mb-16">
          <div className="rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-12 neon-border-pink max-w-lg mx-auto">
            <p className="text-gray-300 text-lg mb-6">
              Ingen kommende events akkurat nå. Følg oss på sosiale medier
              for oppdateringer!
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-pink hover:neon-glow-pink transition-all duration-300 font-medium"
              >
                Instagram
              </a>
              <span className="text-gray-600">|</span>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-cyan hover:neon-glow-cyan transition-all duration-300 font-medium"
              >
                Facebook
              </a>
              <span className="text-gray-600">|</span>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-gold hover:neon-glow-gold transition-all duration-300 font-medium"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>
      )}

      {recentPastEvents.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-gray-500 mb-6">Tidligere events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
            {recentPastEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-white/5 bg-black/20 p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="border-white/10 text-gray-500">
                    {EVENT_TYPE_LABELS[event.event_type]}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatDate(event.event_date)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-400 mb-2">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-gray-500 text-sm">
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
