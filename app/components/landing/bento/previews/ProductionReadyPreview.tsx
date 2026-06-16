"use client"
// Production Ready preview — Flutter runtime logger stream

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useBentoHover } from "../bento-hover-context"

interface LogEntry {
  time: string
  type: "API" | "DB" | "ERR" | "RVP" | "BLC"
  msg: string
}

const LOG_ENTRIES: LogEntry[] = [
  { time: "09:12:01", type: "RVP", msg: "authProvider: Initialized" },
  { time: "09:12:02", type: "DB",  msg: "Isar: opened users collection" },
  { time: "09:12:03", type: "API", msg: "GET /api/v1/profile → 200 (142ms)" },
  { time: "09:12:04", type: "RVP", msg: "userProvider: State → AsyncData" },
  { time: "09:12:05", type: "BLC", msg: "AuthBloc: LoggedOut → Authenticated" },
  { time: "09:12:06", type: "API", msg: "POST /api/v1/posts → 201 (89ms)" },
  { time: "09:12:07", type: "DB",  msg: "Isar: inserted 1 record (posts)" },
  { time: "09:12:08", type: "ERR", msg: "DioException: 401 Unauthorized" },
  { time: "09:12:09", type: "API", msg: "POST /auth/refresh → 200 (56ms)" },
  { time: "09:12:10", type: "BLC", msg: "TokenBloc: Refreshed → Active" },
]

const TYPE_STYLES: Record<LogEntry["type"], { badge: string; text: string }> = {
  API: { badge: "text-sky-500 bg-sky-500/10",       text: "text-zinc-600" },
  DB:  { badge: "text-amber-500 bg-amber-500/10",   text: "text-zinc-600" },
  ERR: { badge: "text-rose-500 bg-rose-500/10",     text: "text-rose-500 font-semibold" },
  RVP: { badge: "text-cyan-500 bg-cyan-500/10",     text: "text-zinc-600" },
  BLC: { badge: "text-violet-500 bg-violet-500/10", text: "text-zinc-600" },
}

const VISIBLE = 3

export function ProductionReadyPreview() {
  const { isHovered } = useBentoHover()
  // step = the starting index of the visible 3-row window
  const [step, setStep] = useState(0)
  const stepRef = useRef(0)

  useEffect(() => {
    if (!isHovered) return

    const id = setInterval(() => {
      stepRef.current = (stepRef.current + 1) % LOG_ENTRIES.length
      setStep(stepRef.current)
    }, 700)

    return () => clearInterval(id)
  }, [isHovered])

  const visibleEntries = Array.from({ length: VISIBLE }, (_, i) => {
    const idx = (step + i) % LOG_ENTRIES.length
    return { idx, log: LOG_ENTRIES[idx] }
  })

  return (
    <div className="px-3 py-1 font-mono overflow-hidden" style={{ height: 82 }}>
      <AnimatePresence initial={false} mode="popLayout">
        {visibleEntries.map(({ idx, log }) => {
          const s = TYPE_STYLES[log.type]
          return (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center gap-2"
              style={{ height: 26 }}
            >
              <span className="text-[10px] text-zinc-400 shrink-0 tabular-nums">
                {log.time}
              </span>
              <span className={cn(
                "shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider leading-none",
                s.badge,
                log.type === "ERR" && "animate-pulse"
              )}>
                {log.type}
              </span>
              <span className={cn(
                "text-[11px] truncate",
                isHovered ? s.text : "text-zinc-400"
              )}>
                {log.msg}
              </span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
