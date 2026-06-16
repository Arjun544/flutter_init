"use client"

import { cn } from "@/lib/utils"
import { useCallback, useState, type ReactNode } from "react"
import { BentoHoverProvider } from "./bento-hover-context"

type AccentConfig = {
  iconColor: string
  glow: string
  chip: string
}

export function FeatureCard({
  children,
  className,
  accent,
}: {
  children: ReactNode
  className?: string
  accent: AccentConfig
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [playKey, setPlayKey] = useState(0)

  const requestReplay = useCallback(() => setPlayKey((k) => k + 1), [])

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white",
        "transition-[transform,box-shadow,border-color] duration-450 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isHovered
          ? "border-zinc-300 shadow-2xl shadow-zinc-200/50"
          : "border-zinc-100",
        "flex flex-col",
        className
      )}
      onMouseEnter={() => { setIsHovered(true); setPlayKey((k) => k + 1) }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Grid dot overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.74_0_0/0.09)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.74_0_0/0.09)_1px,transparent_1px)] bg-size-[28px_28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* Top glow */}
      <div className={cn("absolute inset-x-0 top-0 h-32 bg-linear-to-b opacity-85 transition-opacity duration-450 group-hover:opacity-100", accent.glow)} />
      {/* Gloss */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,oklch(1_0_0/0.55)_0%,transparent_45%)]" />

      <BentoHoverProvider isHovered={isHovered} playKey={playKey} requestReplay={requestReplay}>
        {children}
      </BentoHoverProvider>
    </div>
  )
}
