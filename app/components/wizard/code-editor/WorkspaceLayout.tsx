"use client"

import type { ReactNode } from "react"

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

export function WorkspaceLayout({
  isMobile,
  explorerOpen,
  onExplorerOpenChange,
  explorer,
  editor,
}: {
  isMobile: boolean
  explorerOpen: boolean
  onExplorerOpenChange: (open: boolean) => void
  explorer: ReactNode
  editor: ReactNode
}) {
  if (isMobile) {
    return (
      <>
        <Sheet open={explorerOpen} onOpenChange={onExplorerOpenChange}>
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
        {editor}
      </>
    )
  }

  return (
    <ResizablePanelGroup orientation="horizontal" className="min-w-0 flex-1">
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
        {editor}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
