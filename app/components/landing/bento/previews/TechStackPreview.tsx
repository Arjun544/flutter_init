"use client"
// Tech Stack preview — dual marquee rows + spring badge pop-in on hover

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useAnimationFrame } from "motion/react"
import { useBentoHover } from "../bento-hover-context"

// ── package data ──────────────────────────────────────────────────────────────
interface Pkg {
  label: string
  dot: string   // tailwind bg-* dot colour (coloured state)
  badge: string // tailwind classes for the coloured pill
}

const ROW_A: Pkg[] = [
  { label: "riverpod",      dot: "bg-sky-400",     badge: "bg-sky-50     text-sky-600     border-sky-200"     },
  { label: "bloc",          dot: "bg-violet-400",  badge: "bg-violet-50  text-violet-600  border-violet-200"  },
  { label: "go_router",     dot: "bg-cyan-400",    badge: "bg-cyan-50    text-cyan-600    border-cyan-200"     },
  { label: "get_it",        dot: "bg-amber-400",   badge: "bg-amber-50   text-amber-600   border-amber-200"   },
  { label: "dio",           dot: "bg-orange-400",  badge: "bg-orange-50  text-orange-600  border-orange-200"  },
]

const ROW_B: Pkg[] = [
  { label: "supabase",      dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { label: "hive",          dot: "bg-yellow-400",  badge: "bg-yellow-50  text-yellow-600  border-yellow-200"  },
  { label: "freezed",       dot: "bg-indigo-400",  badge: "bg-indigo-50  text-indigo-600  border-indigo-200"  },
  { label: "json_serial.",  dot: "bg-teal-400",    badge: "bg-teal-50    text-teal-600    border-teal-200"     },
  { label: "flutter_hooks", dot: "bg-pink-400",    badge: "bg-pink-50    text-pink-600    border-pink-200"     },
]

// ── greyscale fallback pill ───────────────────────────────────────────────────
const GREY_BADGE = "bg-zinc-100 text-zinc-400 border-zinc-200"
const GREY_DOT   = "bg-zinc-300"

// ── scrolling track ────────────────────────────────────────────────────────────
function MarqueeRow({
  pkgs,
  direction,
  speed,
  isHovered,
  activePkgs,
}: {
  pkgs: Pkg[]
  direction: "left" | "right"
  speed: number        // px per second (when hovered)
  isHovered: boolean
  activePkgs: Set<string>
}) {
  const trackRef     = useRef<HTMLDivElement>(null)
  const xRef         = useRef(0)
  const isHoveredRef = useRef(isHovered)

  // keep ref in sync without re-creating the frame callback
  useEffect(() => { isHoveredRef.current = isHovered }, [isHovered])

  const items = [...pkgs, ...pkgs, ...pkgs]

  useAnimationFrame((_, delta) => {
    if (!trackRef.current || !isHoveredRef.current) return   // ← stop when idle

    const step = (speed * delta) / 1000
    xRef.current += direction === "left" ? -step : step

    const trackW = trackRef.current.scrollWidth / 3
    if (direction === "left"  && xRef.current < -trackW) xRef.current += trackW
    if (direction === "right" && xRef.current >  0)      xRef.current -= trackW

    trackRef.current.style.transform = `translateX(${xRef.current}px)`
  })

  return (
    <div className="overflow-hidden w-full py-1">
      <div ref={trackRef} className="flex gap-4 w-max" style={{ willChange: "transform" }}>
        {items.map((pkg, i) => {
          const active    = isHovered && activePkgs.has(pkg.label)
          const coloured  = isHovered   // show colour only while hovered

          return (
            <motion.span
              key={i}
              animate={{
                scale:   active ? 1.06 : 1,
                opacity: isHovered ? (active ? 1 : 0.5) : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className={cn(
                "inline-flex items-center gap-1.5 shrink-0 rounded-full border px-2.5 py-1",
                "text-[10px] font-semibold whitespace-nowrap select-none transition-colors duration-300",
                coloured ? pkg.badge : GREY_BADGE,
                // simple border highlight on active — no coloured shadow
                active && "border-current/40",
              )}
            >
              <span className={cn(
                "size-1.5 rounded-full shrink-0 transition-colors duration-300",
                coloured ? pkg.dot : GREY_DOT,
              )} />
              {pkg.label}
            </motion.span>
          )
        })}
      </div>
    </div>
  )
}

// ── main component ─────────────────────────────────────────────────────────────
const ALL_PKGS = [...ROW_A, ...ROW_B]

export function TechStackPreview() {
  const { isHovered, playKey } = useBentoHover()
  const [activePkgs, setActivePkgs] = useState<Set<string>>(new Set())
  const timers = useRef<NodeJS.Timeout[]>([])

  // stagger-reveal each badge on hover
  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setActivePkgs(new Set())
    if (!isHovered) return

    ALL_PKGS.forEach((pkg, i) => {
      timers.current.push(
        setTimeout(
          () => setActivePkgs((prev) => new Set([...prev, pkg.label])),
          80 + i * 90,
        ),
      )
    })
    return () => timers.current.forEach(clearTimeout)
  }, [isHovered, playKey])

  return (
    <div className="flex flex-col gap-3 select-none">

      {/* ── row A — scrolls left ── */}
      <MarqueeRow
        pkgs={ROW_A}
        direction="left"
        speed={28}
        isHovered={isHovered}
        activePkgs={activePkgs}
      />

      {/* ── row B — scrolls right ── */}
      <MarqueeRow
        pkgs={ROW_B}
        direction="right"
        speed={22}
        isHovered={isHovered}
        activePkgs={activePkgs}
      />

    </div>
  )
}
