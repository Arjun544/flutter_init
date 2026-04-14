import { cn } from '@/lib/utils';
import {
  Clock01Icon,
  CpuIcon,
  DashboardSquare01Icon,
  FlashIcon,
  Layers01Icon,
  Shield01Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type Feature = {
  title: string;
  description: string;
  className: string;
  icon: JSX.Element;
  accent: string;
  gradient: string;
  pattern: 'dots' | 'grid' | 'waves';
  metric: string;
  chips: string[];
};

export function WhyFlutterInit() {
  const features: Feature[] = [
    {
      title: 'Architecture Agnostic',
      description:
        "Clean Architecture, MVVM, or MVC. FlutterInit mirrors your team\'s mental model without forcing a single doctrine.",
      className: 'md:col-span-2 md:row-span-1',
      icon: <HugeiconsIcon icon={Layers01Icon} size={22} className="text-primary" />,
      accent: 'primary',
      gradient: 'from-primary/15 via-primary/5 to-transparent',
      pattern: 'grid',
      metric: '3 major patterns supported',
      chips: ['Clean', 'MVVM', 'Feature-first']
    },
    {
      title: 'Zero Boilerplate',
      description: 'Generate battle-tested structure, wiring, and defaults in seconds.',
      className: 'md:col-span-1 md:row-span-1',
      icon: <HugeiconsIcon icon={FlashIcon} size={22} className="text-amber-500" />,
      accent: 'amber',
      gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
      pattern: 'dots',
      metric: '< 60 sec setup',
      chips: ['Fast', 'Typed', 'Ready']
    },
    {
      title: 'Production Ready',
      description:
        'Error handling, logging, and environment management are built in from day one.',
      className: 'md:col-span-1 md:row-span-2',
      icon: <HugeiconsIcon icon={Shield01Icon} size={22} className="text-emerald-500" />,
      accent: 'emerald',
      gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      pattern: 'waves',
      metric: 'Enterprise defaults included',
      chips: ['Logging', 'Env', 'Reliability']
    },
    {
      title: 'Optimized Performance',
      description: 'Lean templates and pragmatic defaults for smooth 60fps experiences.',
      className: 'md:col-span-1 md:row-span-1',
      icon: <HugeiconsIcon icon={CpuIcon} size={22} className="text-indigo-500" />,
      accent: 'indigo',
      gradient: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
      pattern: 'grid',
      metric: 'Performance-first scaffolds',
      chips: ['Lightweight', 'Scalable', 'Maintainable']
    },
    {
      title: 'Modern Tech Stack',
      description: 'Riverpod, Bloc, GoRouter, and Material 3 tokens pre-integrated.',
      className: 'md:col-span-1 md:row-span-1',
      icon: <HugeiconsIcon icon={DashboardSquare01Icon} size={22} className="text-blue-500" />,
      accent: 'blue',
      gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
      pattern: 'dots',
      metric: 'Tools teams already love',
      chips: ['Riverpod', 'Bloc', 'GoRouter']
    },
    {
      title: 'Rapid Prototyping',
      description: 'Move from idea to installable build quickly and iterate without friction.',
      className: 'md:col-span-2 md:row-span-1',
      icon: <HugeiconsIcon icon={Clock01Icon} size={22} className="text-rose-500" />,
      accent: 'rose',
      gradient: 'from-rose-500/20 via-rose-500/5 to-transparent',
      pattern: 'waves',
      metric: 'More time for product thinking',
      chips: ['Prototype', 'Validate', 'Ship']
    }
  ];

  const patternClassByType: Record<Feature['pattern'], string> = {
    dots:
      'bg-[radial-gradient(circle_at_center,rgba(24,24,27,0.12)_1px,transparent_1px)] [background-size:16px_16px]',
    grid:
      'bg-[linear-gradient(rgba(24,24,27,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,27,0.08)_1px,transparent_1px)] [background-size:18px_18px]',
    waves:
      'bg-[radial-gradient(ellipse_at_top,rgba(24,24,27,0.1),transparent_65%),radial-gradient(ellipse_at_bottom,rgba(24,24,27,0.08),transparent_60%)]'
  };

  const chipClassByAccent: Record<Feature['accent'], string> = {
    primary: 'bg-primary/10 text-primary',
    amber: 'bg-amber-500/10 text-amber-700',
    emerald: 'bg-emerald-500/10 text-emerald-700',
    indigo: 'bg-indigo-500/10 text-indigo-700',
    blue: 'bg-blue-500/10 text-blue-700',
    rose: 'bg-rose-500/10 text-rose-700'
  };

  return (
    <section className="relative w-full overflow-hidden bg-zinc-50/60 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)_0.05,transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Core Philosophy</span>
          </div>

          <h2 className="mb-6 text-4xl font-bold tracking-tight text-zinc-400 md:text-5xl lg:text-6xl leading-[1.1]">
            Why <span className="font-extrabold tracking-wider text-primary">FlutterInit</span> exists?
          </h2>

          <p className="max-w-2xl text-lg font-medium leading-relaxed text-zinc-500">
            We believe Flutter development should be about innovation, not repetitive configuration.
            Stop wasting days on setup and start shipping meaningful product value.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:auto-rows-[220px] md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={cn(
                'group relative isolate flex h-full flex-col overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/95 p-6 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-300/30',
                feature.className
              )}
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
                <div className={cn('absolute inset-0 bg-linear-to-br', feature.gradient)} />
              </div>

              <div
                className={cn(
                  'pointer-events-none absolute inset-0 opacity-[0.06] transition duration-700 group-hover:opacity-[0.12]',
                  patternClassByType[feature.pattern]
                )}
              />

              <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 transition-all duration-500 group-hover:border-zinc-300 group-hover:text-zinc-700">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/80 group-hover:animate-ping" />
                Live
              </div>

              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50/90 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:border-zinc-300 group-hover:bg-white">
                    {feature.icon}
                  </div>

                  <p className="max-w-[180px] text-right text-xs font-semibold uppercase tracking-wide text-zinc-400 transition-colors duration-500 group-hover:text-zinc-600">
                    {feature.metric}
                  </p>
                </div>

                <h3 className="mb-2 text-xl font-bold tracking-tight text-zinc-900 transition-colors duration-500 group-hover:text-primary md:text-2xl">
                  {feature.title}
                </h3>

                <p className="text-[15px] font-medium leading-relaxed text-zinc-500">
                  {feature.description}
                </p>

                <div className="mt-auto pt-5">
                  <div className="flex flex-wrap gap-2">
                    {feature.chips.map((chip) => (
                      <span
                        key={chip}
                        className={cn(
                          'rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-transform duration-500 group-hover:-translate-y-0.5',
                          chipClassByAccent[feature.accent]
                        )}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-12 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:scale-125 group-hover:bg-primary/20" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
