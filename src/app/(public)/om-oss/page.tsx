import type { Metadata } from "next"

import { SITE_NAME, ADDRESS } from "@/lib/utils/constants"

export const metadata: Metadata = {
  title: "Om oss",
  description: `Les om ${SITE_NAME} - cocktail- og karaokebar i ${ADDRESS.city}. Vår historie, konsept og atmosfære.`,
}

export default function OmOssPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 neon-glow-pink text-neon-pink">
        Om oss
      </h1>

      <div className="max-w-3xl mx-auto space-y-16">
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 neon-glow-cyan text-neon-cyan">
            Vår Historie
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              {SITE_NAME} åpnet dørene i hjertet av {ADDRESS.city} med en
              enkel visjon: å skape et sted der god stemning, unike cocktails
              og karaoke smelter sammen til en uforglemmelig opplevelse.
            </p>
            <p>
              Fra første dag har vi vært dedikert til å tilby noe mer enn bare
              en vanlig bar. Vi ønsket å bygge et samlingssted der mennesker
              kan slappe av, more seg og være seg selv -- enten det er over en
              signaturcocktail, en ølklassiker, eller bak mikrofonen på
              karaokescenen.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 neon-glow-gold text-neon-gold">
            Karaoke
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              Karaoke er en sentral del av {SITE_NAME}-opplevelsen. Vi har
              investert i førsteklasses lyd- og lysutstyr for å gi deg den
              beste sceneopplevelsen. Enten du er en erfaren sanger eller
              bare vil ha det gøy med venner, er vår karaokescene klar for deg.
            </p>
            <p>
              Med et enormt utvalg av sanger -- fra norske klassikere til
              internasjonale hits -- er det alltid noe for enhver smak.
              Bestill et eget karaokebord for en privat opplevelse, eller
              ta sjansen og syng foran hele baren!
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 neon-glow-purple text-neon-purple">
            Atmosfæren
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              Når du trer inn på {SITE_NAME}, møter du en atmosfære preget
              av neonlys, mørk eleganse og pulserende energi. Interiøret er
              designet for å skape en intim, men livlig stemning der
              kvelden kan ta den retningen du ønsker.
            </p>
            <p>
              Våre bartendere mikser cocktails med presisjon og lidenskap,
              og er alltid klare til å anbefale noe nytt fra menyen. Hos oss
              er det ikke bare en drink -- det er en opplevelse.
            </p>
            <p>
              Vi holder til i {ADDRESS.full}, og ønsker deg velkommen
              torsdag til lørdag fra klokken 18:00.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
