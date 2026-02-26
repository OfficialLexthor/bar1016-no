import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TV-meny | 1016 Bar",
  robots: { index: false, follow: false },
}

export default function TvMenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
