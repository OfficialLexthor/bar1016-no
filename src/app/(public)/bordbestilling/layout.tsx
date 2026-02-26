import type { Metadata } from "next"

import { SITE_NAME } from "@/lib/utils/constants"

export const metadata: Metadata = {
  title: "Bordbestilling",
  description: `Bestill bord eller karaoke hos ${SITE_NAME}. Vi har åpent torsdag til lørdag fra 18:00.`,
}

export default function BordbestillingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
