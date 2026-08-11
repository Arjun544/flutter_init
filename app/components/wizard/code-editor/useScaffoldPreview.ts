"use client"

import * as React from "react"

import {
  buildFileTree,
  type FileTreeNode,
} from "@/app/components/wizard/code-editor/buildFileTree"
import { buildGenerateForm } from "@/app/components/wizard/code-editor/buildGenerateForm"
import {
  preferInitialFile,
  unzipScaffold,
} from "@/app/components/wizard/code-editor/unzipScaffold"
import type { ScaffoldConfig } from "@/app/lib/config/schema"

type CacheEntry = {
  key: string
  files: Record<string, string>
}

let scaffoldCache: CacheEntry | null = null

export function useScaffoldPreview({
  config,
  fontFiles,
  configKey,
  isValid,
  isHydrated,
}: {
  config: ScaffoldConfig
  fontFiles: Map<string, File>
  configKey: string
  isValid: boolean
  isHydrated: boolean
}) {
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

  const collapseAllFolders = React.useCallback(() => {
    setOpenFolders([])
    setTreeKey((key) => key + 1)
  }, [])

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

  return {
    files,
    tree,
    openFolders,
    setOpenFolders,
    treeKey,
    openPaths,
    setOpenPaths,
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
  }
}
