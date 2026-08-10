import { Code, CodeBlock, CodeHeader } from '@/components/animate-ui/components/animate/code'
import {
  Files,
  FolderItem,
  FolderTrigger,
  FolderContent,
  FileItem,
  SubFiles,
} from '@/components/animate-ui/components/radix/files'
import { Link as LinkIcon } from 'lucide-react'
import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import React from 'react'
import { codeToHtml } from 'shiki'

// ── Extract text from code block ─────────────────────────────────────────────

function extractCodeText(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (React.isValidElement(children)) {
    return extractCodeText((children.props as { children?: React.ReactNode }).children)
  }
  if (Array.isArray(children)) {
    return children.map(extractCodeText).join('')
  }
  return ''
}

// ── Extract filename from first comment line of code block ───────────────────

function extractFilename(code: string): { title: string; cleanCode: string } | null {
  const lines = code.split('\n')
  if (lines.length === 0) return null

  const firstLine = lines[0].trim()
  // Matches "// path/to/file.dart" or "# pubspec.yaml"
  const commentMatch = firstLine.match(/^(?:\/\/\s*|#\s*)([\w\-\.\/]+\.[\w]+)$/)
  if (commentMatch) {
    const title = commentMatch[1]
    const cleanCode = lines.slice(1).join('\n')
    return { title, cleanCode }
  }
  return null
}

// ── Callout parsing for > [!NOTE] / [!TIP] / [!WARNING] / [!CAUTION] ───────

const CALLOUT_TYPES = {
  NOTE: { icon: 'ℹ️', className: 'border-blue-200 bg-blue-50 text-blue-900' },
  TIP: { icon: '💡', className: 'border-emerald-200 bg-emerald-50 text-emerald-900' },
  WARNING: { icon: '⚠️', className: 'border-amber-200 bg-amber-50 text-amber-900' },
  CAUTION: { icon: '🚨', className: 'border-red-200 bg-red-50 text-red-900' },
  IMPORTANT: { icon: '📌', className: 'border-violet-200 bg-violet-50 text-violet-900' },
} as const

// ── Heading with anchor link ──────────────────────────────────────────────────

function HeadingAnchor({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <a href={`#${id}`} className="group/anchor ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <LinkIcon size={14} className="inline text-zinc-400" />
    </a>
  )
}

// ── The MDX component map ────────────────────────────────────────────────────

export const mdxComponents: MDXComponents = {
  Code,
  CodeHeader,
  CodeBlock,
  // ── File tree ─────────────────────────────────────────────────────────────
  Files,
  FolderItem,
  FolderTrigger,
  FolderContent,
  FileItem,
  SubFiles,
  // ── Code blocks ──────────────────────────────────────────────────────────
  pre: async ({ children, ...props }) => {
    const rawCode = extractCodeText(children)

    // Extract language from code element className (if present)
    let lang = 'text'
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props && (child.props as any).className) {
        const className = (child.props as any).className as string
        const match = className.match(/language-(\w+)/)
        if (match) {
          lang = match[1]
        }
      }
    })

    // Try to get title from meta or from first comment line
    let displayTitle = lang.toUpperCase()
    let code = rawCode

    const fileInfo = extractFilename(rawCode)
    if (fileInfo) {
      displayTitle = fileInfo.title
      code = fileInfo.cleanCode
    }

    // Highlight code on the server using Shiki
    let highlightedHtml = ''
    try {
      highlightedHtml = await codeToHtml(code, {
        lang,
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
        defaultColor: 'light',
      })
    } catch (e) {
      console.error(`Failed to highlight language ${lang} on server:`, e)
    }

    return (
      <div className="my-5">
        <Code code={code} className="border-zinc-200 dark:border-zinc-800 bg-white">
          <CodeHeader copyButton className="bg-zinc-100 border-zinc-200  text-zinc-500 ">
            <span className="font-mono text-xs font-semibold">{displayTitle}</span>
          </CodeHeader>
          <CodeBlock lang={lang} highlightedHtml={highlightedHtml} className="text-zinc-800 dark:text-zinc-200" />
        </Code>
      </div>
    )
  },

  code: ({ children, className, ...props }) => {
    // Inline code (no language class)
    if (!className) {
      return (
        <code
          className="rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[13px] text-zinc-800"
          {...props}
        >
          {children}
        </code>
      )
    }
    // Fenced code block — pass through (rehype-pretty-code adds the styling)
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },

  // ── Blockquote / Callout ──────────────────────────────────────────────────
  blockquote: ({ children }) => {
    const text = extractCodeText(children)
    const match = text.match(/^\[!(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]/)
    if (match) {
      const type = match[1] as keyof typeof CALLOUT_TYPES
      const { icon, className } = CALLOUT_TYPES[type]
      return (
        <div className={`my-5 flex gap-3 rounded-xl border px-4 py-3.5 ${className}`}>
          <span className="mt-0.5 text-lg leading-none">{icon}</span>
          <div className="flex-1 text-[14px] leading-relaxed [&>p]:m-0">
            {children}
          </div>
        </div>
      )
    }
    return (
      <blockquote className="my-5 border-l-4 border-zinc-300 pl-4 italic text-zinc-600">
        {children}
      </blockquote>
    )
  },

  // ── Headings ──────────────────────────────────────────────────────────────
  h2: ({ children, id, ...props }) => (
    <h2
      id={id}
      className="group mt-10 mb-4 border-b border-zinc-100 pb-2 text-xl font-bold text-zinc-900 scroll-mt-24"
      {...props}
    >
      {children}
      {id && <HeadingAnchor id={id}>{children}</HeadingAnchor>}
    </h2>
  ),

  h3: ({ children, id, ...props }) => (
    <h3
      id={id}
      className="group mt-7 mb-3 text-[17px] font-semibold text-zinc-900 scroll-mt-24"
      {...props}
    >
      {children}
      {id && <HeadingAnchor id={id}>{children}</HeadingAnchor>}
    </h3>
  ),

  h4: ({ children, id, ...props }) => (
    <h4
      id={id}
      className="group mt-5 mb-2 text-[15px] font-semibold text-zinc-800 scroll-mt-24"
      {...props}
    >
      {children}
    </h4>
  ),

  // ── Paragraphs ────────────────────────────────────────────────────────────
  p: ({ children }) => (
    <p className="my-4 text-[15px] leading-relaxed text-zinc-600">{children}</p>
  ),

  // ── Lists ─────────────────────────────────────────────────────────────────
  ul: ({ children }) => (
    <ul className="my-4 space-y-1.5 pl-5 text-[15px] text-zinc-600 [&>li]:relative [&>li]:pl-1 [&>li]:before:absolute [&>li]:before:-left-4 [&>li]:before:content-['–'] [&>li]:before:text-zinc-400">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="my-4 list-decimal space-y-1.5 pl-5 text-[15px] text-zinc-600">
      {children}
    </ol>
  ),

  // ── Image ─────────────────────────────────────────────────────────────────
  img: ({ src, alt }) => {
    if (!src) return null
    return (
      <span className="my-6 block overflow-hidden rounded-2xl border border-zinc-200">
        <Image
          src={src}
          alt={alt ?? ''}
          width={800}
          height={450}
          className="w-full object-cover"
        />
      </span>
    )
  },

  // ── Horizontal rule ───────────────────────────────────────────────────────
  hr: () => <hr className="my-8 border-zinc-200" />,

  // ── Links ─────────────────────────────────────────────────────────────────
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),

  // ── Tables ────────────────────────────────────────────────────────────────
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-zinc-200">
      <table className="min-w-full text-[13px]">{children}</table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-zinc-50 border-b border-zinc-200">{children}</thead>
  ),

  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-[12px] font-semibold text-zinc-700 uppercase tracking-wide">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="px-4 py-3 text-zinc-600 border-t border-zinc-100">{children}</td>
  ),
}
