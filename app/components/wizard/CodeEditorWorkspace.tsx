"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  Cancel01Icon,
  File01Icon,
  FolderMinusIcon,
  SwatchIcon,
  SidebarLeftIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  basename,
  buildFileTree,
  type FileTreeNode,
} from "@/app/components/wizard/code-editor/buildFileTree"
import { buildGenerateForm } from "@/app/components/wizard/code-editor/buildGenerateForm"
import {
  DEFAULT_SHIKI_THEME,
  getShikiThemeLabel,
  highlightCode,
  langFromPath,
  SHIKI_THEMES,
  type ShikiThemeId,
} from "@/app/components/wizard/code-editor/highlightCode"
import {
  preferInitialFile,
  unzipScaffold,
  canPreviewAsText,
} from "@/app/components/wizard/code-editor/unzipScaffold"
import { scaffoldConfigSchema } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import {
  Files,
  FolderItem,
  FolderTrigger,
  FolderContent,
  FileItem,
  SubFiles,
} from "@/components/animate-ui/components/radix/files"
import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

type CacheEntry = {
  key: string
  files: Record<string, string>
}

let scaffoldCache: CacheEntry | null = null

function FileTreeView({
  nodes,
  activePath,
  onSelect,
  nested = false,
}: {
  nodes: FileTreeNode[]
  activePath: string | null
  onSelect: (path: string) => void
  nested?: boolean
}) {
  const items = nodes.map((node) => {
    if (node.type === "folder") {
      return (
        <FolderItem key={node.path} value={node.path}>
          <FolderTrigger className="text-[13px]">{node.name}</FolderTrigger>
          <FolderContent>
            {node.children && node.children.length > 0 ? (
              <FileTreeView
                nodes={node.children}
                activePath={activePath}
                onSelect={onSelect}
                nested
              />
            ) : null}
          </FolderContent>
        </FolderItem>
      )
    }

    return (
      <button
        key={node.path}
        type="button"
        onClick={() => onSelect(node.path)}
        className={cn(
          "w-full rounded-none text-left transition-colors duration-150",
          activePath === node.path
            ? "bg-primary/15 text-foreground rounded-md"
            : "hover:bg-muted rounded-md active:bg-muted"
        )}
      >
        <FileItem
          className={cn(
            "text-[13px]",
            activePath === node.path && "font-medium text-foreground"
          )}
        >
          {node.name}
        </FileItem>
      </button>
    )
  })

  if (nested) {
    return <SubFiles defaultOpen={[]}>{items}</SubFiles>
  }

  return <>{items}</>
}

function HighlightedPane({
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

function ThemePicker({
  value,
  onChange,
}: {
  value: ShikiThemeId
  onChange: (value: ShikiThemeId) => void
}) {
  const darkThemes = SHIKI_THEMES.filter((t) => t.type === "dark")
  const lightThemes = SHIKI_THEMES.filter((t) => t.type === "light")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 rounded-md px-2.5 text-xs font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
        >
          <HugeiconsIcon icon={SwatchIcon} className="size-3.5 shrink-0" />
          <span className="hidden max-w-36 truncate sm:inline">
            {getShikiThemeLabel(value)}
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className="size-3.5 shrink-0 text-muted-foreground"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="text-xs font-semibold text-foreground">
          Highlight style
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onChange(next as ShikiThemeId)}
        >
          <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Dark
          </DropdownMenuLabel>
          {darkThemes.map((theme) => (
            <DropdownMenuRadioItem
              key={theme.id}
              value={theme.id}
              className="text-xs font-medium"
            >
              {theme.label}
            </DropdownMenuRadioItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Light
          </DropdownMenuLabel>
          {lightThemes.map((theme) => (
            <DropdownMenuRadioItem
              key={theme.id}
              value={theme.id}
              className="text-xs font-medium"
            >
              {theme.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SyncStatus({ syncing }: { syncing: boolean }) {
  return (
    <div
      className={cn(
        "flex h-7 items-center gap-1.5 rounded-md border px-2 text-xs font-medium sm:gap-2 sm:px-2.5",
        syncing
          ? "border-primary/25 bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground"
      )}
      aria-live="polite"
      aria-label={syncing ? "Syncing" : "Live"}
    >
      {syncing ? (
        <Spinner className="size-3.5 text-primary" />
      ) : (
        <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
      )}
      <span className="hidden sm:inline">{syncing ? "Syncing" : "Live"}</span>
    </div>
  )
}

function ExplorerPane({
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

export function CodeEditorWorkspace() {
  const { config, fontFiles, isHydrated } = useWizard()
  const isMobile = useIsMobile()
  const isValid = React.useMemo(
    () => scaffoldConfigSchema.safeParse(config).success,
    [config]
  )
  const configKey = React.useMemo(
    () =>
      JSON.stringify({
        config,
        fonts: [...fontFiles.keys()].sort(),
      }),
    [config, fontFiles]
  )

  const [shikiTheme, setShikiTheme] =
    React.useState<ShikiThemeId>(DEFAULT_SHIKI_THEME)
  const [files, setFiles] = React.useState<Record<string, string>>({})
  const [tree, setTree] = React.useState<FileTreeNode[]>([])
  const [openFolders, setOpenFolders] = React.useState<string[]>([])
  const [treeKey, setTreeKey] = React.useState(0)
  const [openPaths, setOpenPaths] = React.useState<string[]>([])
  const [pinnedPaths, setPinnedPaths] = React.useState<string[]>([])
  const [activePath, setActivePath] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [pendingSync, setPendingSync] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [explorerOpen, setExplorerOpen] = React.useState(false)
  const hasLoadedRef = React.useRef(false)
  const requestIdRef = React.useRef(0)

  const applyScaffoldFiles = React.useCallback(
    (unzipped: Record<string, string>, nextKey: string) => {
      scaffoldCache = { key: nextKey, files: unzipped }
      setFiles(unzipped)
      setTree(buildFileTree(unzipped))

      setOpenPaths((prev) => {
        const kept = prev.filter((path) => path in unzipped)
        if (kept.length > 0) {
          setActivePath((current) =>
            current && current in unzipped
              ? current
              : kept[0] ?? preferInitialFile(Object.keys(unzipped))
          )
          return kept
        }
        const initial = preferInitialFile(Object.keys(unzipped))
        setActivePath(initial)
        return initial ? [initial] : []
      })
      setPinnedPaths((prev) => prev.filter((path) => path in unzipped))
    },
    []
  )

  const loadScaffold = React.useCallback(
    async (options?: { silent?: boolean }) => {
      if (!isValid) return

      if (scaffoldCache?.key === configKey) {
        applyScaffoldFiles(scaffoldCache.files, configKey)
        setPendingSync(false)
        setLoading(false)
        return
      }

      const requestId = ++requestIdRef.current
      if (!options?.silent) setLoading(true)
      setPendingSync(true)
      setError(null)

      try {
        const form = buildGenerateForm(config, fontFiles)
        const response = await fetch("/api/generate", {
          method: "POST",
          body: form,
        })

        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          throw new Error(
            (body as { error?: string })?.error ?? "Failed to generate project"
          )
        }

        const blob = await response.blob()
        const unzipped = await unzipScaffold(blob)
        if (requestId !== requestIdRef.current) return
        applyScaffoldFiles(unzipped, configKey)
      } catch (err) {
        if (requestId !== requestIdRef.current) return
        setError(err instanceof Error ? err.message : "Something went wrong")
        setFiles({})
        setTree([])
        setOpenPaths([])
        setPinnedPaths([])
        setActivePath(null)
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false)
          setPendingSync(false)
        }
      }
    },
    [applyScaffoldFiles, config, fontFiles, configKey, isValid]
  )

  React.useEffect(() => {
    if (!isHydrated || !isValid) return

    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true
      void loadScaffold()
      return
    }

    setPendingSync(true)
    const timer = window.setTimeout(() => {
      void loadScaffold({ silent: true })
    }, 450)

    return () => window.clearTimeout(timer)
  }, [isHydrated, isValid, configKey, loadScaffold])

  React.useEffect(() => {
    if (!isMobile) setExplorerOpen(false)
  }, [isMobile])

  const isSyncing = pendingSync || loading

  const collapseAllFolders = React.useCallback(() => {
    setOpenFolders([])
    setTreeKey((key) => key + 1)
  }, [])

  const openFile = React.useCallback(
    (path: string) => {
      setOpenPaths((prev) => (prev.includes(path) ? prev : [...prev, path]))
      setActivePath(path)
      if (isMobile) setExplorerOpen(false)
    },
    [isMobile]
  )

  const closeTab = React.useCallback((path: string, event?: React.MouseEvent) => {
    event?.stopPropagation()
    setPinnedPaths((prev) => prev.filter((p) => p !== path))
    setOpenPaths((prev) => {
      const index = prev.indexOf(path)
      if (index === -1) return prev
      const next = prev.filter((p) => p !== path)
      setActivePath((current) => {
        if (current !== path) return current
        if (next.length === 0) return null
        return next[Math.min(index, next.length - 1)]
      })
      return next
    })
  }, [])

  const closeOtherTabs = React.useCallback((path: string) => {
    setOpenPaths([path])
    setPinnedPaths((prev) => prev.filter((p) => p === path))
    setActivePath(path)
  }, [])

  const closeAllTabs = React.useCallback(() => {
    setOpenPaths([])
    setPinnedPaths([])
    setActivePath(null)
  }, [])

  const moveTabToRight = React.useCallback((path: string) => {
    setPinnedPaths((prev) => prev.filter((p) => p !== path))
    setOpenPaths((prev) => {
      if (!prev.includes(path)) return prev
      return [...prev.filter((p) => p !== path), path]
    })
  }, [])

  const togglePinTab = React.useCallback((path: string) => {
    setPinnedPaths((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    )
  }, [])

  const orderedOpenPaths = React.useMemo(() => {
    const pinned = pinnedPaths.filter((path) => openPaths.includes(path))
    const unpinned = openPaths.filter((path) => !pinnedPaths.includes(path))
    return [...pinned, ...unpinned]
  }, [openPaths, pinnedPaths])

  const activeCode = activePath ? files[activePath] ?? "" : ""
  const projectName = config.appName || "flutter_app"
  const canPreview =
    activePath != null && canPreviewAsText(activePath, activeCode)

  const explorer = (
    <ExplorerPane
      projectName={projectName}
      loading={loading}
      error={error}
      tree={tree}
      treeKey={treeKey}
      openFolders={openFolders}
      setOpenFolders={setOpenFolders}
      activePath={activePath}
      onSelect={openFile}
      onCollapseAll={collapseAllFolders}
      inSheet={isMobile}
    />
  )

  const editorColumn = (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
      {/* Tabs */}
      <div className="flex h-10 shrink-0 items-center gap-1 border-b border-border/60 bg-muted/20 px-1.5 sm:border-b-0 sm:px-2">
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center gap-1 overflow-x-auto overscroll-x-contain px-0.5 py-1.5",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          )}
        >
          {orderedOpenPaths.length === 0 && !loading ? (
            <span className="px-2 text-xs text-muted-foreground">
              No open editors
            </span>
          ) : null}
          {orderedOpenPaths.map((path) => {
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
                    onClick={() => setActivePath(path)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setActivePath(path)
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
                      onClick={(e) => closeTab(path, e)}
                      className={cn(
                        "ml-auto flex size-6 shrink-0 items-center justify-center rounded-sm transition-opacity hover:bg-muted sm:size-auto sm:p-0.5",
                        isActive
                          ? "text-primary/70 opacity-100 hover:text-primary"
                          : "text-muted-foreground opacity-100 hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                      )}
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        className="size-3"
                      />
                    </button>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-44">
                  <ContextMenuItem onClick={() => closeTab(path)}>
                    Close
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => closeAllTabs()}
                    disabled={orderedOpenPaths.length === 0}
                  >
                    Close all
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => closeOtherTabs(path)}
                    disabled={orderedOpenPaths.length <= 1}
                  >
                    Close others
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => moveTabToRight(path)}>
                    Move to right
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => togglePinTab(path)}>
                    {isPinned ? "Unpin" : "Pin"}
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            )
          })}
        </div>
      </div>

      {/* Breadcrumb */}
      {activePath ? (
        <div className="flex h-7 shrink-0 items-center gap-1 overflow-x-auto overscroll-x-contain bg-background px-3 text-[11px] text-muted-foreground sm:h-6 sm:text-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {activePath.split("/").map((segment, index, parts) => (
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
      ) : null}

      {/* Code */}
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
                onClick={() => setExplorerOpen(true)}
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
          <HighlightedPane
            code={activeCode}
            filePath={activePath}
            theme={shikiTheme}
          />
        )}
      </div>
    </div>
  )

  if (!isHydrated) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
        Restoring session…
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <p className="text-sm text-muted-foreground">
          Fix your project configuration before previewing generated code.
        </p>
        <Button asChild>
          <Link href="/create">Back to wizard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      {/* Title bar */}
      <header className="flex h-11 shrink-0 items-center gap-1 border-b border-border bg-muted/40 px-1.5 sm:h-10 sm:gap-2 sm:px-2">
        <div className="flex min-w-0 shrink-0 items-center gap-0.5 sm:gap-1">
          {isMobile ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-8 rounded-md text-foreground/80 hover:bg-muted hover:text-foreground"
              onClick={() => setExplorerOpen(true)}
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
          <ThemePicker value={shikiTheme} onChange={setShikiTheme} />
          <SyncStatus syncing={isSyncing} />
        </div>
      </header>
      {isSyncing ? (
        <div
          className="h-0.5 w-full shrink-0 overflow-hidden bg-muted"
          role="progressbar"
          aria-label="Syncing generated code"
        >
          <div className="h-full w-full animate-pulse bg-primary" />
        </div>
      ) : (
        <div className="h-0.5 w-full shrink-0 bg-transparent" aria-hidden="true" />
      )}

      <div className="flex min-h-0 min-w-0 flex-1">
        {isMobile ? (
          <>
            <Sheet open={explorerOpen} onOpenChange={setExplorerOpen}>
              <SheetContent
                side="left"
                showCloseButton
                className="w-[min(100%,20rem)] gap-0 p-0 [&>button]:top-2.5 [&>button]:right-2"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>File explorer</SheetTitle>
                </SheetHeader>
                <div className="h-full min-h-0">{explorer}</div>
              </SheetContent>
            </Sheet>
            {editorColumn}
          </>
        ) : (
          <ResizablePanelGroup
            orientation="horizontal"
            className="min-w-0 flex-1"
          >
            <ResizablePanel
              defaultSize="20%"
              minSize="12rem"
              maxSize="36%"
              className="min-w-0"
            >
              {explorer}
            </ResizablePanel>

            <ResizableHandle className="w-px bg-border hover:bg-primary/40" />

            <ResizablePanel defaultSize="80%" className="min-w-0">
              {editorColumn}
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  )
}
