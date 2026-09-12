'use client';

import * as React from 'react';
import { CopyButton } from '@/components/animate-ui/components/buttons/copy';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CliCommandProps {
  className?: string;
}

export function CliCommand({ className }: CliCommandProps) {
  const commandText = 'npx create-flutterinit';

  return (
    <div className={cn(
      "pointer-events-auto inline-flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-full bg-white smooth-shadow-ring-sm hover:smooth-shadow-ring-md hover:shadow-indigo-500/15 transition-all duration-300 select-none",
      className
    )}>
      {/* Terminal Icon */}
      <svg
        className="w-3.5 h-3.5 text-zinc-400 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>

      {/* CLI Tag */}
      <span className="text-[10px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-500 scale-90 select-none">
        CLI
      </span>

      {/* Command Text */}
      <div className="relative flex items-center select-all">
        <code className="font-mono text-[13px] font-semibold text-zinc-800 tracking-tight leading-none pt-px pr-1 whitespace-nowrap block">
          {commandText}
        </code>
      </div>

      {/* Separator */}
      <div className="w-px h-3.5 bg-zinc-200" />

      {/* Copy Button */}
      <CopyButton
        content={commandText}
        variant="ghost"
        size="xs"
        className="rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
        aria-label="Copy CLI command"
      />
    </div>
  );
}



