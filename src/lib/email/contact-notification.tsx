interface ContactNotificationProps {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export function ContactNotificationEmail({
  name,
  email,
  phone,
  subject,
  message,
}: ContactNotificationProps) {
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
          <h1 style="color:#0798E8;font-size:32px;margin:0;">1016 <span style="color:#D93CEF;">BAR</span></h1>
        </div>
        <div style="background:#111;border-radius:12px;padding:32px;border:1px solid rgba(255,255,255,0.1);">
          <h2 style="color:#fff;margin-top:0;">Ny kontaktmelding</h2>
          <table style="width:100%;border-collapse:collapse;margin:24px 0;">
            <tr>
              <td style="color:#999;padding:8px 0;">Fra:</td>
              <td style="color:#fff;padding:8px 0;text-align:right;">${name}</td>
            </tr>
            <tr>
              <td style="color:#999;padding:8px 0;">E-post:</td>
              <td style="color:#fff;padding:8px 0;text-align:right;">${email}</td>
            </tr>
            <tr>
              <td style="color:#999;padding:8px 0;">Telefon:</td>
              <td style="color:#fff;padding:8px 0;text-align:right;">${phone ?? "Ikke oppgitt"}</td>
            </tr>
            <tr>
              <td style="color:#999;padding:8px 0;">Emne:</td>
              <td style="color:#fff;padding:8px 0;text-align:right;">${subject}</td>
            </tr>
          </table>
          <div style="background:#1a1a1a;border-radius:8px;padding:16px;margin-top:16px;">
            <p style="color:#ccc;margin:0;white-space:pre-wrap;">${message}</p>
          </div>
        </div>
        <div style="text-align:center;margin-top:32px;color:#666;font-size:12px;">
          <p>Denne meldingen ble sendt via kontaktskjemaet på bar1016.no</p>
        </div>
      </div>
    </body>
    </html>
  `
}
