import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/blog/getAllPosts'
import { FeaturedPost } from './components/FeaturedPost'
import { PostCard } from './components/PostCard'
import { BlogFilters } from './components/BlogFilters'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Blogs | FlutterInit',
  description:
    'Updates, guides, and deep-dives on Flutter architecture, state management, and backend integrations — from the creator of FlutterInit.',
  alternates: {
    canonical: 'https://flutterinit.com/blogs',
  },
  openGraph: {
    title: 'Blogs | FlutterInit',
    description:
      'Updates, guides, and deep-dives on Flutter architecture, state management, and backend integrations.',
    type: 'website',
  },
}

const POSTS_PER_PAGE = 24

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    kind?: string
    category?: string
    year?: string
    month?: string
    sort?: string
  }>
}) {
  return (
    <Suspense fallback={<BlogPageSkeleton />}>
      <BlogPageContent searchParams={searchParams} />
    </Suspense>
  )
}

function BlogPageSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        <div className="h-10 w-32 animate-pulse rounded bg-zinc-100" />
        <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-zinc-100" />
        <div className="mt-10 h-12 w-full animate-pulse rounded-xl bg-zinc-100" />
      </div>
    </main>
  )
}

async function BlogPageContent({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    kind?: string
    category?: string
    year?: string
    month?: string
    sort?: string
  }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const selectedKind = params.kind ?? 'all'
  const selectedCategory = params.category ?? 'all'
  const selectedYear = params.year ?? 'all'
  const selectedMonth = params.month ?? 'all'
  const selectedSort = params.sort ?? 'desc'

  const allPosts = await getAllPosts()

  // 1. Featured post: must be featured: true, and have the latest date overall
  const featured = allPosts
    .filter((post) => post.featured)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0]

  const showFeatured =
    page === 1 &&
    selectedKind === 'all' &&
    selectedCategory === 'all' &&
    selectedYear === 'all' &&
    selectedMonth === 'all'

  // 2. Remaining posts: if featured post is shown as hero, exclude it from grid
  let rest = (showFeatured && featured)
    ? allPosts.filter((post) => post.slug.join('/') !== featured.slug.join('/'))
    : allPosts

  // Extract all available years and categories from the full list of remaining posts
  const categories = Array.from(
    new Set(allPosts.filter(post => post !== featured).map((post) => post.category))
  ).sort()

  const years = Array.from(
    new Set(allPosts.filter(post => post !== featured).map((post) => new Date(post.publishedAt).getFullYear().toString()))
  ).sort((a, b) => b.localeCompare(a))

  // Apply filters to rest
  if (selectedKind !== 'all') {
    rest = rest.filter((post) => post.kind === selectedKind)
  }

  if (selectedCategory !== 'all') {
    rest = rest.filter((post) => post.category === selectedCategory)
  }

  if (selectedYear !== 'all') {
    rest = rest.filter(
      (post) => new Date(post.publishedAt).getFullYear().toString() === selectedYear
    )
  }

  if (selectedMonth !== 'all') {
    rest = rest.filter((post) => {
      const date = new Date(post.publishedAt)
      const monthStr = (date.getMonth() + 1).toString().padStart(2, '0') // "01"-"12"
      return monthStr === selectedMonth
    })
  }

  // Sort by date (month and year)
  rest.sort((a, b) => {
    const timeA = new Date(a.publishedAt).getTime()
    const timeB = new Date(b.publishedAt).getTime()
    return selectedSort === 'asc' ? timeA - timeB : timeB - timeA
  })

  const totalPages = Math.ceil(rest.length / POSTS_PER_PAGE)
  const pagePosts = rest.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)

  const hasActiveFilters =
    selectedKind !== 'all' ||
    selectedCategory !== 'all' ||
    selectedYear !== 'all' ||
    selectedMonth !== 'all' ||
    selectedSort !== 'desc'

  const buildPageUrl = (targetPage: number) => {
    const p = new URLSearchParams()
    p.set('page', targetPage.toString())
    if (selectedKind !== 'all') p.set('kind', selectedKind)
    if (selectedCategory !== 'all') p.set('category', selectedCategory)
    if (selectedYear !== 'all') p.set('year', selectedYear)
    if (selectedMonth !== 'all') p.set('month', selectedMonth)
    if (selectedSort !== 'desc') p.set('sort', selectedSort)
    return `/blogs?${p.toString()}`
  }

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)

      if (start > 2) {
        pages.push('ellipsis')
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages - 1) {
        pages.push('ellipsis')
      }

      pages.push(totalPages)
    }
    return pages
  }

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Blogs
          </h1>
          <p className="mt-2 text-[15px] text-zinc-500">
            Updates, guides, and deep-dives on Flutter development.
          </p>
        </div>

        {/* ── Filter Bar ── */}
        <BlogFilters
          categories={categories}
          years={years}
          currentFilters={{
            kind: selectedKind,
            category: selectedCategory,
            year: selectedYear,
            month: selectedMonth,
            sort: selectedSort,
          }}
        />

        {/* ── Featured post ── */}
        {showFeatured && featured && (
          <div className="mb-12">
            <FeaturedPost post={featured} />
          </div>
        )}

        {/* ── Grid ── */}
        {pagePosts.length > 0 ? (
          <>
            <h2 className="mb-6 text-lg font-semibold text-zinc-900">
              {hasActiveFilters ? 'Filtered posts' : (page === 1 ? 'All posts' : `Page ${page}`)}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pagePosts.map((post) => (
                <PostCard key={post.slug.join('/')} post={post} />
              ))}
            </div>
          </>
        ) : (
          allPosts.length > 0 && (
            <div className="py-24 text-center">
              <p className="text-zinc-400">No posts matched your filter criteria — try clearing filters.</p>
            </div>
          )
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious href={buildPageUrl(page - 1)} />
                  </PaginationItem>
                )}

                {getPageNumbers().map((p, idx) => (
                  <PaginationItem key={idx}>
                    {p === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href={buildPageUrl(p)}
                        isActive={p === page}
                      >
                        {p}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                {page < totalPages && (
                  <PaginationItem>
                    <PaginationNext href={buildPageUrl(page + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
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
