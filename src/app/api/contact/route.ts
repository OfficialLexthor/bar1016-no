import { NextResponse } from "next/server"
import { contactSchema } from "@/lib/validations/contact"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ugyldig data", details: parsed.error.issues },
        { status: 400 },
      )
    }

    const supabase = createAdminClient()
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      subject: parsed.data.subject,
      message: parsed.data.message,
    })

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: "Kunne ikke sende melding" },
        { status: 500 },
      )
    }

    // Send email notification (optional - won't fail if Resend not configured)
    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? "noreply@bar1016.no",
          to: process.env.BAR_NOTIFICATION_EMAIL ?? "post@bar1016.no",
          subject: `Ny melding fra ${parsed.data.name}: ${parsed.data.subject}`,
          html: `
            <h2>Ny kontaktmelding fra bar1016.no</h2>
            <p><strong>Navn:</strong> ${parsed.data.name}</p>
            <p><strong>E-post:</strong> ${parsed.data.email}</p>
            <p><strong>Telefon:</strong> ${parsed.data.phone ?? "Ikke oppgitt"}</p>
            <p><strong>Emne:</strong> ${parsed.data.subject}</p>
            <p><strong>Melding:</strong></p>
            <p>${parsed.data.message}</p>
          `,
        })
      }
    } catch (emailError) {
      console.error("Email send error:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Noe gikk galt" },
      { status: 500 },
    )
  }
}
