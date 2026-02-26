import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ParticleCanvas } from "@/components/neon/particle-canvas"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ParticleCanvas />
      <Header />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />
    </>
  )
}
