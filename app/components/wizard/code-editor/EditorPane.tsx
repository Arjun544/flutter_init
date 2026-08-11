"use client"

import { File01Icon, SidebarLeftIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { HighlightedPane } from "@/app/components/wizard/code-editor/HighlightedPane"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EditorPane({
  loading,
  error,
  activePath,
  code,
  theme,
  canPreview,
  isMobile,
  onBrowseFiles,
}: {
  loading: boolean
  error: string | null
  activePath: string | null
  code: string
  theme: string
  canPreview: boolean
  isMobile: boolean
  onBrowseFiles: () => void
}) {
  return (
    <div className="min-h-0 min-w-0 flex-1 bg-background">
      {loading ? (
        <div className="flex h-full flex-col gap-2 p-4" aria-busy="true">
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
        </div>
      ) : error ? (
        <div className="flex h-full items-center justify-center p-6 text-center text-sm text-destructive">
          {error}
        </div>
      ) : !activePath ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted-foreground">
          <HugeiconsIcon icon={File01Icon} className="size-8 opacity-40" />
          <p>
            {isMobile
              ? "Open the explorer to pick a file."
              : "Open a file from the explorer to start."}
          </p>
          {isMobile ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={onBrowseFiles}
            >
              <HugeiconsIcon icon={SidebarLeftIcon} className="size-3.5" />
              Browse files
            </Button>
          ) : null}
        </div>
      ) : !canPreview ? (
        <Empty className="h-full border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={File01Icon} />
            </EmptyMedia>
            <EmptyTitle>No preview available</EmptyTitle>
            <EmptyDescription>
              This file type can&apos;t be previewed in the editor.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <HighlightedPane code={code} filePath={activePath} theme={theme} />
      )}
    </div>
  )
}
