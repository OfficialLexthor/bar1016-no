"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Save } from "lucide-react"
import { toast } from "sonner"
import { DAY_NAMES } from "@/lib/utils/constants"
import { cn } from "@/lib/utils"
import type { OpeningHours } from "@/types"

// Default opening hours: Thu/Fri/Sat 18:00-03:00, others closed
// DAY_NAMES is indexed 0=Sunday through 6=Saturday
function getDefaultHours(): OpeningHours[] {
  return DAY_NAMES.map((dayName, index) => {
    const isOpen = index === 4 || index === 5 || index === 6 // Thu, Fri, Sat
    return {
      id: String(index),
      day_of_week: index,
      day_name: dayName,
      is_open: isOpen,
      open_time: isOpen ? "18:00" : null,
      close_time: isOpen ? "03:00" : null,
    }
  })
}

export default function AdminOpeningHoursPage() {
  // TODO: Replace with Supabase queries when connected
  const [hours, setHours] = useState<OpeningHours[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setHours(getDefaultHours())
    setLoading(false)
  }, [])

  function updateHour(index: number, field: keyof OpeningHours, value: string | boolean) {
    setHours((prev) =>
      prev.map((h, i) => {
        if (i !== index) return h
        if (field === "is_open") {
          return {
            ...h,
            is_open: value as boolean,
            open_time: value ? "18:00" : null,
            close_time: value ? "03:00" : null,
          }
        }
        return { ...h, [field]: value }
      })
    )
  }

  async function handleSave() {
    setSaving(true)
    // TODO: Save to Supabase
    await new Promise((resolve) => setTimeout(resolve, 500))
    toast.success("Apningstider lagret")
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 bg-white/5" />
        <Skeleton className="h-96 w-full bg-white/5" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Apningstider</h1>
        <p className="text-gray-400 mt-1">
          Rediger apningstidene for 1016 Bar
        </p>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10 max-w-2xl">
        <CardHeader>
          <CardTitle className="text-white">Ukentlige apningstider</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {hours.map((hour, index) => (
            <div key={hour.id}>
              <div className="flex items-center gap-4 py-3">
                <div className="w-28 shrink-0">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      hour.is_open ? "text-white" : "text-gray-500"
                    )}
                  >
                    {hour.day_name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`open-${index}`}
                    checked={hour.is_open}
                    onChange={(e) =>
                      updateHour(index, "is_open", e.target.checked)
                    }
                    className="rounded border-white/20 bg-black/40"
                  />
                  <Label
                    htmlFor={`open-${index}`}
                    className={cn(
                      "text-sm",
                      hour.is_open ? "text-green-400" : "text-gray-500"
                    )}
                  >
                    {hour.is_open ? "Apent" : "Stengt"}
                  </Label>
                </div>

                {hour.is_open && (
                  <div className="flex items-center gap-2 ml-auto">
                    <Input
                      type="time"
                      value={hour.open_time ?? ""}
                      onChange={(e) =>
                        updateHour(index, "open_time", e.target.value)
                      }
                      className="w-28 bg-black/40 border-white/10 text-white text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <Input
                      type="time"
                      value={hour.close_time ?? ""}
                      onChange={(e) =>
                        updateHour(index, "close_time", e.target.value)
                      }
                      className="w-28 bg-black/40 border-white/10 text-white text-sm"
                    />
                  </div>
                )}
              </div>
              {index < hours.length - 1 && (
                <Separator className="bg-white/5" />
              )}
            </div>
          ))}

          <div className="pt-4">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Lagrer..." : "Lagre apningstider"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
