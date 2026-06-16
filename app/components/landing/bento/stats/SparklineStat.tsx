"use client"
import { CountingNumber } from "@/components/animate-ui/primitives/texts/counting-number"
// Sparkline + big stat for wide cards (Projects Generated, State Management)

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

type SparklineStatProps = {
  value: string
  numericValue?: number
  suffix?: string
  eyebrow: string
  trend?: number[] // spark bars (0-100)
  accentClass: string
  barClass: string   // explicit bg-* class for the bars
  isHovered: boolean
}

function AnimatedValue({
  value,
  numericValue,
  suffix = "",
  isHovered,
  accentClass,
}: Pick<SparklineStatProps, "value" | "numericValue" | "suffix" | "isHovered" | "accentClass">) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (numericValue === undefined) return
    if (!isHovered) { setDisplay(0); return }
    const duration = 1200
    const start = performance.now()
    let raf = 0
    const run = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - p) ** 4
      setDisplay(Math.round(eased * numericValue))
      if (p < 1) raf = requestAnimationFrame(run)
    }
    raf = requestAnimationFrame(run)
    return () => cancelAnimationFrame(raf)
  }, [numericValue, isHovered])

  return <>{display.toLocaleString()}{suffix}</>
}

export function SparklineStat({
  value,
  numericValue,
  suffix = "",
  trend = [30, 45, 38, 60, 72, 65, 85, 90, 95, 100],
  barClass,
  isHovered,
}: SparklineStatProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  // Resolve color variables based on the barClass
  const isPrimary = barClass.includes("primary")
  const colorValue = isPrimary ? "var(--primary, #3b82f6)" : "var(--color-cyan-500, #06b6d4)"

  const getTooltipValue = (h: number) => {
    if (numericValue !== undefined) {
      const maxTrend = Math.max(...trend)
      const ratio = numericValue / (maxTrend || 1)
      const calculated = Math.round(h * ratio)
      return `${calculated.toLocaleString()}${suffix}`
    }
    return `${h}%`
  }

  return (
    <div className="flex flex-col gap-3 h-full justify-between relative">
      <p className={cn("text-4xl font-black tracking-tight tabular-nums transition-colors duration-300", isHovered ? "text-zinc-900" : "text-zinc-700")}>
        {numericValue !== undefined ? (
          <>
            <CountingNumber number={numericValue} />
            {suffix}
          </>
        ) : (
          value
        )}
      </p>

      {/* Sparkline Container */}
      <div 
        className="relative flex items-end gap-[3px] h-10 w-full group/sparkline"
        onMouseLeave={() => setHoveredBar(null)}
      >
        {/* Subtle grid lines in background */}
        <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none select-none opacity-40">
          <div className="border-b border-dashed border-zinc-200/50 dark:border-zinc-800/40 w-full h-0" />
          <div className="border-b border-dashed border-zinc-200/50 dark:border-zinc-800/40 w-full h-0" />
          <div className="border-b border-dashed border-zinc-200/50 dark:border-zinc-800/40 w-full h-0" />
        </div>

        {trend.map((h, i) => {
          const isBarHovered = hoveredBar === i
          // Scale slightly on hover for 3D realism
          const scale = isBarHovered ? "scale-y-[1.08] scale-x-[1.04]" : "scale-y-100 scale-x-100"
          
          return (
            <div
              key={i}
              className="relative flex-1 h-full flex items-end cursor-pointer group/bar"
              onMouseEnter={() => setHoveredBar(i)}
            >
              {/* Tooltip */}
              <div 
                className={cn(
                  "absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-30 pointer-events-none",
                  "transition-all duration-400 ease-out origin-bottom",
                  isBarHovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-1 scale-90"
                )}
              >
                <div className="bg-zinc-900/95 dark:bg-zinc-50/98 text-white dark:text-zinc-950 text-[10px] font-bold py-1 px-2 rounded-md shadow-lg backdrop-blur-xs whitespace-nowrap border border-white/10 dark:border-zinc-200/50">
                  {getTooltipValue(h)}
                </div>
                {/* Arrow */}
                <div className="w-1.5 h-1.5 bg-zinc-900/95 dark:bg-zinc-50/98 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-[3px] border-r border-b border-white/10 dark:border-zinc-200/50" />
              </div>

              {/* Spark bar */}
              <div
                className={cn(
                  "w-full rounded-t-[4px] transition-all duration-300 origin-bottom",
                  isHovered ? "" : "bg-linear-to-t from-zinc-200/40 to-zinc-200/80 dark:from-zinc-800/30 dark:to-zinc-800/60"
                )}
                style={{
                  height: `${h}%`,
                  transform: scale,
                  // When card is hovered, active gradient. When not, nice glassmorphic neutral.
                  background: isHovered
                    ? `linear-gradient(to top, color-mix(in oklab, ${colorValue} 15%, transparent) 0%, ${colorValue} 100%)`
                    : undefined,
                  // Smooth individual entry animation delay
                  transitionDelay: hoveredBar !== null ? "0ms" : `${i * 30}ms`,
                  // Glowing effect on hover
                  boxShadow: isBarHovered 
                    ? `0 0 12px color-mix(in oklab, ${colorValue} 50%, transparent)`
                    : undefined,
                  // Dim non-hovered bars when another bar is hovered
                  opacity: hoveredBar !== null 
                    ? (isBarHovered ? 1.0 : 0.4) 
                    : (isHovered ? 0.6 + (i / trend.length) * 0.4 : 0.8)
                }}
              >
                {/* Highlight/glowing cap at the top edge of the bar */}
                {isHovered && (
                  <div 
                    className="h-[2px] w-full rounded-t-[4px] transition-opacity duration-300"
                    style={{ 
                      backgroundColor: colorValue,
                      boxShadow: `0 1px 4px ${colorValue}`
                    }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
