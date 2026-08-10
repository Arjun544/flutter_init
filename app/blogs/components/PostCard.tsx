'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { TagPill } from './TagPill'
import { AUTHORS } from '@/lib/blog/authors'
import type { Post } from '@/lib/blog/types'
import { HugeiconsIcon } from '@hugeicons/react'
import { BookOpen02Icon, Megaphone01Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface PostCardProps {
  post: Post
  /** Stretch to parent height (e.g. equal split in a stacked column). */
  fillHeight?: boolean
  /** Hide tags, author, and date — title + description only. */
  hideMeta?: boolean
}

export function PostCard({
  post,
  fillHeight = false,
  hideMeta = false,
}: PostCardProps) {
  const author = AUTHORS[post.author] ?? { name: post.author, avatar: '' }
  const href = `/blogs/${post.slug.join('/')}`

  return (
    <motion.article
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs hover:shadow-md hover:border-zinc-300 transition-all duration-400',
        fillHeight && 'h-full',
      )}
    >
      <Link href={href} className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Cover image placeholder */}
        <div
          className={cn(
            'w-full overflow-hidden bg-linear-to-br from-zinc-100 to-zinc-50 border border-zinc-100',
            hideMeta ? 'mb-5' : 'mb-4',
            fillHeight ? 'min-h-28 flex-1' : 'h-42',
          )}
        >
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              width={640}
              height={360}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div
                  className="mx-auto mb-2 size-10 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      post.kind === 'guide'
                        ? 'linear-gradient(135deg, oklch(0.85 0.1 295), oklch(0.7 0.2 295))'
                        : 'linear-gradient(135deg, oklch(0.95 0.08 80), oklch(0.85 0.15 65))',
                  }}
                >
                  <HugeiconsIcon
                    icon={post.kind === 'guide' ? BookOpen02Icon : Megaphone01Icon}
                    size={20}
                    className="text-white shrink-0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {!hideMeta && (
          <TagPill kind={post.kind} category={post.category} className="mb-3 px-5" />
        )}

        <div
          className={cn(
            'w-full min-w-0 shrink-0 px-5',
            hideMeta ? 'pb-8' : 'pb-4',
          )}
        >
          <h3 className="mb-2 line-clamp-2 text-[15px] font-semibold leading-snug text-zinc-900 transition-colors duration-200 group-hover:text-primary">
            {post.title}
          </h3>
          <p
            className="overflow-hidden text-[13px] leading-relaxed text-zinc-500"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {post.description}
          </p>
        </div>
      </Link>

      {!hideMeta && (
        <div className="mt-auto flex items-center gap-2.5 border-t border-zinc-100 px-5 py-3">
          {author.avatar && (
            <div className="relative size-6 shrink-0 overflow-hidden rounded-full ring-1 ring-zinc-200">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
          )}
          <span className="flex-1 truncate text-[12px] font-medium text-zinc-600">
            {author.name}
          </span>
          <time className="shrink-0 text-[11px] text-zinc-400" dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
          <span className="shrink-0 text-[11px] text-zinc-400">
            · {post.readingTime}m
          </span>
        </div>
      )}
    </motion.article>
  )
}
