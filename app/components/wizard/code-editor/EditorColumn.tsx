"use client"

import type { MouseEvent } from "react"

import { EditorBreadcrumb } from "@/app/components/wizard/code-editor/EditorBreadcrumb"
import { EditorPane } from "@/app/components/wizard/code-editor/EditorPane"
import { EditorTabs } from "@/app/components/wizard/code-editor/EditorTabs"

export function EditorColumn({
  paths,
  activePath,
  pinnedPaths,
  loading,
  error,
  code,
  theme,
  canPreview,
  isMobile,
  onSelectTab,
  onCloseTab,
  onCloseAllTabs,
  onCloseOtherTabs,
  onMoveTabToRight,
  onTogglePinTab,
  onBrowseFiles,
}: {
  paths: string[]
  activePath: string | null
  pinnedPaths: string[]
  loading: boolean
  error: string | null
  code: string
  theme: string
  canPreview: boolean
  isMobile: boolean
  onSelectTab: (path: string) => void
  onCloseTab: (path: string, event?: MouseEvent) => void
  onCloseAllTabs: () => void
  onCloseOtherTabs: (path: string) => void
  onMoveTabToRight: (path: string) => void
  onTogglePinTab: (path: string) => void
  onBrowseFiles: () => void
}) {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
      <EditorTabs
        paths={paths}
        activePath={activePath}
        pinnedPaths={pinnedPaths}
        loading={loading}
        onSelect={onSelectTab}
        onClose={onCloseTab}
        onCloseAll={onCloseAllTabs}
        onCloseOthers={onCloseOtherTabs}
        onMoveToRight={onMoveTabToRight}
        onTogglePin={onTogglePinTab}
      />
      {activePath ? (
        <EditorBreadcrumb
          path={activePath}
          code={code}
          canCopy={canPreview}
        />
      ) : null}
      <EditorPane
        loading={loading}
        error={error}
        activePath={activePath}
        code={code}
        theme={theme}
        canPreview={canPreview}
        isMobile={isMobile}
        onBrowseFiles={onBrowseFiles}
      />
    </div>
  )
}
