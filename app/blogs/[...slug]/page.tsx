import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { Suspense } from 'react'
import { getAllPosts } from '@/lib/blog/getAllPosts'
import { getPostBySlug } from '@/lib/blog/getPostBySlug'
import { getRelatedPosts } from '@/lib/blog/getRelatedPosts'
import { mdxComponents } from '@/app/blogs/components/MDXComponents'
import { AuthorByline } from '@/app/blogs/components/AuthorByline'
import { TagPill } from '@/app/blogs/components/TagPill'
import { GuideConfigBlock } from '@/app/blogs/components/GuideConfigBlock'
import { RelatedPosts } from '@/app/blogs/components/RelatedPosts'
import { TableOfContents, type TocItem } from '@/app/blogs/components/TableOfContents'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { AUTHORS } from '@/lib/blog/authors'

// ── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const ogParams = new URLSearchParams({
    title: post.title,
    kind: post.kind,
    category: post.category,
  })
  const canonicalPath = `/blogs/${post.slug.join('/')}`

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: canonicalPath,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [`/api/og?${ogParams.toString()}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

// ── MDX options ───────────────────────────────────────────────────────────────

const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSlug],
}

// ── ToC helpers ──────────────────────────────────────────────────────────────

/** Extract ## and ### headings from raw MDX content */
function extractTocItems(content: string): TocItem[] {
  const items: TocItem[] = []
  // Match lines like: ## Some Heading  or  ### Sub heading
  const re = /^(#{2,3})\s+(.+)$/gm
  let match: RegExpExecArray | null
  while ((match = re.exec(content)) !== null) {
    const depth = match[1].length // 2 or 3
    const text = match[2].trim()
    // Mimic rehype-slug (github-slugger): lowercase, strip punctuation,
    // replace whitespace with hyphens — underscores are preserved as-is.
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // strip punctuation but keep _ (word char)
      .trim()
      .replace(/\s+/g, '-')    // spaces → hyphens; underscores untouched
    items.push({ id, text, depth })
  }
  return items
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <BlogPostContent params={params} />
    </Suspense>
  )
}

function BlogPostSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8 md:px-8">
        <div className="h-5 w-24 animate-pulse rounded bg-zinc-100" />
        <div className="mt-12 h-12 max-w-3xl animate-pulse rounded bg-zinc-100" />
        <div className="mt-6 h-5 max-w-2xl animate-pulse rounded bg-zinc-100" />
      </div>
    </main>
  )
}

async function BlogPostContent({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const allPosts = await getAllPosts()
  const related = getRelatedPosts(post, allPosts)

  const isGuide = post.kind === 'guide'
  const tocItems = extractTocItems(post.content)
  const author = AUTHORS[post.author]
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://flutterinit.com'
  const postUrl = `${siteUrl}/blogs/${post.slug.join('/')}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    url: postUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    author: author
      ? {
          '@type': 'Person',
          name: author.name,
          ...(author.github
            ? { url: `https://github.com/${author.github}` }
            : {}),
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'FlutterInit',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.svg`,
      },
    },
    articleSection: post.category,
    keywords: post.tags.join(', '),
  }

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Top nav ── */}
      <div className="border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image src="/logo.svg" alt="FlutterInit" width={24} height={24} />
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                href="/blogs"
                className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/create"
                className="rounded-xl bg-zinc-950 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
              >
                Generate Project →
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* ── Content + ToC grid ── */}
      <div className="mx-auto max-w-6xl px-6 py-8 md:px-8">
        <div className="flex gap-12 xl:gap-16">

          {/* ── Main column ── */}
          <article className="min-w-0 flex-1">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/blogs">Blog</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-zinc-800 font-medium truncate max-w-50 sm:max-w-xs">
                      {post.title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Header */}
            <header className="mb-10">

              <h1 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl leading-snug">
                {post.title}
              </h1>
              <TagPill kind={post.kind} category={post.category} tags={post.tags} className="mb-4" />

              <p className="mb-6 text-lg text-zinc-500 leading-relaxed">
                {post.description}
              </p>

              <AuthorByline post={post} />
            </header>

            {/* Guide-specific: stack config block */}
            {isGuide && post.stackConfig && (
              <GuideConfigBlock stackConfig={post.stackConfig} />
            )}

            {/* Guide-specific: when to choose */}
            {isGuide && post.whenToChoose && (
              <div className="my-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 px-5 py-4">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                  When to choose this stack
                </p>
                <p className="text-[14px] text-emerald-900 leading-relaxed">
                  {post.whenToChoose}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="my-8 h-px bg-zinc-100" />

            {/* MDX body */}
            <div className="prose-custom">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{ mdxOptions }}
              />
            </div>

            {/* Guide CTA */}
            {isGuide && (
              <div className="mt-12 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100/50 px-8 py-8 text-center hover:border-zinc-300 transition-all duration-400">
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-widest text-zinc-600">
                  Ready to build?
                </p>
                <h2 className="mb-3 text-2xl font-bold text-zinc-900">
                  Generate this project in seconds
                </h2>
                <p className="mb-6 text-[14px] text-zinc-400 max-w-md mx-auto">
                  FlutterInit scaffolds the entire structure described in this guide — wired up,
                  typed, and ready for{' '}
                  <code className="rounded bg-zinc-300 px-1.5 py-0.5 text-[12px] text-zinc-700">
                    flutter run
                  </code>
                  .
                </p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-colors"
                >
                  Start Generating →
                </Link>
              </div>
            )}
          </article>

          {/* ── ToC sidebar ── */}
          {tocItems.length > 0 && (
            <aside className="hidden xl:block">
              <div className="sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto py-2">
                <TableOfContents items={tocItems} />
              </div>
            </aside>
          )}

        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="mx-auto max-w-6xl px-6 pb-16 md:px-8">
          <RelatedPosts posts={related} />
        </div>
      )}
    </main>
  )
}
