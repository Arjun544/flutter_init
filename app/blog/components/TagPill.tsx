import { cn } from '@/lib/utils'
import type { Kind } from '@/lib/blog/types'

const KIND_STYLES: Record<Kind, { label: string; className: string }> = {
  update: {
    label: 'Update',
    className:
      'bg-amber-50 text-amber-700 border border-amber-200/80 ring-1 ring-amber-100',
  },
  guide: {
    label: 'Guide',
    className:
      'bg-violet-50 text-violet-700 border border-violet-200/80 ring-1 ring-violet-100',
  },
}

interface TagPillProps {
  kind?: Kind
  category?: string
  tags?: string[]
  className?: string
}

export function TagPill({ kind, category, tags, className }: TagPillProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {kind && (
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider',
            KIND_STYLES[kind].className
          )}
        >
          {KIND_STYLES[kind].label}
        </span>
      )}
      {category && (
        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 border border-zinc-200/80">
          {category.replace(/-/g, ' ')}
        </span>
      )}
      {tags?.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-500 border border-zinc-200/60"
        >
          #{tag}
        </span>
      ))}
    </div>
  )
}
