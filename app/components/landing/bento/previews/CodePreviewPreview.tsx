"use client"
// Live Code Preview — mini editor chrome that cycles open files on hover

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useBentoHover } from "../bento-hover-context"

const FILES = [
  {
    name: "main.dart",
    path: "lib/main.dart",
    tokens: [
      { w: "18%", c: "bg-violet-400" },
      { w: "28%", c: "bg-sky-400" },
      { w: "22%", c: "bg-amber-400" },
      { w: "40%", c: "bg-emerald-400" },
      { w: "32%", c: "bg-sky-400" },
    ],
  },
  {
    name: "app.dart",
    path: "lib/src/app.dart",
    tokens: [
      { w: "24%", c: "bg-sky-400" },
      { w: "36%", c: "bg-violet-400" },
      { w: "20%", c: "bg-rose-400" },
      { w: "44%", c: "bg-amber-400" },
      { w: "30%", c: "bg-emerald-400" },
    ],
  },
  {
    name: "pubspec.yaml",
    path: "pubspec.yaml",
    tokens: [
      { w: "30%", c: "bg-emerald-400" },
      { w: "26%", c: "bg-sky-400" },
      { w: "38%", c: "bg-violet-400" },
      { w: "22%", c: "bg-amber-400" },
      { w: "34%", c: "bg-rose-400" },
    ],
  },
]

export function CodePreviewPreview() {
  const { isHovered, playKey } = useBentoHover()
  const [visible, setVisible] = useState(false)
  const [activeFile, setActiveFile] = useState(0)
  const [typedLines, setTypedLines] = useState(2)

  useEffect(() => {
    setVisible(false)
    setActiveFile(0)
    setTypedLines(2)
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [playKey])

  useEffect(() => {
    if (!isHovered) {
      setActiveFile(0)
      setTypedLines(2)
      return
    }

    setTypedLines(2)
    const typeTimer = setInterval(() => {
      setTypedLines((n) => (n >= 5 ? 5 : n + 1))
    }, 220)

    const fileTimer = setInterval(() => {
      setActiveFile((f) => (f + 1) % FILES.length)
      setTypedLines(2)
    }, 1400)

    return () => {
      clearInterval(typeTimer)
      clearInterval(fileTimer)
    }
  }, [isHovered])

  const file = FILES[activeFile]

  return (
    <div
      className={cn(
        "flex h-full min-h-35 flex-col overflow-hidden rounded-xl border bg-white transition-all duration-500 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        isHovered
          ? "border-teal-200 shadow-sm shadow-teal-100/60"
          : "border-zinc-200/70"
      )}
    >
      {/* Title bar */}
      <div className="flex h-6 shrink-0 items-center gap-1.5 border-b border-zinc-100 bg-zinc-50/80 px-2">
        <span className="size-1.5 rounded-full bg-zinc-300" />
        <span className="size-1.5 rounded-full bg-zinc-300" />
        <span className="size-1.5 rounded-full bg-zinc-300" />
        <span
          className={cn(
            "ml-1 truncate font-mono text-[9px] font-semibold transition-colors duration-300",
            isHovered ? "text-teal-600" : "text-zinc-400"
          )}
        >
          {file.path}
        </span>
        <span
          className={cn(
            "ml-auto flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide transition-all duration-300",
            isHovered
              ? "bg-teal-500/10 text-teal-600"
              : "bg-zinc-100 text-zinc-400"
          )}
        >
          <span
            className={cn(
              "size-1 rounded-full transition-colors",
              isHovered ? "bg-emerald-500 animate-pulse" : "bg-zinc-300"
            )}
          />
          Live
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* File tree */}
        <div className="flex w-[38%] shrink-0 flex-col gap-0.5 border-r border-zinc-100 bg-zinc-50/50 p-1.5">
          {FILES.map((f, i) => {
            const active = i === activeFile
            return (
              <div
                key={f.name}
                className={cn(
                  "flex items-center gap-1 rounded-md px-1.5 py-1 transition-all duration-300",
                  active && isHovered
                    ? "bg-teal-500/10 text-teal-700"
                    : active
                      ? "bg-zinc-100 text-zinc-600"
                      : "text-zinc-400"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-[2px] transition-colors duration-300",
                    active && isHovered ? "bg-teal-500" : "bg-zinc-300"
                  )}
                />
                <span className="truncate font-mono text-[9px] font-semibold">
                  {f.name}
                </span>
              </div>
            )
          })}
        </div>

        {/* Code pane */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-2">
          {file.tokens.map((token, i) => {
            const shown = i < typedLines
            return (
              <div
                key={`${file.name}-${i}`}
                className="flex items-center gap-1"
              >
                <span className="w-2 shrink-0 text-right font-mono text-[7px] text-zinc-300">
                  {i + 1}
                </span>
                <div
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 ease-out",
                    shown
                      ? cn(token.c, isHovered ? "opacity-100" : "opacity-40 grayscale")
                      : "w-0 opacity-0",
                    shown && "opacity-100"
                  )}
                  style={{
                    width: shown ? token.w : "0%",
                    transitionDelay: shown ? `${i * 40}ms` : "0ms",
                  }}
                />
              </div>
            )
          })}
          {isHovered && typedLines < 5 ? (
            <div className="ml-3 h-2.5 w-0.5 animate-pulse bg-teal-500/70" />
          ) : null}
        </div>
      </div>
    </div>
  )
}
