import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  BookOpen,
  UtensilsCrossed,
  Clock,
  MessageSquare,
  Megaphone,
  Users,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatDateShort, formatTime } from "@/lib/utils/format"
import type { Event, Reservation } from "@/types"

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  const [
    { count: reservationsToday },
    { count: pendingReservations },
    { count: activeEvents },
    { count: menuItems },
    { count: unreadMessages },
    { count: shiftsToday },
    { data: upcomingEvents },
    { data: recentPending },
  ] = await Promise.all([
    supabase
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .eq("date", today),
    supabase
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true)
      .gte("event_date", today),
    supabase
      .from("menu_items")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
    supabase
      .from("shifts")
      .select("*", { count: "exact", head: true })
      .eq("shift_date", today),
    supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .order("start_time", { ascending: true })
      .limit(5),
    supabase
      .from("reservations")
      .select("*")
      .eq("status", "pending")
      .order("date", { ascending: true })
      .order("time", { ascending: true })
      .limit(5),
  ])

  const stats = {
    reservationsToday: reservationsToday ?? 0,
    pendingReservations: pendingReservations ?? 0,
    activeEvents: activeEvents ?? 0,
    menuItems: menuItems ?? 0,
    unreadMessages: unreadMessages ?? 0,
    shiftsToday: shiftsToday ?? 0,
  }

  const events = (upcomingEvents ?? []) as Event[]
  const pending = (recentPending ?? []) as Reservation[]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Oversikt over 1016 Bar
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">
              Reservasjoner i dag
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">
              {stats.reservationsToday}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">
              Ventende reservasjoner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-neon-gold">
              {stats.pendingReservations}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">
              Aktive events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-neon-cyan">
              {stats.activeEvents}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">
              Menyitems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-neon-pink">
              {stats.menuItems}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">
              Vakter i dag
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-neon-green">
              {stats.shiftsToday}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          Hurtighandlinger
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/reservasjoner">
            <Card className="bg-[#1a1a1a] border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-3 p-4">
                <BookOpen className="h-5 w-5 text-neon-gold" />
                <div>
                  <p className="font-medium text-white">Se reservasjoner</p>
                  <p className="text-sm text-gray-400">
                    Behandle ventende reservasjoner
                  </p>
                </div>
                {stats.pendingReservations > 0 && (
                  <Badge className="ml-auto bg-neon-gold/10 text-neon-gold border-neon-gold/20">
                    {stats.pendingReservations}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/meny">
            <Card className="bg-[#1a1a1a] border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-3 p-4">
                <UtensilsCrossed className="h-5 w-5 text-neon-pink" />
                <div>
                  <p className="font-medium text-white">Rediger meny</p>
                  <p className="text-sm text-gray-400">
                    Legg til eller endre menyitems
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/events">
            <Card className="bg-[#1a1a1a] border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-3 p-4">
                <CalendarDays className="h-5 w-5 text-neon-cyan" />
                <div>
                  <p className="font-medium text-white">Administrer events</p>
                  <p className="text-sm text-gray-400">
                    Opprett og publiser events
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/vaktplan">
            <Card className="bg-[#1a1a1a] border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-3 p-4">
                <Users className="h-5 w-5 text-neon-cyan" />
                <div>
                  <p className="font-medium text-white">Vaktplan</p>
                  <p className="text-sm text-gray-400">
                    Ansatte, vakter og delbare lenker
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/kampanjer">
            <Card className="bg-[#1a1a1a] border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-3 p-4">
                <Megaphone className="h-5 w-5 text-neon-green" />
                <div>
                  <p className="font-medium text-white">Kampanjer</p>
                  <p className="text-sm text-gray-400">
                    Administrer aktive kampanjer
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/apningstider">
            <Card className="bg-[#1a1a1a] border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-3 p-4">
                <Clock className="h-5 w-5 text-neon-orange" />
                <div>
                  <p className="font-medium text-white">Åpningstider</p>
                  <p className="text-sm text-gray-400">
                    Oppdater åpningstider
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/meldinger">
            <Card className="bg-[#1a1a1a] border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-3 p-4">
                <MessageSquare className="h-5 w-5 text-neon-purple" />
                <div>
                  <p className="font-medium text-white">Meldinger</p>
                  <p className="text-sm text-gray-400">
                    Les kontaktmeldinger
                  </p>
                </div>
                {stats.unreadMessages > 0 && (
                  <Badge className="ml-auto bg-neon-purple/10 text-neon-purple border-neon-purple/20">
                    {stats.unreadMessages}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              Kommende events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-sm text-gray-500">
                Ingen kommende publiserte events.
              </p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-black/30 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">
                        {event.title}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatDateShort(event.event_date)} ·{" "}
                        {formatTime(event.start_time)}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-white/20 text-gray-300 shrink-0"
                    >
                      {event.event_type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/admin/events"
              className="inline-block mt-4 text-sm text-neon-cyan hover:underline"
            >
              Se alle →
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              Ventende reservasjoner
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pending.length === 0 ? (
              <p className="text-sm text-gray-500">
                Ingen ventende reservasjoner.
              </p>
            ) : (
              <div className="space-y-3">
                {pending.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-black/30 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">
                        {reservation.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatDateShort(reservation.date)} ·{" "}
                        {formatTime(reservation.time)} ·{" "}
                        {reservation.guests}{" "}
                        {reservation.guests === 1 ? "gjest" : "gjester"}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-white/20 text-gray-300 shrink-0"
                    >
                      {reservation.reservation_type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/admin/reservasjoner"
              className="inline-block mt-4 text-sm text-neon-gold hover:underline"
            >
              Se alle →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
