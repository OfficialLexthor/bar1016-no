import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock } from "lucide-react"

import { SITE_NAME } from "@/lib/utils/constants"
import { formatDate, formatNorwegianDay, formatTime } from "@/lib/utils/format"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/types"

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

async function getEvent(id: string): Promise<Event | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single()

  return data as Event | null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) {
    return { title: "Event ikke funnet" }
  }

  return {
    title: event.title,
    description:
      event.description ??
      `${event.title} hos ${SITE_NAME} - ${formatDate(event.event_date)}`,
    openGraph: {
      title: `${event.title} | ${SITE_NAME}`,
      description:
        event.description ??
        `${event.title} hos ${SITE_NAME} - ${formatDate(event.event_date)}`,
      ...(event.image_url && { images: [{ url: event.image_url }] }),
    },
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) {
    notFound()
  }

  const eventDate = new Date(event.event_date)
  const dayOfWeek = formatNorwegianDay(eventDate.getDay())

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-pink transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Tilbake til events
      </Link>

      <div className="rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-8 neon-border-pink">
        <div className="flex items-center gap-3 mb-4">
          <Badge className={EVENT_TYPE_COLORS[event.event_type]}>
            {EVENT_TYPE_LABELS[event.event_type]}
          </Badge>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-6 neon-glow-pink text-neon-pink">
          {event.title}
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-neon-cyan" />
            <span>
              {dayOfWeek} {formatDate(event.event_date)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-neon-cyan" />
            <span>
              Kl. {formatTime(event.start_time)}
              {event.end_time && ` - ${formatTime(event.end_time)}`}
            </span>
          </div>
        </div>

        {event.image_url && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
        )}

        {event.description && (
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        )}
      </div>
    </div>
  )
}
