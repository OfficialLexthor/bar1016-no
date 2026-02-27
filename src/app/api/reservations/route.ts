import { NextResponse } from "next/server"
import { reservationSchema } from "@/lib/validations/reservation"
import { createAdminClient } from "@/lib/supabase/admin"
import { escapeHtml } from "@/lib/utils/format"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = reservationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ugyldig data", details: parsed.error.issues },
        { status: 400 },
      )
    }

    const supabase = createAdminClient()
    const { error } = await supabase.from("reservations").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      date: parsed.data.date,
      time: parsed.data.time,
      guests: parsed.data.guests,
      reservation_type: parsed.data.reservation_type,
      message: parsed.data.message ?? null,
      status: "pending",
    })

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: "Kunne ikke registrere bestilling" },
        { status: 500 },
      )
    }

    // Send confirmation email to customer
    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY)

        const typeLabel = parsed.data.reservation_type === "karaoke" ? "Karaoke" : "Bordbestilling"

        await Promise.all([
          // Confirmation to customer
          resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? "booking@bar1016.no",
            to: parsed.data.email,
            subject: `Bekreftelse - ${typeLabel} hos 1016 Bar`,
            html: `
              <h2>Takk for din bestilling!</h2>
              <p>Vi har mottatt din ${typeLabel.toLowerCase()} for:</p>
              <ul>
                <li><strong>Dato:</strong> ${escapeHtml(parsed.data.date)}</li>
                <li><strong>Tid:</strong> ${escapeHtml(parsed.data.time)}</li>
                <li><strong>Antall gjester:</strong> ${parsed.data.guests}</li>
                <li><strong>Type:</strong> ${typeLabel}</li>
              </ul>
              <p>Vi bekrefter bestillingen din så snart som mulig.</p>
              <p>Med vennlig hilsen,<br/>1016 Bar</p>
              <p><small>St. Marie gate 105, 1706 Sarpsborg</small></p>
            `,
          }),
          // Notification to bar
          resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? "booking@bar1016.no",
            to: process.env.BAR_NOTIFICATION_EMAIL ?? "post@bar1016.no",
            subject: `Ny ${typeLabel} - ${parsed.data.name} (${parsed.data.date})`,
            html: `
              <h2>Ny ${typeLabel}</h2>
              <p><strong>Navn:</strong> ${escapeHtml(parsed.data.name)}</p>
              <p><strong>E-post:</strong> ${escapeHtml(parsed.data.email)}</p>
              <p><strong>Telefon:</strong> ${escapeHtml(parsed.data.phone)}</p>
              <p><strong>Dato:</strong> ${escapeHtml(parsed.data.date)}</p>
              <p><strong>Tid:</strong> ${escapeHtml(parsed.data.time)}</p>
              <p><strong>Gjester:</strong> ${parsed.data.guests}</p>
              <p><strong>Type:</strong> ${typeLabel}</p>
              <p><strong>Melding:</strong> ${escapeHtml(parsed.data.message ?? "Ingen")}</p>
            `,
          }),
        ])
      }
    } catch (emailError) {
      console.error("Email send error:", emailError)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Noe gikk galt" },
      { status: 500 },
    )
  }
}
