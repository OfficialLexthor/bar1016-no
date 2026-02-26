import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="1016 Bar"
          width={200}
          height={200}
          className="mx-auto mb-6 drop-shadow-[0_0_40px_rgba(7,152,232,0.4)]"
        />
        <h1 className="mb-2 flex flex-col items-center gap-2 font-bold tracking-tight sm:flex-row sm:justify-center sm:gap-6">
          <span
            className={cn(
              "text-7xl text-neon-cyan neon-glow-cyan sm:text-8xl"
            )}
          >
            1016
          </span>
          <span
            className={cn(
              "text-6xl text-neon-pink neon-glow-pink sm:text-7xl"
            )}
          >
            BAR
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-md text-lg text-muted-foreground sm:text-xl">
          Premium Cocktails & Karaoke i Sarpsborg
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/meny"
            className={cn(
              "inline-flex h-12 items-center justify-center rounded-lg border-2 border-neon-cyan px-8 text-sm font-semibold text-neon-cyan transition-all",
              "hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(7,152,232,0.3)]",
              "neon-border-cyan"
            )}
          >
            Se menyen
          </Link>
          <Link
            href="/bordbestilling"
            className={cn(
              "inline-flex h-12 items-center justify-center rounded-lg border-2 border-neon-pink px-8 text-sm font-semibold text-neon-pink transition-all",
              "hover:bg-neon-pink/10 hover:shadow-[0_0_20px_rgba(217,60,239,0.3)]",
              "neon-border-pink"
            )}
          >
            Bestill bord
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground">
        <ChevronDown className="h-8 w-8" />
      </div>
    </section>
  )
}
