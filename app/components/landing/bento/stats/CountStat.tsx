"use client"
import { CountingNumber } from "@/components/animate-ui/primitives/texts/counting-number"
// Donut / ring stat for compact single-metric cells

import { cn } from "@/lib/utils"

export function CountStat({
  value,
  numericValue,
  suffix = "",
  percent,
  color,
  trackColor,
  isHovered,
  accentClass,
}: {
  eyebrow: string
  value: string
  numericValue?: number
  suffix?: string
  percent: number
  color: string
  trackColor: string
  isHovered: boolean
  accentClass: string
}) {

  return (
    <div className="flex flex-col items-center justify-center gap-2 h-full">
      <CountingNumber className={cn("text-3xl font-bold transition-all duration-600", isHovered ? `${accentClass}` : "text-zinc-400")} number={numericValue || 0} />
    </div>
  )
}
