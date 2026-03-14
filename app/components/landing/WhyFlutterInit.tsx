import { cn } from '@/lib/utils';
import { Clock, Cpu, Layers, LayoutDashboard, Shield, Zap } from 'lucide-react';

export function WhyFlutterInit() {
  const features = [
    {
      title: "Architecture Agnostic",
      description: "Clean Architecture, MVVM, or MVC. FlutterInit adapts to your team's workflow, providing the perfect structure every time.",
      icon: <Layers className="w-6 h-6 text-primary" />,
      className: "md:col-span-2 md:row-span-1",
      gradient: "from-primary/10 via-primary/5 to-transparent",
      pattern: true,
      hoverBg: "group-hover:bg-primary/10",
      hoverBorder: "group-hover:border-primary/25"
    },
    {
      title: "Zero Boilerplate",
      description: "Skip the 4-hour setup. Focus on features.",
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      className: "md:col-span-1 md:row-span-1",
      gradient: "from-amber-500/10 to-transparent",
      hoverBg: "group-hover:bg-amber-500/10",
      hoverBorder: "group-hover:border-amber-500/25"
    },
    {
      title: "Production Ready",
      description: "Enterprise-grade logging, error handling, and monitoring built into the core. Scale with confidence.",
      icon: <Shield className="w-6 h-6 text-emerald-500" />,
      className: "md:col-span-1 md:row-span-2",
      gradient: "from-emerald-500/10 to-transparent",
      vertical: true,
      hoverBg: "group-hover:bg-emerald-500/10",
      hoverBorder: "group-hover:border-emerald-500/25"
    },
    {
      title: "Optimized Performance",
      description: "Lightweight scaffolds following best practices for 60fps animations.",
      icon: <Cpu className="w-6 h-6 text-indigo-500" />,
      className: "md:col-span-1 md:row-span-1",
      gradient: "from-indigo-500/10 to-transparent",
      hoverBg: "group-hover:bg-indigo-500/10",
      hoverBorder: "group-hover:border-indigo-500/25"
    },
    {
      title: "Modern Tech Stack",
      description: "Riverpod, Bloc, GoRouter, and Material 3 design tokens pre-integrated.",
      icon: <LayoutDashboard className="w-6 h-6 text-blue-500" />,
      className: "md:col-span-1 md:row-span-1",
      gradient: "from-blue-500/10 to-transparent",
      hoverBg: "group-hover:bg-blue-500/10",
      hoverBorder: "group-hover:border-blue-500/25"
    },
    {
      title: "Rapid Prototyping",
      description: "From idea to running app in under 60 seconds. The faster way to ship Flutter applications to production.",
      icon: <Clock className="w-6 h-6 text-rose-500" />,
      className: "md:col-span-2 md:row-span-1",
      gradient: "from-rose-500/10 to-transparent",
      pattern: true,
      hoverBg: "group-hover:bg-rose-500/10",
      hoverBorder: "group-hover:border-rose-500/25"
    }
  ];

  return (
    <section className="w-full py-24 bg-zinc-50/50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)_0.03,transparent_50%)] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Core Philosophy</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-400 mb-6 tracking-tight leading-[1.1]">
            Why <span className="text-primary tracking-wider font-extrabold">FlutterInit</span> exists?
          </h2>
          <p className="text-lg text-zinc-500 max-w-2xl font-medium leading-relaxed">
            We believe Flutter development should be about innovation, not repetitive configuration.
            Stop wasting days on project setup and start building.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[200px]">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-6 transition-all duration-500 hover:border-zinc-300 hover:shadow-2xl hover:shadow-zinc-200/50 hover:-translate-y-1.5 flex flex-col ${feature.className}`}
            >
              {/* Pattern Overlay */}
              {feature.pattern && (
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px]" />
              )}

              {/* Radial Highlight */}
              <div className={`absolute -inset-px bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

              <div className="relative z-10 flex flex-col h-full">
                <div className={cn(
                  "mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 group-hover:scale-110 transition-all duration-500 shadow-sm shrink-0",
                  feature.hoverBg,
                  feature.hoverBorder
                )}>
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-semibold text-zinc-900 mb-3 group-hover:text-primary transition-colors tracking-tight">
                  {feature.title}
                </h3>

                <p className={`text-zinc-400 text-[15px] leading-relaxed font-medium ${feature.vertical ? 'max-w-[200px]' : ''}`}>
                  {feature.description}
                </p>
              </div>

              {/* Decorative Corner Element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
