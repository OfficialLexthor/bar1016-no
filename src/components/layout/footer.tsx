import Link from "next/link"
import { MapPin, Phone, Mail, Instagram, Facebook, Music } from "lucide-react"
import { NeonDivider } from "@/components/neon/neon-divider"
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  ADDRESS,
  CONTACT,
  SOCIAL_LINKS,
  NAV_ITEMS,
} from "@/lib/utils/constants"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-black/80 border-t border-white/5">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Logo + description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="1016"
                width={48}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              {SITE_DESCRIPTION}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-neon-pink transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-neon-cyan transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="size-5" />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-neon-gold transition-colors"
                aria-label="TikTok"
              >
                <Music className="size-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Navigasjon
            </h3>
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/50 hover:text-neon-cyan transition-colors w-fit"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact + opening hours */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Kontakt
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-neon-cyan mt-0.5 shrink-0" />
                <span className="text-sm text-white/50">{ADDRESS.full}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 text-neon-cyan shrink-0" />
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="text-sm text-white/50 hover:text-neon-cyan transition-colors"
                >
                  {CONTACT.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-neon-cyan shrink-0" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm text-white/50 hover:text-neon-cyan transition-colors"
                >
                  {CONTACT.email}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-semibold text-white/70 mb-2">
                Åpningstider
              </h4>
              <p className="text-sm text-white/40">
                Se oppdaterte åpningstider på vår kontaktside.
              </p>
            </div>
          </div>
        </div>

        <NeonDivider color="cyan" className="my-8" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs text-white/30">
            &copy; {currentYear} {SITE_NAME}. Alle rettigheter reservert.
          </p>
        </div>
      </div>
    </footer>
  )
}
