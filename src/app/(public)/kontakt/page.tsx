import type { Metadata } from "next"
import { SITE_NAME } from "@/lib/utils/constants"
import { getOpeningHours } from "@/lib/queries/opening-hours"
import { KontaktPageContent } from "@/components/kontakt/kontakt-page-content"

export const metadata: Metadata = {
  title: "Kontakt oss",
  description: `Ta kontakt med ${SITE_NAME}. Send oss en melding eller finn kontaktinformasjon og åpningstider.`,
}

export default async function KontaktPage() {
  const openingHours = await getOpeningHours()

  return <KontaktPageContent openingHours={openingHours} />
}
