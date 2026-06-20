import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/blog/getAllPosts'
import { FeaturedPost } from './components/FeaturedPost'
import { PostCard } from './components/PostCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog | FlutterInit',
  description:
    'Updates, guides, and deep-dives on Flutter architecture, state management, and backend integrations — from the creator of FlutterInit.',
  openGraph: {
    title: 'Blog | FlutterInit',
    description:
      'Updates, guides, and deep-dives on Flutter architecture, state management, and backend integrations.',
    type: 'website',
  },
}

const POSTS_PER_PAGE = 24

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const allPosts = await getAllPosts()

  const featured = allPosts[0]
  const rest = allPosts.slice(1)

  const totalPages = Math.ceil(rest.length / POSTS_PER_PAGE)
  const pagePosts = rest.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)

  return (
    <main className="min-h-screen bg-white">
      {/* ── Header ── */}
      <div className="border-b border-zinc-200 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 md:px-12">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image src="/logo.svg" alt="FlutterInit" width={24} height={24} />
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/create"
                className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
              >
                Generate Project →
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        {/* ── Page title ── */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Blog
          </h1>
          <p className="mt-2 text-[15px] text-zinc-500">
            Updates, guides, and deep-dives on Flutter development.
          </p>
        </div>

        {/* ── Featured post ── */}
        {featured && (
          <div className="mb-12">
            <FeaturedPost post={featured} />
          </div>
        )}

        {/* ── Grid ── */}
        {pagePosts.length > 0 && (
          <>
            <h2 className="mb-6 text-lg font-semibold text-zinc-900">
              {page === 1 ? 'All posts' : `Page ${page}`}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pagePosts.map((post) => (
                <PostCard key={post.slug.join('/')} post={post} />
              ))}
            </div>
          </>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}`}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-all"
              >
                ← Previous
              </Link>
            )}
            <span className="text-sm text-zinc-500">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/blog?page=${page + 1}`}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-all"
              >
                Next →
              </Link>
            )}
          </div>
        )}

        {/* ── Empty state ── */}
        {allPosts.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-zinc-400">No posts yet — check back soon.</p>
          </div>
        )}
      </div>
    </main>
  )
}
