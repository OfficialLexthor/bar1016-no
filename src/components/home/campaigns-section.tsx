"use client"

import { useEffect, useState } from "react"
import { Instagram } from "lucide-react"
import { cn } from "@/lib/utils"
import { NeonText } from "@/components/neon/neon-text"
import { NeonCard } from "@/components/neon/neon-card"
import { SOCIAL_LINKS } from "@/lib/utils/constants"
import { createClient } from "@/lib/supabase/client"
import type { Campaign } from "@/types"

export function CampaignsSection() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCampaigns() {
      const supabase = createClient()
      const today = new Date().toISOString().split("T")[0]
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("is_active", true)
        .lte("start_date", today)
        .gte("end_date", today)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setCampaigns(data)
      }
      setLoading(false)
    }

    fetchCampaigns()
  }, [])

  if (!loading && campaigns.length === 0) {
    return (
      <section className="py-16 px-4 md:py-24">
        <div className="mx-auto max-w-7xl">
          <NeonText
            color="orange"
            as="h2"
            className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Tilbud & Kampanjer
          </NeonText>

          <div className="mx-auto max-w-lg">
            <NeonCard color="orange" className="text-center">
              <p className="mb-6 text-lg text-muted-foreground">
                Ingen aktive kampanjer akkurat nå. Følg oss på Instagram!
              </p>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border-2 border-neon-orange px-6 text-sm font-semibold text-neon-orange transition-all",
                  "hover:bg-neon-orange/10 hover:shadow-[0_0_20px_rgba(251,146,60,0.3)]",
                  "neon-border-orange"
                )}
              >
                <Instagram className="h-4 w-4" />
                Følg @1016bar
              </a>
            </NeonCard>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 md:py-24">
      <div className="mx-auto max-w-7xl">
        <NeonText
          color="orange"
          as="h2"
          className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Tilbud & Kampanjer
        </NeonText>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
                <NeonCard key={i} color="orange">
                  <div className="flex flex-col gap-3">
                    <span className="h-5 w-40 rounded bg-white/5 animate-pulse" />
                    <span className="h-4 w-full rounded bg-white/5 animate-pulse" />
                    <span className="h-4 w-2/3 rounded bg-white/5 animate-pulse" />
                  </div>
                </NeonCard>
              ))
            : campaigns.map((campaign) => (
                <NeonCard key={campaign.id} color="orange">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-neon-orange">
                      {campaign.title}
                    </h3>
                    {campaign.description && (
                      <p className="text-sm text-muted-foreground">
                        {campaign.description}
                      </p>
                    )}
                  </div>
                </NeonCard>
              ))}
        </div>
      </div>
    </section>
  )
}
