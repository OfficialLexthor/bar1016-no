import Link from "next/link"
import { cn } from "@/lib/utils"
import { NeonText } from "@/components/neon/neon-text"
import { NeonCard } from "@/components/neon/neon-card"

export function UpcomingEventsSection() {
  return (
    <section className="py-16 px-4 md:py-24">
      <div className="mx-auto max-w-7xl">
        <NeonText
          color="pink"
          as="h2"
          className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Kommende Events
        </NeonText>

        <div className="mx-auto max-w-lg">
          <NeonCard color="pink" className="text-center">
            <p className="mb-6 text-lg text-muted-foreground">
              Følg med for kommende events!
            </p>
            <Link
              href="/events"
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-lg border-2 border-neon-pink px-6 text-sm font-semibold text-neon-pink transition-all",
                "hover:bg-neon-pink/10 hover:shadow-[0_0_20px_rgba(217,60,239,0.3)]",
                "neon-border-pink"
              )}
            >
              Se alle events
            </Link>
          </NeonCard>
        </div>
      </div>
    </section>
  )
}
