export function formatPrice(price: number): string {
  return `${price},-`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("nb", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatTime(timeString: string): string {
  return timeString.slice(0, 5)
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("nb", {
    day: "numeric",
    month: "short",
  })
}

export function formatNorwegianDay(dayOfWeek: number): string {
  const days = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"]
  return days[dayOfWeek]
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
