"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { contactSchema, type ContactFormData } from "@/lib/validations/contact"
import { ADDRESS, CONTACT } from "@/lib/utils/constants"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const INPUT_CLASSES = "bg-black/40 border-white/10 text-white placeholder:text-gray-500"

export default function KontaktPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(data: ContactFormData) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Noe gikk galt")
      }

      toast.success("Meldingen din er sendt! Vi tar kontakt så snart vi kan.")
      reset()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ukjent feil"
      toast.error(`Kunne ikke sende melding: ${message}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 neon-glow-cyan text-neon-cyan">
        Kontakt oss
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-8 neon-border-cyan">
          <h2 className="text-xl font-bold text-white mb-6">
            Send oss en melding
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <div className="space-y-2">
              <Label htmlFor="phone">
                Telefon <span className="text-gray-500">(valgfritt)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+47 ..."
                className={INPUT_CLASSES}
                {...register("phone")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Emne</Label>
              <Input
                id="subject"
                placeholder="Hva gjelder henvendelsen?"
                className={INPUT_CLASSES}
                {...register("subject")}
              />
              {errors.subject && (
                <p className="text-sm text-red-400">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Melding</Label>
              <Textarea
                id="message"
                placeholder="Skriv din melding her..."
                rows={5}
                className={cn(INPUT_CLASSES, "min-h-[120px]")}
                {...register("message")}
              />
              {errors.message && (
                <p className="text-sm text-red-400">{errors.message.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? "Sender..." : "Send melding"}
            </Button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div className="rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-6">
              Kontaktinformasjon
            </h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <MapPin className="size-5 text-neon-cyan mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-white">Adresse</p>
                  <p className="text-gray-400">{ADDRESS.street}</p>
                  <p className="text-gray-400">
                    {ADDRESS.postalCode} {ADDRESS.city}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="size-5 text-neon-pink mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-white">Telefon</p>
                  <a
                    href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                    className="text-gray-400 hover:text-neon-pink transition-colors"
                  >
                    {CONTACT.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail className="size-5 text-neon-gold mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-white">E-post</p>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-gray-400 hover:text-neon-gold transition-colors"
                  >
                    {CONTACT.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Clock className="size-5 text-neon-green mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-white">Åpningstider</p>
                  <p className="text-gray-400">Torsdag - Lørdag: 18:00 - 03:00</p>
                  <p className="text-gray-400">Søndag - Onsdag: Stengt</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Map Placeholder */}
          <div className="rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden">
            <div className="aspect-[4/3] flex items-center justify-center bg-black/60">
              <div className="text-center">
                <MapPin className="size-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Kart kommer snart
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  {ADDRESS.full}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
