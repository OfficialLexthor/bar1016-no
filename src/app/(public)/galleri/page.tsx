import type { Metadata } from "next"

import { SITE_NAME } from "@/lib/utils/constants"

export const metadata: Metadata = {
  title: "Galleri",
  description: `Bilder fra ${SITE_NAME}. Se atmosfaeren, cocktails og den gode stemningen hos oss.`,
}

export default function GalleriPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 neon-glow-purple text-neon-purple">
        Galleri
      </h1>
      <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
        Fa et innblikk i stemningen hos {SITE_NAME}.
      </p>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
        {/* Image cards will be rendered here when connected to Supabase Storage */}
        <div className="col-span-full text-center py-16 break-inside-avoid">
          <div className="rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-12 neon-border-purple max-w-lg mx-auto">
            <p className="text-gray-300 text-lg">
              Bilder fra baren kommer snart!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
