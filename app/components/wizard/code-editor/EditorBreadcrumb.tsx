"use client"

import * as React from "react"

import { CopyButton } from "@/components/animate-ui/components/buttons/copy"
import { cn } from "@/lib/utils"

export function EditorBreadcrumb({
  path,
  code,
  canCopy,
}: {
  path: string
  code: string
  canCopy: boolean
}) {
  return (
    <div className="flex h-7 shrink-0 items-center gap-1 bg-background px-2 text-[11px] text-muted-foreground sm:h-6 sm:px-3 sm:text-[12px]">
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {path.split("/").map((segment, index, parts) => (
          <React.Fragment key={`${segment}-${index}`}>
            {index > 0 && <span className="shrink-0 opacity-40">/</span>}
            <span
              className={cn(
                "shrink-0",
                index === parts.length - 1 && "text-foreground"
              )}
            >
              {segment}
            </span>
          </React.Fragment>
        ))}
      </div>
      {canCopy ? (
        <CopyButton
          content={code}
          size="xs"
          variant="ghost"
          aria-label="Copy file contents"
          title="Copy file"
          className="ml-auto size-6 shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground sm:size-5"
        />
      ) : null}
    </div>
  )
}
