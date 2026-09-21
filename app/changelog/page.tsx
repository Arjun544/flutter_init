import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import { mdxComponents } from "@/app/blogs/components/MDXComponents"
import cliPackage from "@/cli/package.json"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const metadata: Metadata = {
  title: "Changelog | FlutterInit",
  description:
    "Release notes for FlutterInit — wizard, CLI, and scaffold changes. The version on /create advances with every push to main.",
  alternates: {
    canonical: "https://flutterinit.com/changelog",
  },
  openGraph: {
    title: "Changelog | FlutterInit",
    description:
      "Release notes for FlutterInit — wizard, CLI, and scaffold changes.",
    type: "website",
    url: "https://flutterinit.com/changelog",
  },
}

const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSlug],
}

/** Drop the top H1 so the page owns the title. */
function bodyWithoutTitle(markdown: string): string {
  return markdown.replace(/^#\s+Changelog\s*\r?\n+/, "").trimStart()
}

async function loadChangelog(): Promise<string> {
  const filePath = path.join(process.cwd(), "CHANGELOG.md")
  return readFile(filePath, "utf8")
}

export default async function ChangelogPage() {
  const raw = await loadChangelog()
  const source = bodyWithoutTitle(raw)
  const version = cliPackage.version

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.svg"
              alt="FlutterInit"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="text-sm font-semibold tracking-tight text-zinc-900">
              FlutterInit
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/blogs"
              className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900"
            >
              Blog
            </Link>
            <Link
              href="/create"
              className="rounded-xl bg-zinc-950 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              Generate Project →
            </Link>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8 md:px-8">
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
                <BreadcrumbPage className="font-medium text-zinc-800">
                  Changelog
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Changelog
            </h1>
            <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-zinc-700">
              v{version}
            </span>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-500">
            What changed in FlutterInit for builders. The same version appears on{" "}
            <Link href="/create" className="font-medium text-zinc-800 underline-offset-4 hover:underline">
              /create
            </Link>
            {" "}and advances automatically on every push to{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[13px] text-zinc-700">
              main
            </code>
            .
          </p>
        </header>

        <div className="mb-8 h-px bg-zinc-100" />

        <article className="prose-custom">
          <MDXRemote
            source={source}
            components={mdxComponents}
            options={{ mdxOptions }}
          />
        </article>
      </div>
    </div>
  )
}
