import Image from 'next/image'
import { AUTHORS } from '@/lib/blog/authors'
import type { Post } from '@/lib/blog/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

interface AuthorBylineProps {
  post: Pick<Post, 'author' | 'publishedAt' | 'readingTime' | 'updatedAt'>
}

export function AuthorByline({ post }: AuthorBylineProps) {
  const author = AUTHORS[post.author] ?? {
    name: post.author,
    avatar: `https://avatars.githubusercontent.com/u/0?v=4`,
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative size-9 shrink-0 overflow-hidden rounded-full ring-2 ring-zinc-100">
        <Image
          src={author.avatar}
          alt={author.name}
          fill
          className="object-cover"
          sizes="36px"
        />
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-900 leading-none">
            {author.name}
          </span>
          {author.twitter && (
            <a
              href={`https://x.com/${author.twitter.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors leading-none"
            >
              {author.twitter}
            </a>
          )}
        </div>
        <div className="flex items-center gap-2 text-[12px] text-zinc-500 leading-none">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
          {post.updatedAt && (
            <>
              <span aria-hidden>·</span>
              <span className="text-zinc-400">
                Updated {formatDate(post.updatedAt)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
