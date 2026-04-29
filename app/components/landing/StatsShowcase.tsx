"use client"

import {
  AnalyticsUpIcon,
  Boxes,
  Database,
  Fire,
  FlowchartIcon,
  Navigation03Icon,
  PuzzleIcon,
  Sun
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import Image from "next/image"

type StatCard = {
  label: string
  value: string
  numericValue?: number
  suffix?: string
  eyebrow: string
}

const bentoClasses = [
  "md:col-span-2 md:row-span-1",
  "md:col-span-2 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
]

function AnimatedValue({
  value,
  numericValue,
  suffix = "",
}: Pick<StatCard, "value" | "numericValue" | "suffix">) {
  const [displayValue, setDisplayValue] = useState(0)
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  )

  useEffect(() => {
    if (numericValue === undefined) return
    if (prefersReducedMotion) {
      setDisplayValue(numericValue)
      return
    }

    const duration = 1400
    const start = performance.now()
    let animationFrame = 0

    const run = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 4
      setDisplayValue(Math.round(eased * numericValue))
      if (progress < 1) animationFrame = requestAnimationFrame(run)
    }

    animationFrame = requestAnimationFrame(run)
    return () => cancelAnimationFrame(animationFrame)
  }, [numericValue, prefersReducedMotion])

  if (numericValue === undefined) return <>{value}</>
  return (
    <>
      {displayValue.toLocaleString()}
      {suffix}
    </>
  )
}

export function StatsShowcase({ cards }: { cards: StatCard[] }) {
  const accents = {
    volume: {
      icon: AnalyticsUpIcon,
      iconColor: "text-primary",
      glow: "from-primary/10 to-transparent",
      chip: "bg-primary/8 border-primary/15",
      marker: "bg-primary",
    },
    state: {
      icon: PuzzleIcon,
      iconColor: "text-pink-500",
      glow: "from-pink-500/10 to-transparent",
      chip: "bg-pink-500/8 border-pink-500/15",
      marker: "bg-pink-500",
    },
    architecture: {
      icon: FlowchartIcon,
      iconColor: "text-rose-500",
      glow: "from-rose-500/10 to-transparent",
      chip: "bg-rose-500/8 border-rose-500/15",
      marker: "bg-rose-500",
    },
    firebase: {
      icon: Fire,
      iconColor: "text-red-500",
      glow: "from-red-500/10 to-transparent",
      chip: "bg-red-500/8 border-red-500/15",
      marker: "bg-red-500",
    },
    supabase: {
      icon: Database,
      iconColor: "text-green-500",
      glow: "from-green-500/10 to-transparent",
      chip: "bg-green-500/8 border-green-500/15",
      marker: "bg-green-500",
    },
    backend: {
      icon: Boxes,
      iconColor: "text-yellow-500",
      glow: "from-yellow-500/10 to-transparent",
      chip: "bg-yellow-500/8 border-yellow-500/15",
      marker: "bg-yellow-500",
    },
    navigation: {
      icon: Navigation03Icon,
      iconColor: "text-cyan-500",
      glow: "from-cyan-500/10 to-transparent",
      chip: "bg-cyan-500/8 border-cyan-500/15",
      marker: "bg-cyan-500",
    },
    theme: {
      icon: Sun,
      iconColor: "text-slate-500",
      glow: "from-slate-500/10 to-transparent",
      chip: "bg-slate-500/8 border-slate-500/15",
      marker: "bg-slate-500",
    },
    default: {
      icon: AnalyticsUpIcon,
      iconColor: "text-primary",
      glow: "from-primary/10 to-transparent",
      chip: "bg-primary/8 border-primary/15",
      marker: "bg-primary",
    },
  } as const

  const resolveAccent = (label: string) => {
    const normalized = label.toLowerCase()
    if (normalized.includes("project")) return accents.volume
    if (normalized.includes("state")) return accents.state
    if (normalized.includes("architecture")) return accents.architecture
    if (normalized.includes("supabase")) return accents.supabase
    if (normalized.includes("firebase")) return accents.firebase
    if (normalized.includes("backend")) return accents.backend
    if (normalized.includes("navigation")) return accents.navigation
    if (normalized.includes("theme")) return accents.theme
    return accents.default
  }

  return (
    <section className="relative w-full overflow-hidden bg-zinc-50/50 py-24">
      <div className="pointer-events-none absolute top-0 left-1/2 h-full w-full -translate-x-1/2 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)_0.03,transparent_50%)] opacity-5" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-6 md:px-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge
            variant="outline"
            className="rounded-full border-primary/10 bg-primary/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary"
          >
            <span
              aria-hidden="true"
              className="mr-2 inline-flex size-1.5 rounded-full bg-primary animate-pulse"
            />
            Community Insights
          </Badge>
          <h2 className="text-4xl leading-[1.1] font-bold tracking-tight text-zinc-400 md:text-5xl lg:text-6xl">
            Built smarter with{" "}
            <span className="font-extrabold tracking-wider text-primary">
              FlutterInit
            </span>
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed font-medium text-zinc-500">
            Real setup choices from real projects. See what teams pick most
            often before you generate your next Flutter foundation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:auto-rows-[190px]">
          {cards.map((card, index) => {
            const accent = resolveAccent(card.label)
            const isCompactTile = index === 2 || index === 3 || index === 4 || index === 5
            return (
              <Card
                key={card.label}
                className={cn(
                  "group relative overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-white p-x-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-2xl hover:shadow-zinc-200/50",
                  bentoClasses[index] ?? "md:col-span-2 md:row-span-1"
                )}
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.74_0_0/0.09)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.74_0_0/0.09)_1px,transparent_1px)] bg-size-[28px_28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-32 bg-linear-to-b opacity-85 transition-opacity duration-300 group-hover:opacity-100",
                    accent.glow
                  )}
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,oklch(1_0_0/0.55)_0%,transparent_45%)]" />
                <CardHeader className="relative z-10 gap-5 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={cn(
                        "inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border bg-white/95 shadow-xs transition-transform duration-300 group-hover:scale-105",
                        accent.chip
                      )}
                    >
                      {card.label === 'Supabase' ? <Image
                        src="/icons/supabase.svg"
                        alt="Supabase"
                        width={24}
                        height={24}
                      /> : card.label === 'Firebase' ? <Image
                        src="/icons/firebase.svg"
                        alt="Firebase"
                        width={24}
                        height={24}
                      /> : <HugeiconsIcon
                        icon={accent.icon}
                        size={22}
                        className={accent.iconColor}
                      />}
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full border-zinc-200 bg-white px-2.5 font-bold uppercase tracking-wider text-zinc-500 text-[9px]",
                      )}
                    >
                      {card.label === 'Theme' ? 'Dark Mode' : card.label}
                    </Badge>
                  </div>
                  <CardTitle
                    className={cn(
                      "leading-none font-bold tracking-tight text-zinc-900 tabular-nums",
                      isCompactTile ? "text-2xl md:text-2xl" : "text-3xl md:text-4xl"
                    )}
                  >
                    <AnimatedValue
                      value={card.value}
                      numericValue={card.numericValue}
                      suffix={card.suffix}
                    />
                  </CardTitle>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function StatsShowcaseSkeleton() {
  return (
    <section className="w-full bg-zinc-50/50 py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 md:px-12">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-12 w-full max-w-xl rounded-lg" />
          <Skeleton className="h-5 w-full max-w-2xl rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:auto-rows-[190px]">
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <Card
              key={id}
              className={cn(
                "rounded-[2.5rem] border-zinc-200 p-6",
                bentoClasses[id - 1] ?? "md:col-span-1 md:row-span-1"
              )}
            >
              <CardHeader className="gap-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="size-12 rounded-2xl" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-12 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-4 h-4 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
