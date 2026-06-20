import { Button } from '@/components/ui/button';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { CliCommand } from './CliCommand';
import { MobileNodePattern } from './MobileNodePattern';
import { NodePattern } from './NodePattern';
import { cn } from '@/lib/utils';
import { KineticText } from '@/components/ui/kinetic-text';
import { HexagonBackground } from '@/components/animate-ui/components/backgrounds/hexagon';
import { BorderBeam } from '@/components/ui/border-beam'

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Hexagon grid — aria-hidden overlay, same pattern as talkfolio Hero */}
      <HexagonBackground
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-transparent"
        hexagonSize={72}
        hexagonMargin={0}
        hexagonStroke={1}
        hexagonProps={{
          className: cn(
            'pointer-events-auto',
            'before:bg-zinc-400/10 before:opacity-100',
            'after:bg-white',
            'hover:before:bg-zinc-300/40 hover:before:duration-0',
            'hover:after:bg-zinc-50 hover:after:duration-0',
          ),
        }}
      />

      {/* Soft radial centre glow */}
      <div className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,0,0,0.03)_0%,transparent_70%)]" />

      {/* Bottom fade scrim so hexagons dissolve into the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-2 h-48"
        style={{ background: 'linear-gradient(to top, #fff 15%, transparent)' }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center pt-16">

       
        {/* CLI Command Pill */}
        <BorderBeam size="md" colorVariant="colorful" className="mt-20 mb-8">
          <CliCommand />
        </BorderBeam>

        {/* Ultra-sharp Typography */}
        <h1 className="text-5xl mt-10 sm:text-7xl md:text-[5rem] lg:text-[6rem] font-medium text-primary leading-[0.95] mb-6 max-w-5xl mx-auto relative z-20">
          <KineticText as="span" text="Architect" className="pointer-events-auto font-bold" /> <br className="hidden sm:block" />
          <span className="text-zinc-400">your{' '}
            <KineticText
              as="span"
              text="Flutter"
              className="pointer-events-auto font-bold text-primary"
            />{' '}app.
          </span>
        </h1>

        <p className="max-w-xl text-[1.1rem] sm:text-[1.25rem] text-zinc-500 mb-12 font-medium leading-relaxed tracking-tight">
          Scaffold your entire Flutter app with your preferred state management, routing, and utilities.
        </p>

        {/* Sleek Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto">
          <Button asChild size="lg" className="h-14 px-6 text-md md:text-md font-semibold tracking-wide rounded-2xl bg-zinc-950 text-white shadow-[0_8px_25px_-5px_rgba(0,0,0,0.3)] hover:bg-zinc-800 hover:scale-[1.02] hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.4)] transition-all duration-300 sm:w-auto group border border-zinc-800">
            <Link href="/create">
              Start Generating
              <div className="ml-3 flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </div>
            </Link>
          </Button>
        </div>
        {/* Branching Visual Nodes - Now taking visual priority at the top */}
        <div id="how-it-works" className="w-full">
          <div className="hidden sm:block w-full">
            <NodePattern />
          </div>
          <div className="block sm:hidden w-full">
            <MobileNodePattern />
          </div>
        </div>

      </div>
    </section>
  );
}
