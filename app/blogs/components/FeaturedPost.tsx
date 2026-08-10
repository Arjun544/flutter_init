import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Post } from '@/lib/blog/types'
import { BookOpen02Icon, Megaphone01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import Link from 'next/link'
import { AuthorByline } from './AuthorByline'
import { TagPill } from './TagPill'

interface FeaturedPostProps {
  post: Post
  /** Stretch to parent height (e.g. match adjacent stacked cards). */
  fillHeight?: boolean
  /** Hide tags, author, and featured chrome — title + description + CTA only. */
  hideMeta?: boolean
}

export function FeaturedPost({
  post,
  fillHeight = false,
  hideMeta = false,
}: FeaturedPostProps) {
  const href = `/blogs/${post.slug.join('/')}`

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xs hover:border-zinc-300 transition-all duration-400',
        fillHeight && 'h-full',
      )}
    >
      <div
        className={cn(
          'grid grid-cols-1 lg:grid-cols-5',
          fillHeight && 'h-full',
        )}
      >
        {/* Image side — narrower than content */}
        <div
          className={cn(
            'relative overflow-hidden bg-linear-to-br from-zinc-100 to-zinc-50 border-b lg:border-b-0 lg:border-r border-zinc-100 lg:col-span-2',
            fillHeight
              ? 'min-h-48 h-full lg:min-h-0'
              : 'aspect-4/3 lg:aspect-auto',
          )}
        >
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className={cn(
                'flex h-full items-center justify-center',
                !fillHeight && 'min-h-70',
              )}
            >
              <div className="text-center px-8">
                <div
                  className="mx-auto mb-4 size-16 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background:
                      post.kind === 'guide'
                        ? 'linear-gradient(135deg, oklch(0.85 0.12 295), oklch(0.65 0.25 295))'
                        : 'linear-gradient(135deg, oklch(0.95 0.1 80), oklch(0.8 0.18 55))',
                  }}
                >
                  <HugeiconsIcon
                    icon={post.kind === 'guide' ? BookOpen02Icon : Megaphone01Icon}
                    size={32}
                    className="text-white shrink-0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Featured badge */}
          {!hideMeta && post.featured && (
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-zinc-800 border border-zinc-200/80 shadow-sm">
              <span className="size-1.5 rounded-full bg-primary" />
              Featured
            </div>
          )}
        </div>

        {/* Content side */}
        <div className="flex flex-col justify-center p-8 lg:col-span-3 lg:p-10">
          {!hideMeta && (
            <TagPill kind={post.kind} category={post.category} className="mb-4" />
          )}

          <h2
            className={cn(
              'mb-3 font-bold leading-snug tracking-tight text-zinc-900 transition-colors duration-200 group-hover:text-primary',
              hideMeta ? 'text-xl lg:text-2xl' : 'text-2xl lg:text-3xl',
            )}
          >
            {post.title}
          </h2>

          <p
            className={cn(
              'text-[15px] text-zinc-500 leading-relaxed line-clamp-3',
              hideMeta ? 'mb-8' : 'mb-6',
            )}
          >
            {post.description}
          </p>

          {!hideMeta && (
            <div className="mb-6">
              <AuthorByline post={post} />
            </div>
          )}

          <Button
            asChild
            className="w-fit bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl px-5 h-10 text-sm font-semibold transition-colors"
          >
            <Link href={href}>
              Read post →
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
