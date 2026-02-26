import type { NeonColor } from "@/types"
import { cn } from "@/lib/utils"
import { getNeonColor } from "@/lib/utils/neon-colors"

interface NeonDividerProps {
  color?: NeonColor
  className?: string
}

export function NeonDivider({ color = "cyan", className }: NeonDividerProps) {
  const { hex } = getNeonColor(color)

  return (
    <div
      className={cn("w-full h-px my-8", className)}
      style={{
        background: `linear-gradient(90deg, transparent, ${hex}, transparent)`,
        boxShadow: `0 0 8px ${hex}40, 0 0 16px ${hex}20`,
      }}
      role="separator"
      aria-orientation="horizontal"
    />
  )
}
