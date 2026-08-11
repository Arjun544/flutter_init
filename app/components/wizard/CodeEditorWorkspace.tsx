"use client"

import * as React from "react"
import Link from "next/link"

import { EditorColumn } from "@/app/components/wizard/code-editor/EditorColumn"
import { ExplorerPane } from "@/app/components/wizard/code-editor/ExplorerPane"
import { TitleBar } from "@/app/components/wizard/code-editor/TitleBar"
import { WorkspaceLayout } from "@/app/components/wizard/code-editor/WorkspaceLayout"
import {
  DEFAULT_SHIKI_THEME,
  type ShikiThemeId,
} from "@/app/components/wizard/code-editor/highlightCode"
import { useScaffoldPreview } from "@/app/components/wizard/code-editor/useScaffoldPreview"
import { canPreviewAsText } from "@/app/components/wizard/code-editor/unzipScaffold"
import { scaffoldConfigSchema } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

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
  const [explorerOpen, setExplorerOpen] = React.useState(false)

  const {
    files,
    tree,
    openFolders,
    setOpenFolders,
    treeKey,
    pinnedPaths,
    activePath,
    setActivePath,
    loading,
    pendingSync,
    error,
    collapseAllFolders,
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    moveTabToRight,
    togglePinTab,
    orderedOpenPaths,
    setOpenPaths,
  } = useScaffoldPreview({
    config,
    fontFiles,
    configKey,
    isValid,
    isHydrated,
  })

  React.useEffect(() => {
    if (!isMobile) setExplorerOpen(false)
  }, [isMobile])

  const openFile = React.useCallback(
    (path: string) => {
      setOpenPaths((prev) => (prev.includes(path) ? prev : [...prev, path]))
      setActivePath(path)
      if (isMobile) setExplorerOpen(false)
    },
    [isMobile, setActivePath, setOpenPaths]
  )

  const isSyncing = pendingSync || loading
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
      <TitleBar
        isMobile={isMobile}
        projectName={projectName}
        theme={shikiTheme}
        onThemeChange={setShikiTheme}
        syncing={isSyncing}
        onOpenExplorer={() => setExplorerOpen(true)}
      />

      <div className="flex min-h-0 min-w-0 flex-1">
        <WorkspaceLayout
          isMobile={isMobile}
          explorerOpen={explorerOpen}
          onExplorerOpenChange={setExplorerOpen}
          explorer={
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
          }
          editor={
            <EditorColumn
              paths={orderedOpenPaths}
              activePath={activePath}
              pinnedPaths={pinnedPaths}
              loading={loading}
              error={error}
              code={activeCode}
              theme={shikiTheme}
              canPreview={canPreview}
              isMobile={isMobile}
              onSelectTab={setActivePath}
              onCloseTab={closeTab}
              onCloseAllTabs={closeAllTabs}
              onCloseOtherTabs={closeOtherTabs}
              onMoveTabToRight={moveTabToRight}
              onTogglePinTab={togglePinTab}
              onBrowseFiles={() => setExplorerOpen(true)}
            />
          }
        />
      </div>
    </div>
  )
}
