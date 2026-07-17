// Rene dato-hjelpere for vaktplanen. Norsk uke: mandag–søndag.

export function getMonday(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = d.getDay() // 0 = søndag
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

// Lokal YYYY-MM-DD — toISOString() gir feil dato mellom 00 og 02 i Oslo-tid
export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

export function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

// «Uke 30 · 20.–26. juli» (eller «Uke 5 · 27. jan.–2. feb.» på tvers av måneder)
export function formatWeekLabel(monday: Date): string {
  const sunday = addDays(monday, 6)
  const week = getISOWeekNumber(monday)
  const sameMonth = monday.getMonth() === sunday.getMonth()
  const startStr = sameMonth
    ? `${monday.getDate()}.`
    : monday.toLocaleDateString("nb", { day: "numeric", month: "short" })
  const endStr = sunday.toLocaleDateString("nb", { day: "numeric", month: "long" })
  return `Uke ${week} · ${startStr}–${endStr}`
}
