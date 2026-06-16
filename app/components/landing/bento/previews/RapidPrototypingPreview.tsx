"use client"
// Rapid Prototyping preview — CLI output streams line-by-line on hover.
// Lines are NEVER removed. Hover = color, no hover = greyscale.

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useBentoHover } from "../bento-hover-context"

// ── CLI output lines ──────────────────────────────────────────────────────────
interface Line {
  text: string
  type: "cmd" | "info" | "file" | "done" | "warn" | "pkg"
}

const LINES: Line[] = [
  { text: "npx create-flutterinit my_app", type: "cmd" },
  { text: "Need to install: create-flutterinit", type: "info" },
  { text: "✦ Fetching latest template…", type: "info" },
  { text: "✦ Resolving dependencies…", type: "info" },
  { text: "pkg  flutter_riverpod ^2.5.1", type: "pkg" },
  { text: "pkg  go_router ^14.2.0", type: "pkg" },
  { text: "pkg  dio ^5.4.3", type: "pkg" },
  { text: "pkg  hive_flutter ^1.1.0", type: "pkg" },
  { text: "file lib/main.dart", type: "file" },
  { text: "file lib/core/router.dart", type: "file" },
  { text: "file lib/core/di/injector.dart", type: "file" },
  { text: "file lib/features/auth/view.dart", type: "file" },
  { text: "file lib/features/home/view.dart", type: "file" },
  { text: "file lib/shared/widgets/", type: "file" },
  { text: "file pubspec.yaml", type: "file" },
  { text: "warn  Running `flutter pub get`…", type: "warn" },
  { text: "✓ Packages synced (47 packages)", type: "done" },
  { text: "✓ Ready in 2.1 s — cd my_app && code .", type: "done" },
]

// ms delay before each line appears during the hover animation
const DELAYS = [0, 300, 550, 800, 1050, 1200, 1350, 1500, 1700, 1850, 2000, 2150, 2300, 2450, 2600, 2800, 3100, 3400]

const LINE_STYLE: Record<Line["type"], { active: string; grey: string }> = {
  cmd: { active: "text-violet-500 font-semibold", grey: "text-zinc-500 font-semibold" },
  info: { active: "text-zinc-400 italic", grey: "text-zinc-600 italic" },
  file: { active: "text-sky-500", grey: "text-zinc-600" },
  pkg: { active: "text-amber-400", grey: "text-zinc-600" },
  warn: { active: "text-yellow-500 italic", grey: "text-zinc-600 italic" },
  done: { active: "text-emerald-500 font-bold", grey: "text-zinc-500 font-bold" },
}

const LINE_PREFIX: Record<Line["type"], string | null> = {
  cmd: "❯",
  info: null,
  file: "·",
  pkg: "↓",
  warn: "⚠",
  done: null,
}

// ── typewriter for the command line ───────────────────────────────────────────
function useTypewriter(text: string, active: boolean, msPerChar = 36) {
  const [displayed, setDisplayed] = useState("")
  useEffect(() => {
    setDisplayed("")
    if (!active) return
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, msPerChar)
    return () => clearInterval(id)
  }, [active, text])
  return displayed
}

// ── constants ─────────────────────────────────────────────────────────────────
const VISIBLE = 5  // rows shown in the sliding window while streaming
const ROW_H = 26

// ── main component ────────────────────────────────────────────────────────────
export function RapidPrototypingPreview() {
  const { isHovered, playKey } = useBentoHover()
  const [revealedCount, setRevealedCount] = useState(LINES.length) // show all on first render
  const timers = useRef<NodeJS.Timeout[]>([])

  const cmdTyped = useTypewriter(LINES[0].text, isHovered && revealedCount >= 1)

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []

    if (!isHovered) {
      // Don't reset revealedCount — keep lines visible in greyscale
      return
    }

    // Reset and replay the stream animation on each hover-in
    setRevealedCount(0)
    LINES.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setRevealedCount(i + 1), DELAYS[i]),
      )
    })
    return () => timers.current.forEach(clearTimeout)
  }, [isHovered, playKey])

  // Cmd line (index 0) is always pinned at the top — never enters the sliding window.
  // The window covers indices 1..N, showing the last (VISIBLE - 1) of them.
  const REST = LINES.slice(1)
  const shown = Math.max(0, revealedCount - 1)          // how many of REST are revealed
  const wStart = Math.max(0, shown - (VISIBLE - 1))
  const windowLines = REST.slice(wStart, shown).map((line, i) => ({
    line,
    globalIdx: wStart + i + 1,                            // +1 because cmd is index 0
  }))

  const cmdLine = LINES[0]
  const cmdStyles = LINE_STYLE["cmd"]
  const cmdVisible = revealedCount >= 1

  return (
    <div
      className="px-3 py-1.5 font-mono overflow-hidden"
      style={{ height: ROW_H * VISIBLE + 4 }}
    >
      {/* ── Pinned cmd line — always visible, never scrolls away ── */}
      <motion.div
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: cmdVisible ? 1 : 0, x: cmdVisible ? 0 : -14 }}
        transition={{ opacity: { duration: 0.28, ease: [0.2, 0, 0.2, 1] }, x: { duration: 0.28, ease: [0.2, 0, 0.2, 1] } }}
        className="flex items-center gap-1.5"
        style={{ height: ROW_H }}
      >
        <span className={cn("shrink-0 text-[10px] transition-colors duration-500", isHovered ? "text-violet-400" : "text-zinc-500")}>❯</span>
        <span className={cn("text-[11px] truncate transition-colors duration-500 font-semibold", isHovered ? cmdStyles.active : cmdStyles.grey)}>
          {isHovered ? cmdTyped : cmdLine.text}
          {isHovered && cmdTyped.length < cmdLine.text.length && (
            <span className="inline-block w-[5px] h-[10px] bg-violet-400 ml-0.5 animate-pulse align-middle" />
          )}
        </span>
      </motion.div>

      {/* ── Sliding window for the rest of the lines ── */}
      <AnimatePresence initial={false}>
        {windowLines.map(({ line, globalIdx }) => {
          const styles = LINE_STYLE[line.type]
          const prefix = LINE_PREFIX[line.type]

          const textClass = cn(
            "text-[11px] truncate transition-colors duration-500",
            isHovered ? styles.active : styles.grey,
          )
          const prefixClass = cn(
            "shrink-0 text-[10px] transition-colors duration-500",
            isHovered ? "text-zinc-400" : "text-zinc-600",
          )

          // All lines slide in from the left with a fade.
          // x distance varies by type to give each line a distinct weight.
          const T = {
            cmd: { x: -14, dur: 0.28, ease: [0.2, 0, 0.2, 1] as const },
            info: { x: -10, dur: 0.22, ease: [0.4, 0, 0.6, 1] as const },
            file: { x: -8, dur: 0.14, ease: [0.2, 0, 0.4, 1] as const },
            pkg: { x: -8, dur: 0.14, ease: [0.2, 0, 0.4, 1] as const },
            warn: { x: -12, dur: 0.20, ease: [0.4, 0, 0.2, 1] as const },
            done: { x: -10, dur: 0.32, ease: [0, 0, 0.2, 1] as const },
          }[line.type]

          return (
            <motion.div
              key={globalIdx}
              layout
              initial={{ opacity: 0, x: T.x }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                opacity: { duration: T.dur, ease: T.ease },
                x: { duration: T.dur, ease: T.ease },
                layout: { duration: 0.16, ease: [0.4, 0, 0.2, 1] },
              }}
              className="flex items-center gap-1.5"
              style={{ height: ROW_H }}
            >
              {prefix && (
                <span className={prefixClass}>{prefix}</span>
              )}

              <span className={textClass}>{line.text}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}