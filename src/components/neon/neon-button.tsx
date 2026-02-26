"use client"

import { useState } from "react"
import type { ComponentProps } from "react"
import type { NeonColor } from "@/types"
import { cn } from "@/lib/utils"
import { getNeonColor } from "@/lib/utils/neon-colors"
import { Button } from "@/components/ui/button"

type ButtonProps = ComponentProps<typeof Button>

interface NeonButtonProps extends ButtonProps {
  color?: NeonColor
}

export function NeonButton({
  color = "cyan",
  className,
  children,
  ...props
}: NeonButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { borderClass, textClass, bgClass, shadowColor } = getNeonColor(color)

  return (
    <Button
      className={cn(
        "bg-transparent border-2 transition-all duration-300",
        borderClass,
        textClass,
        isHovered && bgClass,
        isHovered && "text-black font-semibold",
        className
      )}
      style={
        isHovered
          ? { boxShadow: `0 0 15px ${shadowColor}, 0 0 30px ${shadowColor}` }
          : undefined
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </Button>
  )
}
