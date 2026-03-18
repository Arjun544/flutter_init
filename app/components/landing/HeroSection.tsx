import { Button } from '@/components/ui/button';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { NodePattern } from './NodePattern';
import { MobileNodePattern } from './MobileNodePattern';
import { GitHubStars, GitHubStarsSkeleton } from './GitHubStars';
import { Suspense } from 'react';

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Premium background grid - softer and atmospheric */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[64px_64px]"
        style={{
          maskImage: 'linear-gradient(to_bottom, black 10%, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to_bottom, black 10%, transparent 80%)'
        }}
      />

      {/* Subtle radial center glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.02)_0%,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center pt-8">
        {/* Clean Pill Badge */}
        <Link 
          href="https://github.com/Arjun544/flutter_init"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-4 mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-zinc-200/80 hover:border-primary/40 hover:shadow-[0_4px_15px_-5px_hsl(var(--primary)/0.2)] transition-all duration-300 cursor-pointer"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[13px] font-semibold tracking-wide text-zinc-900">Open Source</span>
          <div className="w-px h-3.5 bg-zinc-200 mx-1" />
          <span className="text-[13px] font-medium text-zinc-500 group-hover:text-primary transition-colors">Contribute on GitHub &rarr;</span>
        </Link>

        {/* Ultra-sharp Typography */}
        <h1 className="text-5xl mt-10 sm:text-7xl md:text-[5rem] lg:text-[6rem] font-medium text-primary leading-[0.95] mb-6 max-w-5xl mx-auto relative z-20">
          <span className="font-bold">Architect</span> <br className="hidden sm:block" />
          <span className="text-zinc-400">your <span className="font-bold text-primary">Flutter</span> app.</span>
        </h1>

        <p className="max-w-xl text-[1.1rem] sm:text-[1.25rem] text-zinc-500 mb-12 font-medium leading-relaxed tracking-tight">
          Scaffolds your entire Flutter app with your preferred state management, routing, and utilities.
        </p>

        {/* Sleek Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto relative z-30">
          <Button asChild size="lg" className="h-14 px-8 text-[1.05rem] font-semibold tracking-wide rounded-2xl bg-zinc-950 text-white shadow-[0_8px_25px_-5px_rgba(0,0,0,0.3)] hover:bg-zinc-800 hover:scale-[1.02] hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.4)] transition-all duration-300 sm:w-auto group border border-zinc-800">
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

          <Suspense fallback={<GitHubStarsSkeleton />}>
            <GitHubStars />
          </Suspense>
        </div>
        {/* Branching Visual Nodes - Now taking visual priority at the top */}
        <div className="hidden sm:block w-full">
          <NodePattern />
        </div>
        <div className="block sm:hidden w-full">
          <MobileNodePattern />
        </div>

      </div>
    </section>
  );
}
