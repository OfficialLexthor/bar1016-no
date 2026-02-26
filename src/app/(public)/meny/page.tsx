import type { Metadata } from "next"

import { cn } from "@/lib/utils"
import { SITE_NAME } from "@/lib/utils/constants"
import { formatPrice } from "@/lib/utils/format"

export const metadata: Metadata = {
  title: "Meny",
  description: `Utforsk drikkekartet hos ${SITE_NAME}. Signaturcocktails, klassikere, ol, vin, shots og mer.`,
}

interface MenuItem {
  name: string
  description?: string
  price: number
}

interface MenuCategory {
  name: string
  neonColor: string
  glowClass: string
  borderClass: string
  items: MenuItem[]
}

const MENU_DATA: MenuCategory[] = [
  {
    name: "Signatur Cocktails",
    neonColor: "text-neon-cyan",
    glowClass: "neon-glow-cyan",
    borderClass: "neon-border-cyan",
    items: [
      { name: "Strawberry Daiquiri", price: 169 },
      { name: "Mojito", price: 169 },
      { name: "Mango Daiquiri", price: 169 },
      { name: "Long Island Ice Tea", price: 169 },
      { name: "Hugo Spritz", price: 169 },
      { name: "Aperol Spritz", price: 169 },
    ],
  },
  {
    name: "Klassiske Cocktails",
    neonColor: "text-neon-pink",
    glowClass: "neon-glow-pink",
    borderClass: "neon-border-pink",
    items: [
      { name: "Whiskey Sour", price: 159 },
      { name: "Sure Fotter", price: 159 },
      { name: "Snowball", price: 159 },
      { name: "Pink Russian", price: 159 },
      { name: "Moscow Mule", price: 159 },
      { name: "Mie's", price: 159 },
      { name: "Lennart", price: 159 },
      { name: "Dark & Stormy", price: 159 },
      { name: "Clover Club", price: 159 },
      { name: "Amaretto Sour", price: 159 },
      { name: "Aloe Vera", price: 159 },
    ],
  },
  {
    name: "Ol",
    neonColor: "text-neon-green",
    glowClass: "neon-glow-green",
    borderClass: "neon-border-green",
    items: [
      { name: "Mango IPA", description: "0,4l", price: 139 },
      { name: "Borg", description: "0,5l", price: 118 },
      { name: "Borg", description: "0,4l", price: 98 },
      { name: "Borg", description: "0,3l", price: 76 },
    ],
  },
  {
    name: "Flaskeol",
    neonColor: "text-neon-orange",
    glowClass: "neon-glow-orange",
    borderClass: "neon-border-orange",
    items: [
      { name: "Sol", price: 97 },
      { name: "Nogne O IPA", price: 109 },
      { name: "Heineken", price: 119 },
      { name: "Borg Lite", price: 119 },
    ],
  },
  {
    name: "Cider / Rusbrus",
    neonColor: "text-neon-red",
    glowClass: "neon-glow-red",
    borderClass: "neon-border-red",
    items: [
      { name: "Smirnoff Ice", price: 97 },
      { name: "Grevens Paere", price: 109 },
      { name: "Ginger Joe", price: 97 },
      { name: "Bulmers", price: 129 },
      { name: "Breezer", price: 97 },
    ],
  },
  {
    name: "Whiskey",
    neonColor: "text-neon-gold",
    glowClass: "neon-glow-gold",
    borderClass: "neon-border-gold",
    items: [
      { name: "Teeling Single Malt", price: 139 },
      { name: "Jack Daniels", price: 139 },
      { name: "Angels Envy", price: 149 },
    ],
  },
  {
    name: "Husets Vin",
    neonColor: "text-neon-purple",
    glowClass: "neon-glow-purple",
    borderClass: "neon-border-purple",
    items: [
      { name: "Prosecco", description: "Glass", price: 139 },
      { name: "Vin", description: "Glass", price: 139 },
      { name: "Vin", description: "Flaske", price: 599 },
    ],
  },
  {
    name: "Shots",
    neonColor: "text-neon-orange",
    glowClass: "neon-glow-orange",
    borderClass: "neon-border-orange",
    items: [
      { name: "Patron Silver Tequila", price: 129 },
      { name: "Over 20%", price: 119 },
      { name: "Under 20%", price: 109 },
    ],
  },
  {
    name: "Kaffe",
    neonColor: "text-neon-green",
    glowClass: "neon-glow-green",
    borderClass: "neon-border-green",
    items: [
      { name: "Kaffe m/Baileys", price: 139 },
      { name: "Irish Coffee", price: 159 },
      { name: "Kaffe", price: 50 },
    ],
  },
  {
    name: "Ovrig",
    neonColor: "text-neon-cyan",
    glowClass: "neon-glow-cyan",
    borderClass: "neon-border-cyan",
    items: [
      { name: "Otard Cognac", price: 139 },
      { name: "Brastad Cognac", price: 139 },
      { name: "Heineken alkoholfri", price: 55 },
      { name: "Brus", price: 50 },
    ],
  },
]

export default function MenyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 neon-glow-cyan text-neon-cyan">
        Meny
      </h1>
      <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
        Utforsk vart utvalg av cocktails, ol, vin og mer. Alle priser er i NOK.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MENU_DATA.map((category) => (
          <div
            key={category.name}
            className={cn(
              "rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-6",
              category.borderClass
            )}
          >
            <h2
              className={cn(
                "text-xl font-bold mb-4",
                category.neonColor,
                category.glowClass
              )}
            >
              {category.name}
            </h2>
            <ul className="space-y-3">
              {category.items.map((item, index) => (
                <li
                  key={`${item.name}-${index}`}
                  className="flex items-baseline justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="text-white">{item.name}</span>
                    {item.description && (
                      <span className="text-gray-500 text-sm ml-2">
                        {item.description}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-300 tabular-nums whitespace-nowrap font-medium">
                    {formatPrice(item.price)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
