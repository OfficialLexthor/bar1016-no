import type { Metadata } from "next"

import { SITE_NAME, SOCIAL_LINKS } from "@/lib/utils/constants"

export const metadata: Metadata = {
  title: "Events",
  description: `Kommende events og arrangementer hos ${SITE_NAME}. Sjekk ut hva som skjer og ikke ga glipp av noe!`,
}

export default function EventsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 neon-glow-pink text-neon-pink">
        Events & Arrangementer
      </h1>
      <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
        Hos {SITE_NAME} skjer det alltid noe. Hold deg oppdatert pa kommende events!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Event cards will be rendered here when connected to Supabase */}
        <div className="col-span-full text-center py-16">
          <div className="rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-12 neon-border-pink max-w-lg mx-auto">
            <p className="text-gray-300 text-lg mb-6">
              Kommende events blir publisert her. Folg oss pa sosiale medier
              for oppdateringer!
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-pink hover:neon-glow-pink transition-all duration-300 font-medium"
              >
                Instagram
              </a>
              <span className="text-gray-600">|</span>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-cyan hover:neon-glow-cyan transition-all duration-300 font-medium"
              >
                Facebook
              </a>
              <span className="text-gray-600">|</span>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-gold hover:neon-glow-gold transition-all duration-300 font-medium"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
