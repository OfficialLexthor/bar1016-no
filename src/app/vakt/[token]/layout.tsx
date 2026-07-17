import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vaktplan | 1016 Bar",
  robots: { index: false, follow: false },
}

export default function VaktLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
