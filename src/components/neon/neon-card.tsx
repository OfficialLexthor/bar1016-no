import type { NeonColor } from "@/types"
import { cn } from "@/lib/utils"
import { getNeonColor } from "@/lib/utils/neon-colors"

interface NeonCardProps {
  children: React.ReactNode
  color: NeonColor
  className?: string
}

export function NeonCard({ children, color, className }: NeonCardProps) {
  const { borderClass } = getNeonColor(color)
  const neonBorderClass = `neon-border-${color}` as const

  return (
    <div
      className={cn(
        "bg-black/60 backdrop-blur-sm border-2 rounded-xl p-6",
        borderClass,
        neonBorderClass,
        className
      )}
    >
      {children}
    </div>
  )
}
