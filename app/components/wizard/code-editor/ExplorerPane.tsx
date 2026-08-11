"use client"

import { FolderMinusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { FileTreeNode } from "@/app/components/wizard/code-editor/buildFileTree"
import { FileTreeView } from "@/app/components/wizard/code-editor/FileTreeView"
import { Files } from "@/components/animate-ui/components/radix/files"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ExplorerPane({
  projectName,
  loading,
  error,
  tree,
  treeKey,
  openFolders,
  setOpenFolders,
  activePath,
  onSelect,
  onCollapseAll,
  inSheet = false,
}: {
  projectName: string
  loading: boolean
  error: string | null
  tree: FileTreeNode[]
  treeKey: number
  openFolders: string[]
  setOpenFolders: (value: string[]) => void
  activePath: string | null
  onSelect: (path: string) => void
  onCollapseAll: () => void
  inSheet?: boolean
}) {
  return (
    <div
      className={cn(
        "group/explorer flex h-full flex-col overflow-hidden bg-muted/25",
        inSheet ? "pt-12" : "pt-3"
      )}
    >
      <div
        className={cn(
          "mb-1 flex items-center gap-1 px-3 pb-1",
          inSheet && "pr-2"
        )}
      >
        <div className="min-w-0 flex-1 truncate text-[12px] font-semibold text-muted-foreground">
          {projectName.toUpperCase()}
        </div>
        <div className="flex shrink-0 items-center opacity-100 transition-opacity duration-150 md:opacity-0 md:group-hover/explorer:opacity-100 md:focus-within:opacity-100">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-sm text-muted-foreground hover:text-foreground md:size-6 cursor-pointer"
            onClick={onCollapseAll}
            aria-label="Collapse all folders"
            title="Collapse all"
          >
            <HugeiconsIcon icon={FolderMinusIcon} className="size-3.5" />
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        {loading ? (
          <div className="flex flex-col gap-1.5 px-3 py-2" aria-busy="true">
            <div className="h-6 animate-pulse rounded-sm bg-muted" />
            <div className="h-6 animate-pulse rounded-sm bg-muted" />
            <div className="ml-3 h-6 animate-pulse rounded-sm bg-muted" />
            <div className="ml-3 h-6 animate-pulse rounded-sm bg-muted" />
          </div>
        ) : error ? (
          <div className="px-3 py-2 text-xs text-destructive">{error}</div>
        ) : tree.length === 0 ? (
          <div className="px-3 py-2 text-xs text-muted-foreground">
            No files generated.
          </div>
        ) : (
          <Files
            key={treeKey}
            open={openFolders}
            onOpenChange={setOpenFolders}
            className={cn(
              "h-full py-0 pl-2 pr-0 md:**:data-[slot=folder]:py-0.5 md:**:data-[slot=file]:py-0.5",
              "[scrollbar-width:none] hover:[scrollbar-width:thin]",
              "[&::-webkit-scrollbar]:w-0 hover:[&::-webkit-scrollbar]:w-1.5",
              "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent",
              "hover:[&::-webkit-scrollbar-thumb]:bg-border",
              "[&::-webkit-scrollbar-track]:bg-transparent"
            )}
          >
            <FileTreeView
              nodes={tree}
              activePath={activePath}
              onSelect={onSelect}
            />
          </Files>
        )}
      </div>
    </div>
  )
}
