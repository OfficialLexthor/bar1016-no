import type { NeonColor } from "@/types"

export const neonColorMap: Record<NeonColor, {
  hex: string
  textClass: string
  borderClass: string
  glowClass: string
  bgClass: string
  shadowColor: string
}> = {
  cyan: {
    hex: "#0798E8",
    textClass: "text-neon-cyan",
    borderClass: "border-neon-cyan",
    glowClass: "neon-glow-cyan",
    bgClass: "bg-neon-cyan",
    shadowColor: "rgba(7, 152, 232, 0.6)",
  },
  pink: {
    hex: "#D93CEF",
    textClass: "text-neon-pink",
    borderClass: "border-neon-pink",
    glowClass: "neon-glow-pink",
    bgClass: "bg-neon-pink",
    shadowColor: "rgba(217, 60, 239, 0.6)",
  },
  gold: {
    hex: "#FFC729",
    textClass: "text-neon-gold",
    borderClass: "border-neon-gold",
    glowClass: "neon-glow-gold",
    bgClass: "bg-neon-gold",
    shadowColor: "rgba(255, 199, 41, 0.6)",
  },
  green: {
    hex: "#4ade80",
    textClass: "text-neon-green",
    borderClass: "border-neon-green",
    glowClass: "neon-glow-green",
    bgClass: "bg-neon-green",
    shadowColor: "rgba(74, 222, 128, 0.6)",
  },
  orange: {
    hex: "#fb923c",
    textClass: "text-neon-orange",
    borderClass: "border-neon-orange",
    glowClass: "neon-glow-orange",
    bgClass: "bg-neon-orange",
    shadowColor: "rgba(251, 146, 60, 0.6)",
  },
  red: {
    hex: "#f87171",
    textClass: "text-neon-red",
    borderClass: "border-neon-red",
    glowClass: "neon-glow-red",
    bgClass: "bg-neon-red",
    shadowColor: "rgba(248, 113, 113, 0.6)",
  },
  purple: {
    hex: "#c084fc",
    textClass: "text-neon-purple",
    borderClass: "border-neon-purple",
    glowClass: "neon-glow-purple",
    bgClass: "bg-neon-purple",
    shadowColor: "rgba(192, 132, 252, 0.6)",
  },
}

export function getNeonColor(color: NeonColor) {
  return neonColorMap[color] ?? neonColorMap.cyan
}

export function getCategoryColor(index: number): NeonColor {
  const colors: NeonColor[] = ["cyan", "pink", "gold", "green", "orange", "red", "purple"]
  return colors[index % colors.length]
}
