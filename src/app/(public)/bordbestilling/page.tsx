"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import {
  reservationSchema,
  type ReservationFormData,
} from "@/lib/validations/reservation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const INPUT_CLASSES =
  "bg-black/40 border-white/10 text-white placeholder:text-gray-500"

function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let hour = 18; hour <= 25; hour++) {
    const displayHour = hour >= 24 ? hour - 24 : hour
    const hourStr = displayHour.toString().padStart(2, "0")
    slots.push(`${hourStr}:00`)
    if (hour < 25) {
      slots.push(`${hourStr}:30`)
    }
  }
  return slots
}

const TIME_SLOTS = generateTimeSlots()

export default function BordbestillingPage() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      reservation_type: "bord",
    },
  })

  async function onSubmit(data: ReservationFormData) {
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Noe gikk galt")
      }

      toast.success(
        "Reservasjonen er mottatt! Du vil fa en bekreftelse pa e-post."
      )
      reset()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ukjent feil"
      toast.error(`Kunne ikke sende reservasjon: ${message}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 neon-glow-gold text-neon-gold">
        Bordbestilling
      </h1>
      <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
        Reserver bord eller karaoke for a sikre deg plass. Vi bekrefter
        reservasjonen pa e-post.
      </p>

      <div className="max-w-2xl mx-auto">
        <div className="rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-8 neon-border-gold">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Navn</Label>
                <Input
                  id="name"
                  placeholder="Ditt navn"
                  className={INPUT_CLASSES}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="din@epost.no"
                  className={INPUT_CLASSES}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+47 ..."
                className={INPUT_CLASSES}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-400">{errors.phone.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="date">Dato</Label>
                <Input
                  id="date"
                  type="date"
                  className={INPUT_CLASSES}
                  {...register("date")}
                />
                {errors.date && (
                  <p className="text-sm text-red-400">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Tidspunkt</Label>
                <Controller
                  control={control}
                  name="time"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={cn(INPUT_CLASSES, "w-full")}>
                        <SelectValue placeholder="Velg tid" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.time && (
                  <p className="text-sm text-red-400">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="guests">Antall gjester</Label>
                <Input
                  id="guests"
                  type="number"
                  min={1}
                  max={30}
                  placeholder="Antall"
                  className={INPUT_CLASSES}
                  {...register("guests", { valueAsNumber: true })}
                />
                {errors.guests && (
                  <p className="text-sm text-red-400">
                    {errors.guests.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Type reservasjon</Label>
                <Controller
                  control={control}
                  name="reservation_type"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={cn(INPUT_CLASSES, "w-full")}>
                        <SelectValue placeholder="Velg type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bord">Bord</SelectItem>
                        <SelectItem value="karaoke">Karaoke</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.reservation_type && (
                  <p className="text-sm text-red-400">
                    {errors.reservation_type.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Melding <span className="text-gray-500">(valgfritt)</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Spesielle onsker, allergier, feiring, etc."
                rows={4}
                className={cn(INPUT_CLASSES, "min-h-[100px]")}
                {...register("message")}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? "Sender..." : "Send reservasjon"}
            </Button>
          </form>
        </div>

        <div className="mt-8 rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-6 text-center">
          <p className="text-gray-400 text-sm">
            Vi har apent <span className="text-white font-medium">torsdag til lordag fra kl. 18:00</span>.
            Reservasjoner bekreftes pa e-post innen 24 timer. For hastesaker,
            ring oss direkte.
          </p>
        </div>
      </div>
    </div>
  )
}
