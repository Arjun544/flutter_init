"use client"

import {
  FolderItem,
  FolderTrigger,
  FolderContent,
  FileItem,
  SubFiles,
} from "@/components/animate-ui/components/radix/files"
import { cn } from "@/lib/utils"
import type { FileTreeNode } from "@/app/components/wizard/code-editor/buildFileTree"

export function FileTreeView({
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
          "w-full rounded-none text-left transition-colors duration-150 cursor-pointer",
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
