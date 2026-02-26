import { z } from "zod/v4"

export const contactSchema = z.object({
  name: z.string().min(2, "Navn må være minst 2 tegn"),
  email: z.email("Ugyldig e-postadresse"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Emne må være minst 2 tegn"),
  message: z.string().min(10, "Melding må være minst 10 tegn"),
})

export type ContactFormData = z.infer<typeof contactSchema>
