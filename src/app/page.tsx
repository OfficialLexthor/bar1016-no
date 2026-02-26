import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ParticleCanvas } from "@/components/neon/particle-canvas"
import { HeroSection } from "@/components/home/hero-section"
import { OpeningHoursSection } from "@/components/home/opening-hours-section"
import { FeaturedCocktailsSection } from "@/components/home/featured-cocktails-section"
import { UpcomingEventsSection } from "@/components/home/upcoming-events-section"
import { CampaignsSection } from "@/components/home/campaigns-section"
import { SITE_NAME, SITE_DESCRIPTION, ADDRESS, SITE_URL, SOCIAL_LINKS } from "@/lib/utils/constants"
import { getOpeningHours, buildOpeningHoursSchema } from "@/lib/queries/opening-hours"

export const metadata = {
  title: `${SITE_NAME} | Cocktails & Karaoke i Sarpsborg`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
}

export default async function HomePage() {
  const openingHours = await getOpeningHours()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.city,
      postalCode: ADDRESS.postalCode,
      addressCountry: "NO",
    },
    openingHoursSpecification: buildOpeningHoursSchema(openingHours),
    sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.facebook, SOCIAL_LINKS.tiktok],
    servesCuisine: "Cocktails",
    priceRange: "$$",
  }

  return (
    <>
      <ParticleCanvas />
      <Header />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <HeroSection />
        <OpeningHoursSection />
        <FeaturedCocktailsSection />
        <UpcomingEventsSection />
        <CampaignsSection />
      </main>
      <Footer />
    </>
  )
}
