import { NeonText } from "@/components/neon/neon-text"
import { NeonCard } from "@/components/neon/neon-card"
import { formatPrice } from "@/lib/utils/format"

const FEATURED_COCKTAILS = [
  {
    name: "Espresso Martini",
    description: "Vodka, kaffelikør, fersk espresso og enkelt sirup.",
    price: 169,
  },
  {
    name: "Negroni",
    description: "Gin, Campari og søt vermut. En klassiker som aldri svikter.",
    price: 169,
  },
  {
    name: "Passionfruit Martini",
    description:
      "Vodka, pasjonsfruktpuré, vaniljesirup og lime. Frisk og fruktig.",
    price: 169,
  },
  {
    name: "Old Fashioned",
    description: "Bourbon, angostura bitters, sukker og appelsinskall.",
    price: 169,
  },
  {
    name: "Aperol Spritz",
    description: "Aperol, prosecco og dask av sodavann. Sommerens favoritt.",
    price: 169,
  },
  {
    name: "Mojito",
    description: "Hvit rom, limejuice, sukker, mynte og sodavann.",
    price: 169,
  },
] as const

export function FeaturedCocktailsSection() {
  return (
    <section className="py-16 px-4 md:py-24">
      <div className="mx-auto max-w-7xl">
        <NeonText
          color="cyan"
          as="h2"
          className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Utvalgte Cocktails
        </NeonText>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_COCKTAILS.map((cocktail) => (
            <NeonCard key={cocktail.name} color="cyan">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-neon-cyan">
                    {cocktail.name}
                  </h3>
                  <span className="shrink-0 font-mono text-sm font-medium text-neon-gold">
                    {formatPrice(cocktail.price)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {cocktail.description}
                </p>
              </div>
            </NeonCard>
          ))}
        </div>
      </div>
    </section>
  )
}
