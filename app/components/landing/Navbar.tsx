'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Menu04Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import {
  Highlight,
  HighlightItem,
} from '@/components/animate-ui/primitives/effects/highlight'
import { useIsMobile } from '@/hooks/use-mobile'

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it Works' },
  { href: '#features', label: 'Features' },
  { href: '#showcase', label: 'Showcase' },
  { href: '/blogs', label: 'Blog' },

  { href: '/blog', label: 'Blog' },
]

const SCROLL_RANGE = 500

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function Navbar({ githubStars }: { githubStars?: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isMobile = useIsMobile()

  const { scrollY } = useScroll()

  // Track scrolled boolean for mobile menu shape
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > SCROLL_RANGE * 0.5)
  })

  // ── Derived motion values ───────────────────────────────────────

  /** Header top padding: 0 → 16px */
  const headerPaddingTop = useTransform(scrollY, [0, SCROLL_RANGE], [0, 16], { clamp: true })

  /** Nav width: 100vw → 52vw */
  const navWidth = useTransform(
    scrollY,
    [0, SCROLL_RANGE],
    ['90%', '52%'],
    { clamp: true },
  )

  /** Nav corner radius: sharp → pill */
  const navBorderRadius = useTransform(scrollY, [0, SCROLL_RANGE], [0, 9999], { clamp: true })

  /** Inner horizontal padding: 120px → 20px */
  const navPaddingX = useTransform(scrollY, [0, SCROLL_RANGE], [120, 35], { clamp: true })

  /** Gap between nav links: 32px → 16px (kept for mobile menu spacing) */
  const linkGap = useTransform(scrollY, [0, SCROLL_RANGE], [32, 16], { clamp: true })

  /** Bottom border line opacity: 0 → 0 (hidden always, separator removed) */
  const lineOpacity = useTransform(scrollY, [0, SCROLL_RANGE * 0.5], [0, 0], { clamp: true })

  // ── Glass layer derived values ──────────────────────────────────

  const glassProgress = useTransform(scrollY, [0, SCROLL_RANGE], [0, 1], { clamp: true })

  /** Blur: 0 → 12px */
  const blurPx = useTransform(scrollY, [0, SCROLL_RANGE], [0, 12], { clamp: true })

  /** Saturation boost: 100% → 180% */
  const satPct = useTransform(scrollY, [0, SCROLL_RANGE], [100, 180], { clamp: true })

  /** Border opacity: 0 → 1 */
  const borderAlpha = useTransform(scrollY, [0, SCROLL_RANGE], [0, 1], { clamp: true })

  /** Drop-shadow opacity: 0 → 0.14 */
  const shadowAlpha = useTransform(scrollY, [0, SCROLL_RANGE], [0, 0.14], { clamp: true })

  // ── CSS string transforms ───────────────────────────────────────

  const backdropFilter = useTransform(
    [blurPx, satPct] as MotionValue[],
    ([b, s]: number[]) =>
      b > 0.5 ? `blur(${b.toFixed(1)}px) saturate(${s.toFixed(0)}%)` : 'none',
  )

  const backgroundColor = useTransform(
    glassProgress,
    (v: number) =>
      v < 0.01
        ? 'transparent'
        : `color-mix(in oklab, #ffffff ${(v * 72).toFixed(1)}%, transparent ${(100 - v * 100).toFixed(1)}%)`,
  )

  const borderColor = useTransform(
    borderAlpha,
    (v: number) =>
      `color-mix(in oklab, #e4e4e7 ${(v * 100).toFixed(1)}%, transparent)`,
  )

  const boxShadow = useTransform(
    shadowAlpha,
    (v: number) =>
      v < 0.005
        ? 'none'
        : `0 8px 32px color-mix(in oklab, #000 ${(v * 100).toFixed(1)}%, transparent), 0 2px 8px color-mix(in oklab, #000 ${(v * 50).toFixed(1)}%, transparent)`,
  )

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      style={{ paddingTop: isMobile ? 0 : headerPaddingTop }}
    >
      {/*
       * The nav shrinks in width and gains a pill border-radius.
       * mx-auto centres it as it gets narrower.
       */}
      <motion.nav
        className="relative mx-auto flex h-16 items-center overflow-hidden"
        style={{
          width: isMobile ? '100%' : navWidth,
          borderRadius: isMobile ? 0 : navBorderRadius,
        }}
      >
        {/* ── Glassmorphism backdrop layer ── */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 border"
          style={{
            borderRadius: 'inherit',
            backgroundColor,
            backdropFilter,
            // @ts-ignore
            WebkitBackdropFilter: backdropFilter,
            borderColor,
            boxShadow,
          }}
        />

        {/* ── Bottom rule — fades out as nav floats ── */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-zinc-200"
          style={{ opacity: lineOpacity }}
        />

        {/* ── Inner content with animated padding ── */}
        <motion.div
          className="relative z-10 flex h-16 w-full items-center"
          style={{
            paddingLeft: isMobile ? 24 : navPaddingX,
            paddingRight: isMobile ? 24 : navPaddingX,
          }}
        >
          {/* Left: Logo */}
          <div className="flex flex-1 items-center">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="FlutterInit" width={22} height={22} priority />
            </Link>
          </div>

          {/* Center: Nav links — always at the true mid-point of the symmetric padding */}
          <Highlight
            mode="parent"
            hover={true}
            click={false}
            controlledItems={true}
            className="rounded-full bg-zinc-200/50"
            containerClassName="hidden items-center gap-1 lg:flex"
          >
            {NAV_LINKS.map((link) => (
              <HighlightItem key={link.href} value={link.href} asChild>
                <a
                  href={link.href}
                  className="relative z-10 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors duration-200"
                >
                  {link.label}
                </a>
              </HighlightItem>
            ))}
          </Highlight>

          {/* Right: Actions */}
          <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">

            {githubStars ? (
              githubStars
            ) : (
              <Button variant="outline" className="h-9 px-4 rounded-lg text-xs" asChild>
                <Link
                  href="https://github.com/Arjun544/flutter_init"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Link>
              </Button>
            )}
            <Button
              asChild
              size="sm"
              className="h-9 px-4 rounded-lg text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 transition-colors"
            >
              <Link href="/create">Start Generating →</Link>
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-zinc-200 lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <HugeiconsIcon
              icon={mobileOpen ? Cancel01Icon : Menu04Icon}
              className="size-4 text-zinc-700"
            />
          </button>
        </motion.div>
      </motion.nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: easeOut }}
            className="relative z-10 border-b border-zinc-200 bg-white px-6 py-4 lg:hidden"
          >
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              {githubStars ? (
                <div className="w-full [&>a]:w-full [&>a]:justify-center">
                  {githubStars}
                </div>
              ) : (
                <Button variant="outline" className="w-full rounded-full" asChild>
                  <Link
                    href="https://github.com/Arjun544/flutter_init"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </Link>
                </Button>
              )}
              <Button
                asChild
                className="w-full rounded-xl font-semibold bg-zinc-950 text-white hover:bg-zinc-800"
              >
                <Link href="/create">Start Generating →</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
