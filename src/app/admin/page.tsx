import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CalendarDays,
  BookOpen,
  UtensilsCrossed,
  Clock,
  MessageSquare,
  Megaphone,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  const [
    { count: reservationsToday },
    { count: pendingReservations },
    { count: activeEvents },
    { count: menuItems },
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
      .gte("event_date", today),
    supabase
      .from("menu_items")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
  ])

  const stats = {
    reservationsToday: reservationsToday ?? 0,
    pendingReservations: pendingReservations ?? 0,
    activeEvents: activeEvents ?? 0,
    menuItems: menuItems ?? 0,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Oversikt over 1016 Bar
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
