'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'

export interface TocItem {
  id: string
  text: string
  depth: number
}

interface TableOfContentsProps {
  items: TocItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  // ── Build child → parent map ──────────────────────────────────────────────
  const parentMap = useMemo(() => {
    const map = new Map<string, string>()
    let lastDepth2: string | null = null
    for (const item of items) {
      if (item.depth === 2) lastDepth2 = item.id
      else if (item.depth === 3 && lastDepth2) map.set(item.id, lastDepth2)
    }
    return map
  }, [items])

  const activeParentId = parentMap.get(activeId)

  // ── IntersectionObserver — highlights at 10% visibility ───────────────────
  useEffect(() => {
    if (items.length === 0) return

    const article = document.querySelector('article')
    if (!article) return

    // Discover real DOM headings (bypasses slug-mismatch issues)
    const domHeadings = Array.from(
      article.querySelectorAll('h2[id], h3[id]')
    ) as HTMLElement[]

    // Map each TocItem → its real DOM element
    const tocToEl = new Map<string, HTMLElement>()
    for (const item of items) {
      const byId = document.getElementById(item.id)
      if (byId) { tocToEl.set(item.id, byId); continue }
      const tag = item.depth === 2 ? 'H2' : 'H3'
      const byText = domHeadings.find(
        (el) => el.tagName === tag && el.textContent?.trim() === item.text
      )
      if (byText) tocToEl.set(item.id, byText)
    }

    if (tocToEl.size === 0) return

    // Reverse map: real DOM id → TocItem id
    const domToToc = new Map<string, string>()
    for (const [tocId, el] of tocToEl) domToToc.set(el.id, tocId)

    // Track each heading's position relative to viewport
    type Position = 'above' | 'visible' | 'below'
    const states = new Map<string, Position>()

    const resolve = () => {
      // Prefer the topmost *visible* heading
      for (const item of items) {
        if (states.get(item.id) === 'visible') {
          setActiveId(item.id)
          return
        }
      }
      // Fall back to the last heading that scrolled above (we're inside that section)
      let lastAbove = ''
      for (const item of items) {
        if (states.get(item.id) === 'above') lastAbove = item.id
      }
      if (lastAbove) setActiveId(lastAbove)
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const tocId = domToToc.get((entry.target as HTMLElement).id)
          if (!tocId) return
          if (entry.isIntersecting) {
            states.set(tocId, 'visible')
          } else if (entry.boundingClientRect.top < 0) {
            states.set(tocId, 'above')
          } else {
            states.set(tocId, 'below')
          }
        })
        resolve()
      },
      { threshold: 0.1 } // trigger as soon as 10% of the heading is visible
    )

    for (const el of tocToEl.values()) observerRef.current.observe(el)

    // Seed on mount from hash or initial scroll position
    const hash = window.location.hash.slice(1)
    const seeded = domToToc.get(hash) ?? items.find(i => i.id === hash)?.id
    if (seeded) setActiveId(seeded)
    else {
      // Run resolve once after a tick so BoundingClientRects are settled
      requestAnimationFrame(resolve)
    }

    return () => observerRef.current?.disconnect()
  }, [items])

  // ── Hash change (back/forward) ────────────────────────────────────────────
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (items.some((i) => i.id === hash)) setActiveId(hash)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [items])

  if (items.length === 0) return null

  return (
    <nav aria-label="On this page" className="w-56 shrink-0">
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mb-3 font-mono text-[0.68rem] uppercase tracking-widest text-zinc-400"
      >
        On this page
      </motion.p>

      <ul className="flex flex-col border-l border-zinc-200">
        {items.map((item, i) => {
          const isActive = activeId === item.id
          const isAncestorActive = !isActive && item.id === activeParentId

          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22, delay: i * 0.04, ease: 'easeOut' }}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  const article = document.querySelector('article')
                  const tag = item.depth === 2 ? 'h2' : 'h3'
                  const el =
                    document.getElementById(item.id) ??
                    (Array.from(article?.querySelectorAll(`${tag}[id]`) ?? []).find(
                      (h) => (h as HTMLElement).textContent?.trim() === item.text
                    ) as HTMLElement | undefined)
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    setActiveId(item.id)
                    window.history.pushState(null, '', `#${el.id}`)
                  }
                }}
                className={[
                  'relative flex py-1.5 text-[0.78rem] leading-snug',
                  item.depth === 3 ? 'pl-6' : 'pl-3',
                ].join(' ')}
              >
                {/* Active bar — slides via layoutId */}
                {isActive && (
                  <motion.span
                    layoutId="toc-active-bar"
                    aria-hidden="true"
                    className="absolute -left-px top-1.5 bottom-1.5 w-0.5 rounded-full bg-zinc-900"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}

                {/* Ancestor bar — fades when parent ## of active ### */}
                <motion.span
                  aria-hidden="true"
                  className="absolute -left-px top-1.5 bottom-1.5 w-0.5 rounded-full bg-zinc-400"
                  animate={{
                    opacity: isAncestorActive ? 1 : 0,
                    scaleY: isAncestorActive ? 1 : 0.4,
                  }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />

                {/* Text */}
                <motion.span
                  className="truncate"
                  animate={{
                    color: isActive
                      ? '#18181b'
                      : isAncestorActive
                        ? '#3f3f46'
                        : '#a1a1aa',
                    fontWeight: isActive || isAncestorActive ? 500 : 400,
                  }}
                  whileHover={{ color: isActive || isAncestorActive ? '#18181b' : '#52525b' }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  {item.text}
                </motion.span>
              </a>
            </motion.li>
          )
        })}
      </ul>
    </nav>
  )
}
