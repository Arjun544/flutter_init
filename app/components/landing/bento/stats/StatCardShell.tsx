"use client"
// Shared shell for StatsShowcase bento cards

import { cn } from "@/lib/utils"
import { useState, type ReactNode } from "react"

type StatCardShellProps = {
  children: (isHovered: boolean) => ReactNode
  className?: string
  glowClass: string   // e.g. "from-primary/10 to-transparent"
  title: string
  subtitle?: string
}

export function StatCardShell({
  children,
  className,
  glowClass,
  title,
  subtitle,
}: StatCardShellProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white",
        "transition-[transform,box-shadow,border-color,background-color] duration-450 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isHovered
          ? "border-zinc-300 shadow-2xl shadow-zinc-200/50"
          : "border-zinc-100",
        "flex flex-col p-5",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Grid dot overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.74_0_0/0.09)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.74_0_0/0.09)_1px,transparent_1px)] bg-size-[28px_28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* Top glow */}
      <div className={cn("absolute inset-x-0 top-0 h-32 bg-linear-to-b opacity-80 transition-opacity duration-450 group-hover:opacity-100", glowClass)} />
      {/* Gloss */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,oklch(1_0_0/0.55)_0%,transparent_45%)]" />

      {/* Visualization — fills the flex space */}
      <div className="relative z-10 mb-4 flex min-h-0 flex-1 flex-col">
        {children(isHovered)}
      </div>

      {/* Title + subtitle at bottom */}
      <div className="relative z-10">
        <p
          className={cn(
            "mb-0.5 font-semibold leading-tight tracking-tight text-base",
            "transition-[color,font-weight] duration-450 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isHovered ? "text-zinc-900" : "text-zinc-700",
          )}
        >
          {title}
        </p>
        {subtitle && (
          <p className="line-clamp-1 text-xs font-medium leading-snug text-zinc-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
