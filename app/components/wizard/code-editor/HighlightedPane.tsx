"use client"

import * as React from "react"

import {
  highlightCode,
  langFromPath,
} from "@/app/components/wizard/code-editor/highlightCode"
import { cn } from "@/lib/utils"

export function HighlightedPane({
  code,
  filePath,
  theme,
}: {
  code: string
  filePath: string
  theme: string
}) {
  const [html, setHtml] = React.useState("")
  const [pending, setPending] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    setPending(true)
    const lang = langFromPath(filePath)
    void highlightCode(code, lang, theme).then((result) => {
      if (!cancelled) {
        setHtml(result)
        setPending(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [code, filePath, theme])

  if (pending && !html) {
    return (
      <div className="flex h-full flex-col gap-2 p-4" aria-busy="true">
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-2/5 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "h-full overflow-auto overscroll-contain bg-background text-foreground text-[12px] leading-normal sm:text-[13px]",
        "[&_pre]:m-0 [&_pre]:min-h-full [&_pre]:min-w-full [&_pre]:bg-transparent! [&_pre]:px-3 [&_pre]:py-3 [&_pre]:text-foreground! sm:[&_pre]:px-4",
        "[&_code]:font-mono [&_code]:text-[12px] sm:[&_code]:text-[13px]"
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
