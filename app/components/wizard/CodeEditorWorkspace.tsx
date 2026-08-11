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
