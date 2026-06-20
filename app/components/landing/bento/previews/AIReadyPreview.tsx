"use client"
// AI-Ready Context preview — file cards for AGENTS.md / DESIGN.md / .cursorrules

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useBentoHover } from "../bento-hover-context"

const FILES = [
  {
    name: "AGENTS.md",
    lines: ["# Agent Context", "Project: flutter_starter"],
    color: "violet",
  },
  {
    name: "DESIGN.md",
    lines: ["# Design System", "Primary: #6750A4"],
    color: "indigo",
  },
  {
    name: ".cursorrules",
    lines: ["Use Riverpod hooks", "Follow clean arch"],
    color: "purple",
  },
]

const colorMap: Record<string, { border: string; bg: string; title: string; line: string; dot: string }> = {
  violet: {
    border: "border-violet-200",
    bg: "bg-violet-50",
    title: "text-violet-600",
    line: "bg-violet-200",
    dot: "bg-violet-400",
  },
  indigo: {
    border: "border-indigo-200",
    bg: "bg-indigo-50",
    title: "text-indigo-600",
    line: "bg-indigo-200",
    dot: "bg-indigo-400",
  },
  purple: {
    border: "border-purple-200",
    bg: "bg-purple-50",
    title: "text-purple-600",
    line: "bg-purple-200",
    dot: "bg-purple-400",
  },
}

export function AIReadyPreview() {
  const { isHovered, playKey } = useBentoHover()
  const [visible, setVisible] = useState(0)
  const [activeFile, setActiveFile] = useState(-1)

  // 1. Entrance animation: triggers on mount or playKey change
  useEffect(() => {
    setVisible(0)
    const t1 = setTimeout(() => setVisible(1), 100)
    const t2 = setTimeout(() => setVisible(2), 200)
    const t3 = setTimeout(() => setVisible(3), 300)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [playKey])

  // 2. Hover state: handles the active file cycling
  useEffect(() => {
    if (!isHovered) {
      setActiveFile(-1) // Reset when unhovered
      return
    }

    setActiveFile(0)
    const interval = setInterval(() => {
      setActiveFile((f) => (f + 1) % FILES.length)
    }, 900)

    return () => clearInterval(interval)
  }, [isHovered])

  return (
    <div className="space-y-1.5">
      {FILES.map((file, i) => {
        const c = colorMap[file.color]
        const isActive = isHovered && activeFile === i

        return (
          <div
            key={file.name}
            className={cn(
              "rounded-xl border px-2.5 py-2 transition-all duration-500 ease-out",
              visible > i ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3",
              isActive
                ? cn(c.border, c.bg, "scale-[1.02] shadow-sm")
                : "border-zinc-200/60 bg-zinc-50/50 grayscale opacity-70 scale-100"
            )}
            style={{ transitionDelay: visible > i ? `${i * 40}ms` : '0ms' }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className={cn(
                  "size-1.5 rounded-full transition-colors duration-300",
                  isActive ? c.dot : "bg-zinc-300"
                )}
              />
              <span
                className={cn(
                  "text-[11px] font-bold font-mono transition-colors duration-300",
                  isActive ? c.title : "text-zinc-400"
                )}
              >
                {file.name}
              </span>
            </div>
            <div className="space-y-1">
              {file.lines.map((line, j) => (
                <div
                  key={j}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    isActive ? c.line : "bg-zinc-200",
                  )}
                  style={{ width: `${40 + j * 10}%` }}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}