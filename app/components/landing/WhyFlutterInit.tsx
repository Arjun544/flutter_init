"use client"

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { cn } from '@/lib/utils';
import {
  Clock01Icon,
  CpuIcon,
  DashboardSquare01Icon,
  FlashIcon,
  Globe02Icon,
  Layers01Icon,
  Shield01Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const bentoClasses = [
  "md:col-span-3 md:row-span-1", // Row 1: Item 1
  "md:col-span-3 md:row-span-1", // Row 1: Item 2
  "md:col-span-2 md:row-span-1", // Row 2: Item 3
  "md:col-span-2 md:row-span-1", // Row 2: Item 4
  "md:col-span-2 md:row-span-1", // Row 2: Item 5
  "md:col-span-3 md:row-span-1", // Row 3: Item 6
  "md:col-span-3 md:row-span-1", // Row 3: Item 7
]

export function WhyFlutterInit() {
  const accents = {
    primary: {
      iconColor: "text-primary",
      glow: "from-primary/10 to-transparent",
      chip: "bg-primary/8 border-primary/15",
    },
    amber: {
      iconColor: "text-amber-500",
      glow: "from-amber-500/10 to-transparent",
      chip: "bg-amber-500/8 border-amber-500/15",
    },
    emerald: {
      iconColor: "text-emerald-500",
      glow: "from-emerald-500/10 to-transparent",
      chip: "bg-emerald-500/8 border-emerald-500/15",
    },
    indigo: {
      iconColor: "text-indigo-500",
      glow: "from-indigo-500/10 to-transparent",
      chip: "bg-indigo-500/8 border-indigo-500/15",
    },
    blue: {
      iconColor: "text-blue-500",
      glow: "from-blue-500/10 to-transparent",
      chip: "bg-blue-500/8 border-blue-500/15",
    },
    rose: {
      iconColor: "text-rose-500",
      glow: "from-rose-500/10 to-transparent",
      chip: "bg-rose-500/8 border-rose-500/15",
    },
    cyan: {
      iconColor: "text-cyan-500",
      glow: "from-cyan-500/10 to-transparent",
      chip: "bg-cyan-500/8 border-cyan-500/15",
    },
  } as const;

  const features = [
    {
      title: "Architecture Agnostic",
      description: "Clean Architecture, MVVM, or MVC. FlutterInit adapts to your team's workflow, providing the perfect structure every time.",
      icon: Layers01Icon,
      accent: accents.primary,
      label: "Workflow"
    },
    {
      title: "Zero Boilerplate",
      description: "Skip the 4-hour setup. Focus on building features instead of repetitive configuration.",
      icon: FlashIcon,
      accent: accents.amber,
      label: "Speed"
    },
    {
      title: "Production Ready",
      description: "Enterprise-grade logging and monitoring built into the core.",
      icon: Shield01Icon,
      accent: accents.emerald,
      label: "Reliability"
    },
    {
      title: "Optimized Performance",
      description: "Lightweight Scaffold following best practices for 60fps apps.",
      icon: CpuIcon,
      accent: accents.indigo,
      label: "Performance"
    },
    {
      title: "Modern Tech Stack",
      description: "Riverpod, Bloc, and Material 3 design tokens pre-integrated.",
      icon: DashboardSquare01Icon,
      accent: accents.blue,
      label: "Ecosystem"
    },
    {
      title: "Rapid Prototyping",
      description: "From idea to running app in under 60 seconds.",
      icon: Clock01Icon,
      accent: accents.rose,
      label: "Productivity"
    },
    {
      title: "Global Reach",
      description: "Built-in i18n and localization support to reach users in every language.",
      icon: Globe02Icon,
      accent: accents.cyan,
      label: "Localization"
    }
  ];

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
            Core Philosophy
          </Badge>
          <h2 className="text-4xl leading-[1.1] font-bold tracking-tight text-zinc-400 md:text-5xl lg:text-6xl">
            Why{" "}
            <span className="font-extrabold tracking-wider text-primary">
              FlutterInit
            </span>{" "}
            exists?
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed font-medium text-zinc-500">
            We believe Flutter development should be about innovation, not repetitive configuration.
            Stop wasting days on project setup and start building.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-6 md:auto-rows-[220px]">
          {features.map((feature, index) => {
            const isWideTile = index === 0 || index === 1 || index === 5 || index === 6;
            const isCompactTile = index === 2 || index === 3 || index === 4;
            return (
              <Card
                key={feature.title}
                className={cn(
                  "group relative overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-white transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-2xl hover:shadow-zinc-200/50 flex flex-col py-5 gap-4",
                  bentoClasses[index] ?? "md:col-span-1 md:row-span-1"
                )}
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.74_0_0/0.09)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.74_0_0/0.09)_1px,transparent_1px)] bg-size-[28px_28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-32 bg-linear-to-b opacity-85 transition-opacity duration-300 group-hover:opacity-100",
                    feature.accent.glow
                  )}
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,oklch(1_0_0/0.55)_0%,transparent_45%)]" />

                <CardHeader className="relative z-10 gap-2 pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={cn(
                        "inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border bg-white/95 shadow-xs transition-transform duration-300 group-hover:scale-105",
                        feature.accent.chip
                      )}
                    >
                      <HugeiconsIcon
                        icon={feature.icon}
                        size={22}
                        className={feature.accent.iconColor}
                      />
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-full border-zinc-200 bg-white px-2.5 font-bold uppercase tracking-wider text-zinc-500 text-[9px]"
                    >
                      {feature.label}
                    </Badge>
                  </div>
                  <CardTitle
                    className={cn(
                      "leading-tight font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-primary",
                      isWideTile ? "text-2xl md:text-3xl" : "text-xl"
                    )}
                  >
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-3">
                  <p className="text-sm font-medium leading-relaxed text-zinc-500">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}

