import type { Metadata } from "next"

import { SITE_NAME, ADDRESS } from "@/lib/utils/constants"

export const metadata: Metadata = {
  title: "Kontakt",
  description: `Ta kontakt med ${SITE_NAME}. Vi holder til i ${ADDRESS.full}. Send oss en melding eller ring oss.`,
}

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
