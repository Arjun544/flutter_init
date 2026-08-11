"use client"

import type { MouseEvent } from "react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { basename } from "@/app/components/wizard/code-editor/buildFileTree"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { cn } from "@/lib/utils"

export function EditorTabs({
  paths,
  activePath,
  pinnedPaths,
  loading,
  onSelect,
  onClose,
  onCloseAll,
  onCloseOthers,
  onMoveToRight,
  onTogglePin,
}: {
  paths: string[]
  activePath: string | null
  pinnedPaths: string[]
  loading: boolean
  onSelect: (path: string) => void
  onClose: (path: string, event?: MouseEvent) => void
  onCloseAll: () => void
  onCloseOthers: (path: string) => void
  onMoveToRight: (path: string) => void
  onTogglePin: (path: string) => void
}) {
  return (
    <div className="flex h-10 shrink-0 items-center gap-1 border-b border-border/60 bg-muted/20 px-1.5 sm:border-b-0 sm:px-2">
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-1 overflow-x-auto overscroll-x-contain px-0.5 py-1.5",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {paths.length === 0 && !loading ? (
          <span className="px-2 text-xs text-muted-foreground">
            No open editors
          </span>
        ) : null}
        {paths.map((path) => {
          const isActive = path === activePath
          const isPinned = pinnedPaths.includes(path)
          const name = basename(path)
          return (
            <ContextMenu key={path}>
              <ContextMenuTrigger asChild>
                <div
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={0}
                  onClick={() => onSelect(path)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onSelect(path)
                    }
                  }}
                  className={cn(
                    "group flex h-8 max-w-38 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 text-[12px] transition-colors duration-150 sm:h-7 sm:w-40 sm:max-w-none",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-3.5 shrink-0",
                      isActive ? "bg-primary" : "bg-muted-foreground"
                    )}
                    style={{
                      maskImage: "url(/icons/dart.svg)",
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskImage: "url(/icons/dart.svg)",
                      WebkitMaskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                    }}
                  />
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {name}
                  </span>
                  {isPinned ? (
                    <span
                      aria-label="Pinned"
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        isActive ? "bg-primary" : "bg-muted-foreground"
                      )}
                    />
                  ) : null}
                  <button
                    type="button"
                    aria-label={`Close ${name}`}
                    onClick={(e) => onClose(path, e)}
                    className={cn(
                      "ml-auto flex size-6 shrink-0 items-center justify-center rounded-sm transition-opacity hover:bg-muted sm:size-auto sm:p-0.5",
                      isActive
                        ? "text-primary/70 opacity-100 hover:text-primary"
                        : "text-muted-foreground opacity-100 hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                    )}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                  </button>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-44">
                <ContextMenuItem onClick={() => onClose(path)}>
                  Close
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={onCloseAll}
                  disabled={paths.length === 0}
                >
                  Close all
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => onCloseOthers(path)}
                  disabled={paths.length <= 1}
                >
                  Close others
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => onMoveToRight(path)}>
                  Move to right
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onTogglePin(path)}>
                  {isPinned ? "Unpin" : "Pin"}
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          )
        })}
      </div>
    </div>
  )
}
