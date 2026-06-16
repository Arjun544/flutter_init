"use client"
// Global Reach preview — a Flutter-style app frame where locale cycles
// through languages on hover. Strings fade-swap, direction flips for RTL.
// Greyscale idle → full colour on hover, resets on mouse-leave.

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useBentoHover } from "../bento-hover-context"

// ── Locale data ───────────────────────────────────────────────────────────────
interface Locale {
  flag: string
  code: string
  greeting: string
  subtitle: string
  cta: string
  arb: string
  dir: "ltr" | "rtl"
}

const LOCALES: Locale[] = [
  {
    flag: "🇺🇸", code: "EN",
    greeting: "Welcome back",
    subtitle: "Your projects are ready",
    cta: "Get started",
    arb: '"Welcome back"',
    dir: "ltr",
  },
  {
    flag: "🇩🇪", code: "DE",
    greeting: "Willkommen zurück",
    subtitle: "Ihre Projekte sind bereit",
    cta: "Loslegen",
    arb: '"Willkommen zurück"',
    dir: "ltr",
  },
  {
    flag: "🇯🇵", code: "JA",
    greeting: "おかえりなさい",
    subtitle: "プロジェクトの準備ができています",
    cta: "始める",
    arb: '"おかえりなさい"',
    dir: "ltr",
  },
  {
    flag: "🇸🇦", code: "AR",
    greeting: "مرحباً بعودتك",
    subtitle: "مشاريعك جاهزة",
    cta: "ابدأ الآن",
    arb: '"مرحباً بعودتك"',
    dir: "rtl",
  },
  {
    flag: "🇫🇷", code: "FR",
    greeting: "Bon retour",
    subtitle: "Vos projets sont prêts",
    cta: "Commencer",
    arb: '"Bon retour"',
    dir: "ltr",
  },
]

const CYCLE_INTERVAL = 1800 // ms between locale switches

// ── Fading string — animates out → swaps content → animates in ───────────────
function FadingString({
  value,
  className,
  dir,
}: {
  value: string
  className?: string
  dir?: "ltr" | "rtl"
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18, ease: [0.2, 0, 0.4, 1] }}
        className={className}
        dir={dir}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export function GlobalReachPreview() {
  const { isHovered, playKey } = useBentoHover()
  const [localeIdx, setLocaleIdx] = useState(0)
  const cycleRef = useRef<NodeJS.Timeout | null>(null)

  const locale = LOCALES[localeIdx]

  const stopCycle = useCallback(() => {
    if (cycleRef.current) clearInterval(cycleRef.current)
  }, [])

  const startCycle = useCallback(() => {
    stopCycle()
    setLocaleIdx(0)
    cycleRef.current = setInterval(() => {
      setLocaleIdx((i) => (i + 1) % LOCALES.length)
    }, CYCLE_INTERVAL)
  }, [stopCycle])

  useEffect(() => {
    if (!isHovered) {
      stopCycle()
      setLocaleIdx(0)
      return
    }
    startCycle()
    return stopCycle
  }, [isHovered, playKey, startCycle, stopCycle])

  return (
    <div className="px-3 flex flex-col gap-2 select-none">

      {/* Body */}
      <div
        className={cn(
          "flex flex-col gap-3",
        )}
      >
        {/* Greeting string */}
        <StringRow
          arbKey="homeScreen.greeting"
          value={locale.greeting}
          dir={locale.dir}
          isHovered={isHovered}
        />

        {/* Subtitle string */}
        <StringRow
          arbKey="homeScreen.subtitle"
          value={locale.subtitle}
          dir={locale.dir}
          isHovered={isHovered}
        />

        {/* CTA button */}
        <div className="flex" style={{ justifyContent: locale.dir === "rtl" ? "flex-end" : "flex-start" }}>
          <motion.div
            animate={{ scale: isHovered ? 1 : 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10.5px] font-semibold transition-colors duration-500",
              isHovered
                ? "bg-violet-600 text-white"
                : "bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500",
            )}
          >
            <FadingString value={locale.cta} dir={locale.dir} />
          </motion.div>
        </div>
      </div>

      {/* ── ARB source line ── */}
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border font-mono text-[9.5px] overflow-hidden transition-colors duration-500",
          isHovered
            ? "bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700"
            : "bg-zinc-50 border-zinc-100 dark:bg-zinc-900/30 dark:border-zinc-800",
        )}
      >
        <span
          className={cn(
            "shrink-0 transition-colors duration-500",
            isHovered ? "text-violet-500" : "text-zinc-400 dark:text-zinc-600",
          )}
        >
          "homeScreen.greeting"
        </span>
        <span className="text-zinc-400 dark:text-zinc-600">:</span>
        <span
          className={cn(
            "truncate transition-colors duration-500",
            isHovered ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-400 dark:text-zinc-600",
          )}
        >
          <FadingString value={locale.arb} />
        </span>
      </div>

    </div>
  )
}

// ── String row sub-component ──────────────────────────────────────────────────
function StringRow({
  arbKey,
  value,
  dir,
  isHovered,
}: {
  arbKey: string
  value: string
  dir: "ltr" | "rtl"
  isHovered: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={cn(
          "font-mono text-[8.5px] tracking-wide transition-colors duration-500",
          isHovered ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-300 dark:text-zinc-700",
        )}
      >
        {arbKey}
      </span>
      <span
        className={cn(
          "text-[11.5px] min-h-[16px] transition-colors duration-500",
          isHovered ? "text-zinc-700 dark:text-zinc-200" : "text-zinc-400 dark:text-zinc-600",
        )}
        dir={dir}
      >
        <FadingString value={value} dir={dir} />
      </span>
    </div>
  )
}