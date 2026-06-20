"use client"
// Zero Boilerplate preview — time saved ticker

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useBentoHover } from "../bento-hover-context"
import { HugeiconsIcon } from "@hugeicons/react"
import { Rocket01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

const STEPS = [
  { label: "Setup project structure", done: false },
  { label: "Configure routing", done: false },
  { label: "Add state management", done: false },
  { label: "Wire up DI", done: false },
  { label: "Write boilerplate", done: false },
]

export function ZeroBoilerplatePreview() {
  const { isHovered, playKey } = useBentoHover()
  const [checked, setChecked] = useState(0)

  useEffect(() => {
    setChecked(0)
    if (!isHovered) return
    const timers: NodeJS.Timeout[] = []
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setChecked(i + 1), 220 + i * 260))
    })
    return () => timers.forEach(clearTimeout)
  }, [isHovered, playKey])

  return (
    <div className={cn(
      "p-3 space-y-1.5 transition-all duration-300",
    )}>
      {STEPS.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
            checked > i
              ? "border-amber-500 bg-amber-500 text-white scale-110"
              : isHovered
                ? "border-amber-300 text-amber-400"
                : "border-zinc-200 text-zinc-300"
          )}>
            {checked > i && (
              <HugeiconsIcon icon={Tick02Icon} className="size-2.5" strokeWidth={3} />
            )}
          </span>
          <span className={cn(
            "text-[11px] font-medium transition-all duration-300",
            checked > i
              ? "text-zinc-400 line-through"
              : isHovered ? "text-zinc-600" : "text-zinc-400"
          )}>
            {step.label}
          </span>
        </div>
      ))}
      <div className={cn(
        "flex justify-center items-center mt-2 text-center text-[10px] font-bold tracking-wider uppercase transition-all duration-500",
        checked === STEPS.length ? "text-amber-500 opacity-100" : "opacity-0"
      )}>
        <HugeiconsIcon icon={Rocket01Icon} className="size-5 mr-2" strokeWidth={2.2} />
        Done in &lt;60s
      </div>
    </div>
  )
}
