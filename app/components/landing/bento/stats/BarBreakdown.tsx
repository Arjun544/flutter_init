"use client"
// Horizontal bar chart breakdown for compact stat cells

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

type BarBreakdownItem = {
  label: string
  percent: number
  colorClass: string
}

export function BarBreakdown({
  eyebrow,
  items,
  isHovered,
  accentClass,
}: {
  eyebrow: string
  items: BarBreakdownItem[]
  isHovered: boolean
  accentClass: string
}) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    if (!isHovered) { setAnimated(false); return }
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [isHovered])

  return (
    <div className="flex flex-col gap-2 h-full justify-between">
      <div className="space-y-2 flex-1 flex flex-col justify-center">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-0.5">
              <span className={cn("text-[10px] font-semibold transition-colors", isHovered ? "text-zinc-700" : "text-zinc-400")}>
                {item.label}
              </span>
              <span className={cn("text-[10px] font-bold tabular-nums transition-colors", isHovered ? accentClass : "text-zinc-300")}>
                {item.percent}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", item.colorClass)}
                style={{
                  width: animated ? `${item.percent}%` : "0%",
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
