"use client"

import { Badge } from "@/components/ui/badge"
import { KineticText } from "@/components/ui/kinetic-text"
import { cn } from "@/lib/utils"
import {
  AiBrain01Icon,
  Clock01Icon,
  CpuIcon,
  DashboardSquare01Icon,
  FlashIcon,
  Globe02Icon,
  Layers01Icon,
  Shield01Icon
} from "@hugeicons/core-free-icons"
import { FeatureCard } from "./bento/FeatureCard"
import { ArchitecturePreview } from "./bento/previews/ArchitecturePreview"
import { ZeroBoilerplatePreview } from "./bento/previews/ZeroBoilerplatePreview"
import { ProductionReadyPreview } from "./bento/previews/ProductionReadyPreview"
import { PerformancePreview } from "./bento/previews/PerformancePreview"
import { TechStackPreview } from "./bento/previews/TechStackPreview"
import { RapidPrototypingPreview } from "./bento/previews/RapidPrototypingPreview"
import { GlobalReachPreview } from "./bento/previews/GlobalReachPreview"
import { AIReadyPreview } from "./bento/previews/AIReadyPreview"
import { useBentoHover } from "./bento/bento-hover-context"
import { Blur } from "@/components/animate-ui/primitives/effects/blur"

// ─── accent config ────────────────────────────────────────────────────────────
const accents = {
  primary: { iconColor: "text-primary", glow: "from-primary/10 to-transparent", chip: "bg-primary/8 border-primary/15" },
  amber:   { iconColor: "text-amber-500",   glow: "from-amber-500/10 to-transparent",   chip: "bg-amber-500/8 border-amber-500/15"   },
  emerald: { iconColor: "text-emerald-500", glow: "from-emerald-500/10 to-transparent", chip: "bg-emerald-500/8 border-emerald-500/15" },
  indigo:  { iconColor: "text-indigo-500",  glow: "from-indigo-500/10 to-transparent",  chip: "bg-indigo-500/8 border-indigo-500/15"  },
  blue:    { iconColor: "text-blue-500",    glow: "from-blue-500/10 to-transparent",    chip: "bg-blue-500/8 border-blue-500/15"    },
  rose:    { iconColor: "text-rose-500",    glow: "from-rose-500/10 to-transparent",    chip: "bg-rose-500/8 border-rose-500/15"    },
  cyan:    { iconColor: "text-cyan-500",    glow: "from-cyan-500/10 to-transparent",    chip: "bg-cyan-500/8 border-cyan-500/15"    },
  violet:  { iconColor: "text-violet-500",  glow: "from-violet-500/10 to-transparent",  chip: "bg-violet-500/8 border-violet-500/15"  },
} as const

// ─── card meta ────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    title: "Architecture Agnostic",
    description: "Clean Architecture, MVVM, or MVC.",
    icon: Layers01Icon,
    accent: accents.primary,
    label: "Workflow",
    gridClass: "md:col-span-3 md:row-span-1",
    Preview: ArchitecturePreview,
    wide: true,
  },
  {
    title: "Zero Boilerplate",
    description: "Skip the 4-hour setup. Focus on building features instead of repetitive configuration.",
    icon: FlashIcon,
    accent: accents.amber,
    label: "Speed",
    gridClass: "md:col-span-3 md:row-span-1",
    Preview: ZeroBoilerplatePreview,
    wide: true,
  },
  {
    title: "Production Ready",
    description: "Enterprise-grade logging and monitoring.",
    icon: Shield01Icon,
    accent: accents.emerald,
    label: "Reliability",
    gridClass: "md:col-span-2 md:row-span-1",
    Preview: ProductionReadyPreview,
    wide: false,
  },
  {
    title: "Optimized Performance",
    description: "Best practices for 60fps apps.",
    icon: CpuIcon,
    accent: accents.indigo,
    label: "Performance",
    gridClass: "md:col-span-2 md:row-span-1",
    Preview: PerformancePreview,
    wide: false,
  },
  {
    title: "Modern Tech Stack",
    description: "Riverpod, Bloc, and design tokens pre-integrated.",
    icon: DashboardSquare01Icon,
    accent: accents.blue,
    label: "Ecosystem",
    gridClass: "md:col-span-2 md:row-span-1",
    Preview: TechStackPreview,
    wide: false,
  },
  {
    title: "Rapid Prototyping",
    description: "From idea to running app in under 60 seconds.",
    icon: Clock01Icon,
    accent: accents.rose,
    label: "Productivity",
    gridClass: "md:col-span-2 md:row-span-1",
    Preview: RapidPrototypingPreview,
    wide: false,
  },
  {
    title: "Global Reach",
    description: "Built-in i18n and localization support.",
    icon: Globe02Icon,
    accent: accents.cyan,
    label: "Localization",
    gridClass: "md:col-span-2 md:row-span-1",
    Preview: GlobalReachPreview,
    wide: false,
  },
  {
    title: "AI-Ready Context",
    description: "AGENTS.md, DESIGN.md, and Cursor rules.",
    icon: AiBrain01Icon,
    accent: accents.violet,
    label: "AI Assistants",
    gridClass: "md:col-span-2 md:row-span-1",
    Preview: AIReadyPreview,
    wide: false,
  },
] as const

// ─── individual card ─────────────────────────────────────────────────────────────
function FeatureItem({
  title,
  description,
  accent,
  gridClass,
  Preview,
  wide,
}: (typeof FEATURES)[number]) {
  return (
    <FeatureCard accent={accent} className={gridClass}>
      {/* Preview visual — fills flex space */}
      <div className="relative z-10 mb-4 flex min-h-0 flex-1 flex-col px-5 pt-5">
        <Preview />
      </div>

      {/* Title + subtitle at bottom */}
      <div className="relative z-10 px-5 pb-5">
        <h3 className={cn(
          "mb-0.5 font-semibold leading-tight tracking-tight",
          wide ? "text-xl" : "text-base",
          "text-zinc-700 transition-[color] duration-450 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-zinc-900",
        )}>
          {title}
        </h3>
        <p className="line-clamp-1 text-xs font-medium leading-snug text-zinc-400">
          {description}
        </p>
      </div>
    </FeatureCard>
  )
}

// ─── section ─────────────────────────────────────────────────────────────────
export function WhyFlutterInit() {
  return (
    <section id="features" className="relative w-full overflow-hidden bg-zinc-50/50 py-24">
      <div className="pointer-events-none absolute top-0 left-1/2 h-full w-full -translate-x-1/2 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)_0.03,transparent_50%)] opacity-5" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-6 md:px-12">
        {/* Heading */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge
            variant="outline"
            className="rounded-full border-primary/10 bg-primary/5 px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-primary"
          >
            <span aria-hidden="true" className="mr-2 inline-flex size-1.5 rounded-full bg-primary animate-pulse" />
            Core Philosophy
          </Badge>
          <Blur inView={true}>
            <h2 className="text-4xl leading-[1.1] font-bold tracking-tight text-zinc-400 md:text-5xl lg:text-6xl">
              Why{" "}
              <KineticText
                as="span"
                text="FlutterInit"
                className="pointer-events-auto font-extrabold tracking-wider text-primary"
              />{" "}
              exists?
            </h2>
          </Blur>
          <p className="max-w-2xl text-lg leading-relaxed font-medium text-zinc-500">
            We believe Flutter development should be about innovation, not repetitive configuration.
            Stop wasting days on project setup and start building.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-6 md:auto-rows-[260px]">
          {FEATURES.map((feature) => (
            <FeatureItem key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
