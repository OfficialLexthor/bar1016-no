# bar1016.no - 1016 Bar Website

## Prosjektoversikt
Fullverdig nettside for 1016 Bar, en cocktail- og karaokebar i Sarpsborg. Inkluderer offentlige sider, TV-meny med Supabase Realtime, og admin-panel.

## Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4 (`@theme inline`) + shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **E-post**: Resend
- **Analytics**: Vercel Analytics + Speed Insights
- **Deploy**: Vercel + GitHub auto-deploy
- **Pakkebehandler**: npm

## Kjørekommandoer
```bash
npm run dev      # Start dev server
npm run build    # Produksjonsbygning
npm run start    # Start produksjonsserver
npm run lint     # Kjør ESLint
```

## Neon-fargepalett
| Farge | Hex | Tailwind | Bruk |
|-------|-----|----------|------|
| Cyan | `#0798E8` | `text-neon-cyan` | Primær-aksent, logo "1016" |
| Rosa | `#D93CEF` | `text-neon-pink` | Sekundær-aksent, logo "BAR" |
| Gull | `#FFC729` | `text-neon-gold` | Priser, åpningstider |
| Grønn | `#4ade80` | `text-neon-green` | Øl-kategori |
| Oransje | `#fb923c` | `text-neon-orange` | Flaskeøl, shots |
| Rød | `#f87171` | `text-neon-red` | Cider/rusbrus |
| Lilla | `#c084fc` | `text-neon-purple` | Vin |
| Bakgrunn | `#050505` | `bg-background` | Mørk bakgrunn |

Glow-klasser: `neon-glow-{color}` (tekst-shadow), `neon-border-{color}` (box-shadow)

## Filstruktur
```
src/
├── app/
│   ├── globals.css             # Tailwind 4 + neon-tema
│   ├── layout.tsx              # Root layout (dark, norsk)
│   ├── page.tsx                # Hjem (med ParticleCanvas, header, footer)
│   ├── (public)/               # Route group med header/footer layout
│   │   ├── meny/page.tsx
│   │   ├── om-oss/page.tsx
│   │   ├── events/page.tsx
│   │   ├── galleri/page.tsx
│   │   ├── kontakt/page.tsx    # Client component med skjema
│   │   └── bordbestilling/page.tsx  # Client component med skjema
│   ├── tv-meny/                # Standalone fullskjerm for TV
│   │   ├── layout.tsx
│   │   └── page.tsx            # Realtime + fallback-data
│   ├── admin/                  # Auth-beskyttet
│   │   ├── layout.tsx          # Auth guard + sidebar
│   │   ├── page.tsx            # Dashboard
│   │   └── {meny,events,galleri,reservasjoner,kampanjer,apningstider,meldinger}/
│   ├── api/
│   │   ├── contact/route.ts
│   │   └── reservations/route.ts
│   ├── auth/callback/route.ts
│   ├── login/page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── neon/                   # particle-canvas, neon-text, neon-card, neon-button, neon-divider
│   ├── layout/                 # header, footer, mobile-menu
│   ├── home/                   # hero-section, opening-hours, featured-cocktails, etc.
│   ├── admin/                  # admin-shell
│   └── ui/                     # shadcn/ui
├── hooks/
│   └── use-realtime-menu.ts    # Supabase Realtime for TV-meny
├── lib/
│   ├── supabase/               # client, server, middleware, admin
│   ├── actions/                # Server actions: menu, events, reservations, etc.
│   ├── email/                  # Resend-maler
│   ├── validations/            # Zod-skjemaer: contact, reservation
│   └── utils/                  # cn, constants, format, neon-colors
└── types/index.ts
```

## Database-skjema (Supabase)
- `profiles` - Brukerprofiler med rolle (user/admin)
- `menu_categories` - Kategorier med neon_color og sort_order
- `menu_items` - Drinkmenyen med pris
- `events` - Arrangementer (karaoke/dj/tema/annet)
- `reservations` - Bordbestillinger (pending/confirmed/cancelled)
- `gallery_images` - Galleribilder
- `opening_hours` - Åpningstider per ukedag
- `campaigns` - Kampanjer med datoperiode
- `contact_messages` - Kontaktskjema-meldinger

RLS: Public SELECT på meny/events/galleri/timer/kampanjer. Admin-only mutasjoner via `is_admin()`.
Realtime: Aktivert på `menu_items` og `menu_categories`.
Migrasjoner: `supabase/migrations/20240101000000_initial_schema.sql`

## Designkonvensjoner
- Alltid mørkt tema (bg: #050505)
- Neon-komponenter i `components/neon/` for konsistent glow-effekt
- Partikkel-canvas på offentlige sider og TV-meny
- Priser formateres som `169,-` (norsk format)
- Norsk bokmål (lang="nb") på alle sider

## TV-meny (/tv-meny)
- Standalone layout uten header/footer
- Fullskjerm for 1920x1080 TV
- 4-kolonners grid med automatisk kolonne-balansering
- Supabase Realtime-oppdatering + hardkodet fallback-data
- Live klokke med norsk dato

## Admin-panel (/admin/*)
- Supabase Auth-beskyttet (admin-rolle)
- Sidebar-navigasjon med alle seksjoner
- CRUD for meny, events, galleri, kampanjer
- Reservasjonsbehandling med status og notater
- Kontaktmeldinger med lest/ulest-status
