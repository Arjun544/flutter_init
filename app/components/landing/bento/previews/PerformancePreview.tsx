"use client"
// Performance preview — Flutter DevTools-style frame budget timeline
// Bars start janky (over budget, rose), hover cascades them to silky (indigo)

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useBentoHover } from "../bento-hover-context"

// ─── frame data ──────────────────────────────────────────────────────────────
// Each entry: [jank_ms, smooth_ms]
const FRAMES: [number, number][] = [
  [11, 10],
  [30, 14],  // ← jank
  [13, 12],
  [34, 13],  // ← jank
  [12, 11],
  [27, 15],  // ← jank
  [15, 14],
  [37, 12],  // ← jank
  [13, 13],
  [16, 15],
  [14, 14],
  [16, 13],
]

const BUDGET_MS  = 16.7
const MAX_MS     = 40     // tallest displayable value
const BAR_H      = 46     // px height of bar area

const toH = (ms: number) => Math.max(3, (ms / MAX_MS) * BAR_H)

const JANK_INDICES = FRAMES
  .map(([j], i) => (j > BUDGET_MS ? i : -1))
  .filter((i) => i !== -1)

// ─── live avg counter (interpolates between old/new) ─────────────────────────
function useAnimatedNumber(value: number, decimals = 1) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const rafRef  = useRef<number | null>(null)

  useEffect(() => {
    const from = fromRef.current
    const to   = value
    if (from === to) return
    const start = performance.now()
    const dur   = 500
    const tick  = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setDisplay(parseFloat((from + (to - from) * ease).toFixed(decimals)))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = to
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value, decimals])

  return display
}

// ─── component ────────────────────────────────────────────────────────────────
export function PerformancePreview() {
  const { isHovered, playKey } = useBentoHover()
  // which bar indices have been "optimized" this play
  const [done, setDone] = useState<Set<number>>(new Set())
  const timers = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setDone(new Set())
    if (!isHovered) return

    // cascade: every bar optimizes with a small stagger
    FRAMES.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setDone((prev) => new Set([...prev, i])), 60 + i * 90)
      )
    })
    return () => timers.current.forEach(clearTimeout)
  }, [isHovered, playKey])

  const allDone   = done.size === FRAMES.length
  const jankLeft  = JANK_INDICES.filter((i) => !done.has(i)).length
  const rawAvg    = FRAMES.reduce((s, [j, o], i) => s + (done.has(i) ? o : j), 0) / FRAMES.length
  const avgMs     = useAnimatedNumber(rawAvg, 1)

  const budgetFromBottom = (BUDGET_MS / MAX_MS) * BAR_H  // px from bottom

  return (
    <div className="px-3 pt-2.5 pb-2 flex flex-col gap-2 select-none">

      {/* ── header row ── */}
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-[9px] font-bold uppercase tracking-[0.12em] transition-colors duration-300",
          isHovered ? "text-zinc-500" : "text-zinc-300"
        )}>
          UI Thread · Frame Budget
        </span>

        <AnimatePresence mode="wait">
          {!isHovered ? (
            <motion.span key="idle"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[9px] font-semibold text-zinc-300 bg-zinc-50 px-1.5 py-0.5 rounded-full border border-zinc-100"
            >
              Hover to run
            </motion.span>
          ) : allDone ? (
            <motion.span key="done"
              initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-200"
            >
              ✦ 60fps Unlocked
            </motion.span>
          ) : (
            <motion.span key="running"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-200 animate-pulse"
            >
              ● Optimizing…
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── frame bars ── */}
      <div className="relative flex items-end gap-[3px]" style={{ height: BAR_H }}>

        {/* budget line */}
        <div
          className="pointer-events-none absolute left-0 right-0"
          style={{ bottom: budgetFromBottom }}
        >
          <div className={cn(
            "w-full border-t border-dashed transition-colors duration-500",
            isHovered ? "border-indigo-300/80" : "border-zinc-200"
          )} />
          <span className={cn(
            "absolute -top-3.5 right-0 text-[8px] font-bold tabular-nums transition-colors duration-500",
            isHovered ? "text-indigo-400" : "text-zinc-300"
          )}>
            16.7 ms
          </span>
        </div>

        {/* bars */}
        {FRAMES.map(([jankMs, smoothMs], i) => {
          const isOpt = done.has(i)
          const isJank = jankMs > BUDGET_MS
          const targetH = toH(isOpt ? smoothMs : jankMs)

          return (
            <motion.div
              key={i}
              className="flex-1 rounded-t-[2px] relative overflow-hidden"
              animate={{ height: targetH }}
              initial={{ height: toH(jankMs) }}
              transition={{ type: "spring", stiffness: 140, damping: 20, delay: 0 }}
            >
              {/* gradient fill */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: isOpt
                    ? "linear-gradient(to bottom, #a5b4fc, #6366f1)"
                    : isJank
                      ? "linear-gradient(to bottom, #fb7185, #f43f5e)"
                      : "linear-gradient(to bottom, #d4d4d8, #a1a1aa)",
                }}
                transition={{ duration: 0.3 }}
              />
              {/* shine on optimized bars */}
              {isOpt && (
                <motion.div
                  className="absolute inset-x-0 top-0 h-1/3 bg-white/20 rounded-t-[2px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* ── stats row ── */}
      <div className={cn(
        "flex items-center gap-2 transition-all duration-300",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        {/* avg */}
        <span className="text-[10px] text-zinc-400 tabular-nums leading-none">
          avg{" "}
          <span className={cn(
            "font-bold tabular-nums transition-colors duration-300",
            allDone ? "text-indigo-500" : "text-zinc-500"
          )}>
            {avgMs.toFixed(1)} ms
          </span>
        </span>

        <span className="text-zinc-200 text-[10px]">·</span>

        {/* jank count */}
        <AnimatePresence mode="wait">
          <motion.span
            key={jankLeft === 0 ? "clear" : `jank-${jankLeft}`}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "text-[10px] font-semibold leading-none",
              jankLeft === 0 ? "text-emerald-500" : "text-rose-500"
            )}
          >
            {jankLeft === 0
              ? "0 jank frames ✓"
              : `${jankLeft} jank frame${jankLeft > 1 ? "s" : ""}`}
          </motion.span>
        </AnimatePresence>
      </div>

    </div>
  )
}
