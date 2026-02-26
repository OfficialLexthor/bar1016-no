import type { Metadata } from "next"
import { SITE_NAME } from "@/lib/utils/constants"
import { getOpeningHours, formatOpeningHoursSummary } from "@/lib/queries/opening-hours"
import { BordbestillingPageContent } from "@/components/bordbestilling/bordbestilling-page-content"

export const metadata: Metadata = {
  title: "Bordbestilling",
  description: `Reserver bord eller karaoke hos ${SITE_NAME}. Vi bekrefter reservasjonen på e-post.`,
}

export default async function BordbestillingPage() {
  const openingHours = await getOpeningHours()
  const summary = formatOpeningHoursSummary(openingHours)

  return <BordbestillingPageContent openingHoursSummary={summary} />
}
