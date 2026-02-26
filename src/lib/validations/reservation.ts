import { z } from "zod/v4"

export const reservationSchema = z.object({
  name: z.string().min(2, "Navn må være minst 2 tegn"),
  email: z.email("Ugyldig e-postadresse"),
  phone: z.string().min(8, "Ugyldig telefonnummer"),
  date: z.string().min(1, "Velg en dato"),
  time: z.string().min(1, "Velg et tidspunkt"),
  guests: z.number().min(1, "Minst 1 gjest").max(30, "Maks 30 gjester"),
  reservation_type: z.enum(["bord", "karaoke"]),
  message: z.string().optional(),
})

export type ReservationFormData = z.infer<typeof reservationSchema>
