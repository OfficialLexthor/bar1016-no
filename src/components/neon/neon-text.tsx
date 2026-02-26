import type { NeonColor } from "@/types"
import { cn } from "@/lib/utils"
import { getNeonColor } from "@/lib/utils/neon-colors"

interface NeonTextProps {
  children: React.ReactNode
  color: NeonColor
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"
  className?: string
}

export function NeonText({
  children,
  color,
  as: Tag = "h2",
  className,
}: NeonTextProps) {
  const { textClass, glowClass } = getNeonColor(color)

  return (
    <Tag className={cn(textClass, glowClass, className)}>
      {children}
    </Tag>
  )
}
