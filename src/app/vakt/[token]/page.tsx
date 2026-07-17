import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { createAdminClient } from "@/lib/supabase/admin"
import { formatTime } from "@/lib/utils/format"
import { getNeonColor } from "@/lib/utils/neon-colors"
import {
  getMonday,
  addDays,
  toISODate,
  getWeekDays,
  formatWeekLabel,
} from "@/lib/utils/week"
import type { ShiftWithEmployee } from "@/types"

// Alltid ferskt ved hver lasting — ingen realtime nødvendig
export const dynamic = "force-dynamic"

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const DAY_NAMES = [
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
  "Søndag",
]

function formatShiftDate(dateString: string): string {
  const s = new Date(dateString + "T12:00:00").toLocaleDateString("nb", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
  // Kun første bokstav stor — norske månedsnavn skal være små
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default async function VaktPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ uke?: string }>
}) {
  const { token } = await params
  const { uke } = await searchParams

  // Guard før spørring: .eq() mot uuid-kolonne med søppelstreng kaster Postgres-feil
  if (!UUID_REGEX.test(token)) notFound()

  const supabase = createAdminClient()

  const { data: employee } = await supabase
    .from("employees")
    .select("id, name, neon_color")
    .eq("share_token", token)
    .eq("is_active", true)
    .maybeSingle()

  if (!employee) notFound()

  const parsed = parseInt(uke ?? "0", 10)
  const offset = Math.max(-8, Math.min(8, Number.isNaN(parsed) ? 0 : parsed))

  const today = new Date()
  const todayISO = toISODate(today)
  const weekStart = addDays(getMonday(today), offset * 7)
  const weekDays = getWeekDays(weekStart)

  const [{ data: upcoming }, { data: weekShifts }] = await Promise.all([
    supabase
      .from("shifts")
      .select("*, employees(id, name, neon_color)")
      .eq("employee_id", employee.id)
      .gte("shift_date", todayISO)
      .order("shift_date", { ascending: true })
      .order("start_time", { ascending: true })
      .limit(5),
    supabase
      .from("shifts")
      .select("*, employees(id, name, neon_color)")
      .gte("shift_date", toISODate(weekStart))
      .lte("shift_date", toISODate(addDays(weekStart, 6)))
      .order("shift_date", { ascending: true })
      .order("start_time", { ascending: true }),
  ])

  const myUpcoming = (upcoming ?? []) as ShiftWithEmployee[]
  const allWeekShifts = (weekShifts ?? []) as ShiftWithEmployee[]
  const color = getNeonColor(employee.neon_color)

  // Kollegaer på samme dager som mine neste vakter (kan ligge utenfor synlig uke)
  const upcomingDates = [...new Set(myUpcoming.map((s) => s.shift_date))]
  let colleagueShifts: ShiftWithEmployee[] = []
  if (upcomingDates.length > 0) {
    const { data } = await supabase
      .from("shifts")
      .select("*, employees(id, name, neon_color)")
      .in("shift_date", upcomingDates)
      .neq("employee_id", employee.id)
      .order("start_time", { ascending: true })
    colleagueShifts = (data ?? []) as ShiftWithEmployee[]
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="max-w-md mx-auto px-4 py-8 space-y-8">
        <header className="text-center space-y-1">
          <p className="text-sm text-gray-400 uppercase tracking-widest">
            1016 Bar · Vaktplan
          </p>
          <h1
            className={`text-3xl font-bold ${color.textClass} ${color.glowClass}`}
          >
            Hei, {employee.name}!
          </h1>
        </header>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            Dine neste vakter
          </h2>
          {myUpcoming.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Du har ingen kommende vakter.
            </p>
          ) : (
            <div className="space-y-3">
              {myUpcoming.map((shift) => (
                <div
                  key={shift.id}
                  className={`rounded-xl border ${color.borderClass}/40 bg-white/[0.03] p-4`}
                  style={{ boxShadow: `0 0 12px ${color.shadowColor}` }}
                >
                  <p className="font-semibold">
                    {formatShiftDate(shift.shift_date)}
                  </p>
                  <p className={`text-xl font-bold ${color.textClass}`}>
                    {formatTime(shift.start_time)}–{formatTime(shift.end_time)}
                  </p>
                  {shift.role && (
                    <p className="text-sm text-gray-400">{shift.role}</p>
                  )}
                  {shift.note && (
                    <p className="text-sm text-gray-500 mt-1">{shift.note}</p>
                  )}
                  {(() => {
                    const colleagues = colleagueShifts.filter(
                      (c) => c.shift_date === shift.shift_date,
                    )
                    if (colleagues.length === 0) return null
                    return (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <p className="text-xs text-gray-500 mb-1">Sammen med</p>
                        <div className="space-y-0.5">
                          {colleagues.map((c) => (
                            <p key={c.id} className="text-sm">
                              <span
                                className={
                                  getNeonColor(
                                    c.employees?.neon_color ?? "cyan",
                                  ).textClass
                                }
                              >
                                {c.employees?.name ?? "Ukjent"}
                              </span>{" "}
                              <span className="text-gray-400">
                                {formatTime(c.start_time)}–
                                {formatTime(c.end_time)}
                              </span>
                              {c.role && (
                                <span className="text-gray-500"> · {c.role}</span>
                              )}
                            </p>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Hele uken</h2>

          <div className="flex items-center justify-between mb-4">
            {offset > -8 ? (
              <Link
                href={`/vakt/${token}?uke=${offset - 1}`}
                className="p-2 text-gray-400 hover:text-white"
                aria-label="Forrige uke"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
            ) : (
              <span className="p-2 text-gray-700">
                <ChevronLeft className="h-5 w-5" />
              </span>
            )}
            <div className="text-center">
              <p className="text-sm font-medium text-white">
                {formatWeekLabel(weekStart)}
              </p>
              {offset !== 0 && (
                <Link
                  href={`/vakt/${token}`}
                  className="text-xs text-gray-400 underline hover:text-white"
                >
                  Til denne uken
                </Link>
              )}
            </div>
            {offset < 8 ? (
              <Link
                href={`/vakt/${token}?uke=${offset + 1}`}
                className="p-2 text-gray-400 hover:text-white"
                aria-label="Neste uke"
              >
                <ChevronRight className="h-5 w-5" />
              </Link>
            ) : (
              <span className="p-2 text-gray-700">
                <ChevronRight className="h-5 w-5" />
              </span>
            )}
          </div>

          <div className="space-y-3">
            {weekDays.map((day, i) => {
              const dayISO = toISODate(day)
              const dayShifts = allWeekShifts.filter(
                (s) => s.shift_date === dayISO,
              )
              const isToday = dayISO === todayISO
              return (
                <div
                  key={dayISO}
                  className={`rounded-xl border p-3 ${
                    isToday
                      ? "border-white/30 bg-white/[0.05]"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="font-semibold text-sm">{DAY_NAMES[i]}</p>
                    <p className="text-xs text-gray-500">
                      {day.toLocaleDateString("nb", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    {isToday && (
                      <span className="text-xs text-gray-300 border border-white/20 rounded-full px-2">
                        I dag
                      </span>
                    )}
                  </div>
                  {dayShifts.length === 0 ? (
                    <p className="text-xs text-gray-600">Ingen vakter</p>
                  ) : (
                    <div className="space-y-1.5">
                      {dayShifts.map((shift) => {
                        const isMine = shift.employee_id === employee.id
                        const shiftColor = getNeonColor(
                          shift.employees?.neon_color ?? "cyan",
                        )
                        return (
                          <div
                            key={shift.id}
                            className={`flex items-center gap-2 text-sm rounded-lg px-2 py-1.5 ${
                              isMine
                                ? "bg-white/[0.06] font-semibold"
                                : "text-gray-400"
                            }`}
                          >
                            <span
                              className={
                                isMine
                                  ? `${shiftColor.textClass}`
                                  : shiftColor.textClass + " opacity-70"
                              }
                            >
                              {shift.employees?.name ?? "Ukjent"}
                            </span>
                            <span className={isMine ? "text-white" : ""}>
                              {formatTime(shift.start_time)}–
                              {formatTime(shift.end_time)}
                            </span>
                            {shift.role && (
                              <span className="text-xs text-gray-500">
                                {shift.role}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <footer className="text-center text-xs text-gray-600 pt-4">
          Lenken er personlig. Siden viser alltid oppdatert vaktplan.
        </footer>
      </div>
    </main>
  )
}
