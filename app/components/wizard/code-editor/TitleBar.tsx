"use client"

import Link from "next/link"
import { ArrowLeft01Icon, SidebarLeftIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { SyncStatus } from "@/app/components/wizard/code-editor/SyncStatus"
import { ThemePicker } from "@/app/components/wizard/code-editor/ThemePicker"
import type { ShikiThemeId } from "@/app/components/wizard/code-editor/highlightCode"
import { Button } from "@/components/ui/button"

export function TitleBar({
  isMobile,
  projectName,
  theme,
  onThemeChange,
  syncing,
  onOpenExplorer,
}: {
  isMobile: boolean
  projectName: string
  theme: ShikiThemeId
  onThemeChange: (value: ShikiThemeId) => void
  syncing: boolean
  onOpenExplorer: () => void
}) {
  return (
    <>
      <header className="flex h-11 shrink-0 items-center gap-1 border-b border-border bg-muted/40 px-1.5 sm:h-10 sm:gap-2 sm:px-2">
        <div className="flex min-w-0 shrink-0 items-center gap-0.5 sm:gap-1">
          {isMobile ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-8 rounded-md text-foreground/80 hover:bg-muted hover:text-foreground"
              onClick={onOpenExplorer}
              aria-label="Open file explorer"
            >
              <HugeiconsIcon icon={SidebarLeftIcon} className="size-4" />
            </Button>
          ) : null}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 rounded-md px-2 text-xs font-medium text-foreground/80 hover:bg-muted hover:text-foreground sm:h-7 sm:px-2.5"
          >
            <Link href="/create">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
              <span className="sm:hidden">Back</span>
              <span className="hidden sm:inline">Wizard</span>
            </Link>
          </Button>
        </div>
        <div className="mx-auto flex min-w-0 flex-1 items-center justify-center gap-2 px-1">
          <span className="truncate text-xs font-semibold text-foreground">
            {projectName}
          </span>
          <span className="hidden text-xs text-muted-foreground md:inline">
            Preview
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <ThemePicker value={theme} onChange={onThemeChange} />
          <SyncStatus syncing={syncing} />
        </div>
      </header>
      {syncing ? (
        <div
          className="h-0.5 w-full shrink-0 overflow-hidden bg-muted"
          role="progressbar"
          aria-label="Syncing generated code"
        >
          <div className="h-full w-full animate-pulse bg-primary" />
        </div>
      ) : (
        <div
          className="h-0.5 w-full shrink-0 bg-transparent"
          aria-hidden="true"
        />
      )}
    </>
  )
}
