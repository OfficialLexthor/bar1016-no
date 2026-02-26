import { Instagram } from "lucide-react"
import { cn } from "@/lib/utils"
import { NeonText } from "@/components/neon/neon-text"
import { NeonCard } from "@/components/neon/neon-card"
import { SOCIAL_LINKS } from "@/lib/utils/constants"

export function CampaignsSection() {
  return (
    <section className="py-16 px-4 md:py-24">
      <div className="mx-auto max-w-7xl">
        <NeonText
          color="orange"
          as="h2"
          className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Tilbud & Kampanjer
        </NeonText>

        <div className="mx-auto max-w-lg">
          <NeonCard color="orange" className="text-center">
            <p className="mb-6 text-lg text-muted-foreground">
              Ingen aktive kampanjer akkurat nå. Følg oss på Instagram!
            </p>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-lg border-2 border-neon-orange px-6 text-sm font-semibold text-neon-orange transition-all",
                "hover:bg-neon-orange/10 hover:shadow-[0_0_20px_rgba(251,146,60,0.3)]",
                "neon-border-orange"
              )}
            >
              <Instagram className="h-4 w-4" />
              Følg @1016bar
            </a>
          </NeonCard>
        </div>
      </div>
    </section>
  )
}
