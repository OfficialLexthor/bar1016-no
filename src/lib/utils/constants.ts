export const SITE_NAME = "1016 Bar"
export const SITE_DESCRIPTION = "Cocktail- og karaokebar i Sarpsborg. Premium drinks, karaoke og god stemning i St. Marie gate 105."
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bar1016.no"

export const ADDRESS = {
  street: "St. Marie gate 105",
  postalCode: "1706",
  city: "Sarpsborg",
  country: "Norge",
  full: "St. Marie gate 105, 1706 Sarpsborg",
}

export const CONTACT = {
  phone: "+47 972 86 113",
  email: "post@bar1016.no",
}

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/1016sarp",
  facebook: "https://www.facebook.com/1016sarp",
  tiktok: "https://www.tiktok.com/@1016bar",
}

export const NAV_ITEMS = [
  { label: "Hjem", href: "/" },
  { label: "Meny", href: "/meny" },
  { label: "Om oss", href: "/om-oss" },
  { label: "Events", href: "/events" },
  { label: "Galleri", href: "/galleri" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Bordbestilling", href: "/bordbestilling" },
] as const

export const DAY_NAMES = [
  "Søndag",
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
] as const
