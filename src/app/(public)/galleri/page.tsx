import type { Metadata } from "next"

import { SITE_NAME } from "@/lib/utils/constants"
import { createClient } from "@/lib/supabase/server"
import type { GalleryImage } from "@/types"

export const metadata: Metadata = {
  title: "Galleri",
  description: `Bilder fra ${SITE_NAME}. Se atmosfæren, cocktails og den gode stemningen hos oss.`,
}

export default async function GalleriPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order")

  const images = (data ?? []) as GalleryImage[]

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 neon-glow-purple text-neon-purple">
        Galleri
      </h1>
      <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
        Få et innblikk i stemningen hos {SITE_NAME}.
      </p>

      {images.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="mb-4 break-inside-avoid rounded-lg overflow-hidden border border-white/10 bg-black/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt ?? "Bilde fra 1016"}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-12 neon-border-purple max-w-lg mx-auto">
            <p className="text-gray-300 text-lg">
              Bilder fra baren kommer snart!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
