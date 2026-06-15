import { GithubIcon, StarIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';

async function getStars() {
  try {
    const res = await fetch('https://api.github.com/repos/Arjun544/flutter_init', {
      next: {
        revalidate: 3600, // 1 hour
        tags: ['github-stars']
      }
    });

    if (!res.ok) return 0;

    const data = await res.json();
    return (data.stargazers_count as number) || 0;
  } catch (err) {
    console.error('Failed to fetch stars:', err);
    return 0;
  }
}

export async function GitHubStars({ variant = 'default' }: { variant?: 'default' | 'sm' }) {
  const stars = await getStars();

  if (variant === 'sm') {
    return (
      <Link
        href="https://github.com/Arjun544/flutter_init"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2 h-9 px-3 rounded-lg bg-white border border-zinc-200 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:border-primary/30 hover:shadow-[0_4px_12px_-3px_rgba(0,0,0,0.08)] hover:shadow-primary/5 hover:scale-[1.01] transition-all duration-200 overflow-hidden"
      >
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon
            icon={GithubIcon}
            size={16}
            className="text-zinc-900 group-hover:text-primary transition-colors duration-200"
          />
          <span className="text-xs font-semibold text-zinc-700 group-hover:text-primary transition-colors">
            GitHub
          </span>
        </div>

        <div className="h-3 w-px bg-zinc-200" />

        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-zinc-50 border border-zinc-100 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-200">
          <HugeiconsIcon
            icon={StarIcon}
            size={12}
            className="text-zinc-400 group-hover:text-primary transition-all duration-200"
          />
          <span className="text-xs font-bold font-mono text-zinc-600 group-hover:text-primary transition-colors">
            {stars.toLocaleString()}
          </span>
        </div>

        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/5 transition-colors duration-200 -z-10" />

        {/* Animated background shine */}
        <div className="absolute -inset-x-20 top-0 h-full w-20 bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out" />
      </Link>
    );
  }

  return (
    <Link
      href="https://github.com/Arjun544/flutter_init"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-4 h-14 px-6 rounded-2xl bg-white border border-zinc-200 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.05)] hover:border-primary/30 hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.1)] hover:shadow-primary/5 hover:scale-[1.02] transition-all duration-300 sm:w-auto overflow-hidden"
    >
      <div className="flex items-center">
        <HugeiconsIcon
          icon={GithubIcon}
          size={24}
          className="text-zinc-900 group-hover:text-primary transition-colors duration-300"
        />
      </div>

      <div className="h-4 w-px bg-zinc-200 mx-1" />

      <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-zinc-50 border border-zinc-100 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-300">
        <HugeiconsIcon
          icon={StarIcon}
          size={18}
          className="text-zinc-400 group-hover:text-primary transition-all duration-300"
        />
        <span className="text-base font-bold font-mono text-zinc-600 group-hover:text-primary transition-colors">
          {stars.toLocaleString()}
        </span>
      </div>

      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 -z-10" />

      {/* Animated background shine */}
      <div className="absolute -inset-x-20 top-0 h-full w-20 bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out" />
    </Link>
  );
}

export function GitHubStarsSkeleton({ variant = 'default' }: { variant?: 'default' | 'sm' }) {
  if (variant === 'sm') {
    return (
      <div className="flex items-center gap-2.5 h-9 px-3 rounded-lg bg-white border border-zinc-200 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] w-[120px] animate-pulse">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-zinc-100" />
          <div className="w-10 h-3 bg-zinc-100 rounded" />
        </div>
        <div className="h-3 w-px bg-zinc-200" />
        <div className="w-10 h-5 bg-zinc-50 border border-zinc-100 rounded-md animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 h-14 px-6 rounded-2xl bg-white border border-zinc-200 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.05)] w-full sm:w-auto animate-pulse">
      <div className="flex items-center">
        <div className="w-6 h-6 rounded-full bg-zinc-100" />
      </div>
      <div className="h-4 w-px bg-zinc-200 mx-1" />
      <div className="w-20 h-8 bg-zinc-50 border border-zinc-100 rounded-xl" />
    </div>
  );
}
