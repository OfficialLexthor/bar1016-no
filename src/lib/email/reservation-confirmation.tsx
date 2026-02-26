interface ReservationConfirmationProps {
  name: string
  date: string
  time: string
  guests: number
  type: "bord" | "karaoke"
}

export function ReservationConfirmationEmail({
  name,
  date,
  time,
  guests,
  type,
}: ReservationConfirmationProps) {
  const typeLabel = type === "karaoke" ? "Karaoke" : "Bordbestilling"

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#050505;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
          <img src="https://bar1016.no/logo.png" alt="1016" width="120" height="90" style="display:inline-block;" />
        </div>
        <div style="background:#111;border-radius:12px;padding:32px;border:1px solid rgba(255,255,255,0.1);">
          <h2 style="color:#fff;margin-top:0;">Takk for din bestilling, ${name}!</h2>
          <p style="color:#999;">Vi har mottatt din ${typeLabel.toLowerCase()} og bekrefter så snart som mulig.</p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0;">
            <tr>
              <td style="color:#999;padding:8px 0;">Dato:</td>
              <td style="color:#fff;padding:8px 0;text-align:right;">${date}</td>
            </tr>
            <tr>
              <td style="color:#999;padding:8px 0;">Tid:</td>
              <td style="color:#fff;padding:8px 0;text-align:right;">${time}</td>
            </tr>
            <tr>
              <td style="color:#999;padding:8px 0;">Gjester:</td>
              <td style="color:#fff;padding:8px 0;text-align:right;">${guests}</td>
            </tr>
            <tr>
              <td style="color:#999;padding:8px 0;">Type:</td>
              <td style="color:#fff;padding:8px 0;text-align:right;">${typeLabel}</td>
            </tr>
          </table>
          <p style="color:#999;font-size:14px;">Vi tar kontakt dersom det er noe vi trenger å avklare.</p>
        </div>
        <div style="text-align:center;margin-top:32px;color:#666;font-size:12px;">
          <p>1016 Bar | St. Marie gate 105, 1706 Sarpsborg</p>
        </div>
      </div>
    </body>
    </html>
  `
}
