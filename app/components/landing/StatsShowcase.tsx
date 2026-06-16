"use client"


import { Badge } from "@/components/ui/badge"
import { KineticText } from "@/components/ui/kinetic-text"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import { BarBreakdown } from "./bento/stats/BarBreakdown"
import { CountStat } from "./bento/stats/CountStat"
import { SparklineStat } from "./bento/stats/SparklineStat"
import { StatCardShell } from "./bento/stats/StatCardShell"

// ─── types ────────────────────────────────────────────────────────────────────
export type StatCard = {
  title: string
  value: string
  numericValue?: number
  suffix?: string
  eyebrow: string
}

// ─── bento layout ─────────────────────────────────────────────────────────────
const bentoClasses = [
  "md:col-span-2 md:row-span-1", // 0 – Projects Generated (wide)
  "md:col-span-2 md:row-span-1", // 1 – State Management   (wide)
  "md:col-span-1 md:row-span-1", // 2 – Architecture       (compact)
  "md:col-span-1 md:row-span-1", // 3 – Firebase           (compact)
  "md:col-span-1 md:row-span-1", // 4 – Supabase           (compact)
  "md:col-span-1 md:row-span-1", // 5 – Backend            (compact)
  "md:col-span-2 md:row-span-1", // 6 – Navigation         (wide)
  "md:col-span-2 md:row-span-1", // 7 – Theme              (compact)
]

// ─── accent definitions ───────────────────────────────────────────────────────
const ACCENTS = {
  volume: { glow: "from-primary/10 to-transparent", chip: "bg-primary/8 border-primary/15", accent: "text-primary", bar: "bg-primary" },
  state: { glow: "from-pink-500/10 to-transparent", chip: "bg-pink-500/8 border-pink-500/15", accent: "text-pink-500", bar: "bg-pink-500" },
  architecture: { glow: "from-rose-500/10 to-transparent", chip: "bg-rose-500/8 border-rose-500/15", accent: "text-rose-500", bar: "bg-rose-500" },
  firebase: { glow: "from-red-500/10 to-transparent", chip: "bg-red-500/8 border-red-500/15", accent: "text-red-500", bar: "bg-red-500" },
  supabase: { glow: "from-emerald-500/10 to-transparent", chip: "bg-emerald-500/8 border-emerald-500/15", accent: "text-emerald-500", bar: "bg-emerald-500" },
  backend: { glow: "from-yellow-500/10 to-transparent", chip: "bg-yellow-500/8 border-yellow-500/15", accent: "text-yellow-500", bar: "bg-yellow-500" },
  navigation: { glow: "from-cyan-500/10 to-transparent", chip: "bg-cyan-500/8 border-cyan-500/15", accent: "text-cyan-500", bar: "bg-cyan-500" },
  theme: { glow: "from-slate-500/10 to-transparent", chip: "bg-slate-500/8 border-slate-500/15", accent: "text-slate-500", bar: "bg-slate-500" },
} as const

function resolveAccent(label: string) {
  const n = label.toLowerCase()
  if (n.includes("project")) return ACCENTS.volume
  if (n.includes("state")) return ACCENTS.state
  if (n.includes("arch")) return ACCENTS.architecture
  if (n.includes("firebase")) return ACCENTS.firebase
  if (n.includes("supabase")) return ACCENTS.supabase
  if (n.includes("backend")) return ACCENTS.backend
  if (n.includes("nav")) return ACCENTS.navigation
  if (n.includes("theme")) return ACCENTS.theme
  return ACCENTS.volume
}


// ─── visualization selector ───────────────────────────────────────────────────
function CardViz({
  index,
  card,
  isHovered,
}: { index: number; card: StatCard; isHovered: boolean }) {
  const a = resolveAccent(card.title)

  // Wide cards (0 = projects, 6 = navigation) → sparkline + big stat
  if (index === 0) {
    return (
      <SparklineStat
        value={card.value}
        numericValue={card.numericValue}
        suffix={card.suffix}
        eyebrow={card.eyebrow}
        trend={[18, 26, 22, 38, 51, 47, 68, 79, 88, 100]}
        accentClass={a.accent}
        barClass={a.bar}
        isHovered={isHovered}
      />
    )
  }

  if (index === 6) {
    return (
      <SparklineStat
        value={card.value}
        numericValue={card.numericValue}
        suffix={card.suffix}
        eyebrow={card.eyebrow}
        trend={[55, 60, 58, 72, 68, 80, 85, 90, 92, 95]}
        accentClass={a.accent}
        barClass={a.bar}
        isHovered={isHovered}
      />
    )
  }

  // State management (1) → horizontal bar breakdown
  if (index === 1) {
    return (
      <BarBreakdown
        eyebrow={card.eyebrow}
        items={[
          { label: "Riverpod", percent: 42, colorClass: "bg-pink-400" },
          { label: "Bloc", percent: 28, colorClass: "bg-pink-500" },
          { label: "GetX", percent: 18, colorClass: "bg-pink-300" },
          { label: "Provider", percent: 12, colorClass: "bg-pink-200" },
        ]}
        isHovered={isHovered}
        accentClass={a.accent}
      />
    )
  }

  // Architecture (2) → bar breakdown
  if (index === 2) {
    return (
      <BarBreakdown
        eyebrow={card.eyebrow}
        items={[
          { label: "Feature-first", percent: 45, colorClass: "bg-rose-400" },
          { label: "Clean", percent: 30, colorClass: "bg-rose-500" },
          { label: "MVVM", percent: 25, colorClass: "bg-rose-300" },
        ]}
        isHovered={isHovered}
        accentClass={a.accent}
      />
    )
  }

  // Firebase (3), Supabase (4) → ring stat
  if (index === 3) {
    return (
      <CountStat
        eyebrow={card.eyebrow}
        value={card.value}
        numericValue={card.numericValue}
        suffix={card.suffix}
        percent={68}
        color="rgb(239 68 68)"
        trackColor="rgb(254 226 226)"
        isHovered={isHovered}
        accentClass={a.accent}
      />
    )
  }

  if (index === 4) {
    return (
      <CountStat
        eyebrow={card.eyebrow}
        value={card.value}
        numericValue={card.numericValue}
        suffix={card.suffix}
        percent={52}
        color="rgb(16 185 129)"
        trackColor="rgb(209 250 229)"
        isHovered={isHovered}
        accentClass={a.accent}
      />
    )
  }

  // Backend choices (5) → bar breakdown
  if (index === 5) {
    return (
      <BarBreakdown
        eyebrow={card.eyebrow}
        items={[
          { label: "Firebase", percent: 48, colorClass: "bg-yellow-400" },
          { label: "Supabase", percent: 32, colorClass: "bg-yellow-500" },
          { label: "Appwrite", percent: 12, colorClass: "bg-yellow-300" },
          { label: "Custom", percent: 8, colorClass: "bg-yellow-200" },
        ]}
        isHovered={isHovered}
        accentClass={a.accent}
      />
    )
  }

  // Fallback — simple big number
  return (
    <p className={cn("text-4xl font-black tabular-nums tracking-tight transition-colors", isHovered ? a.accent : "text-zinc-700")}>
      {card.value}{card.suffix}
    </p>
  )
}

// ─── single bento card ────────────────────────────────────────────────────────
function StatBentoCard({ card, index }: { card: StatCard; index: number }) {
  const a = resolveAccent(card.title)

  return (
    <StatCardShell
      className={bentoClasses[index] ?? "md:col-span-1"}
      glowClass={a.glow}
      title={card.title === "Theme" ? "Dark Mode" : card.title}
      subtitle={card.eyebrow}
    >
      {(isHovered) => <CardViz index={index} card={card} isHovered={isHovered} />}
    </StatCardShell>
  )
}

// ─── section ─────────────────────────────────────────────────────────────────
export function StatsShowcase({ cards }: { cards: StatCard[] }) {
  return (
    <section className="relative w-full overflow-hidden bg-zinc-50/50 py-24">
      <div className="pointer-events-none absolute top-0 left-1/2 h-full w-full -translate-x-1/2 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)_0.03,transparent_50%)] opacity-5" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-6 md:px-12">
        {/* Heading */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge
            variant="outline"
            className="rounded-full border-primary/10 bg-primary/5 px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-primary"
          >
            <span aria-hidden="true" className="mr-2 inline-flex size-1.5 rounded-full bg-primary animate-pulse" />
            Community Insights
          </Badge>
          <h2 className="text-4xl leading-[1.1] font-bold tracking-tight text-zinc-400 md:text-5xl lg:text-6xl">
            Built smarter with{" "}
            <KineticText
              as="span"
              text="FlutterInit"
              className="pointer-events-auto font-extrabold tracking-wider text-primary"
            />
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed font-medium text-zinc-500">
            Real setup choices from real projects. See what teams pick most
            often before you generate your next Flutter foundation.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:auto-rows-[220px]">
          {cards.map((card, index) => (
            <StatBentoCard key={card.title} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── skeleton ─────────────────────────────────────────────────────────────────
export function StatsShowcaseSkeleton() {
  return (
    <section className="w-full bg-zinc-50/50 py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 md:px-12">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-12 w-full max-w-xl rounded-lg" />
          <Skeleton className="h-5 w-full max-w-2xl rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:auto-rows-[220px]">
          {bentoClasses.map((cls, id) => (
            <div
              key={id}
              className={cn("rounded-[2.5rem] border border-zinc-100 bg-white p-6", cls)}
            >
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="size-11 rounded-2xl" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-28 mb-3" />
              <Skeleton className="h-10 w-40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
