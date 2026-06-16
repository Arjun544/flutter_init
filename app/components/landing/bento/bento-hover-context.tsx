"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"

type BentoHoverCtx = {
  isHovered: boolean
  playKey: number
  requestReplay: () => void
}

const BentoHoverContext = createContext<BentoHoverCtx>({
  isHovered: false,
  playKey: 0,
  requestReplay: () => {},
})

export function useBentoHover() {
  return useContext(BentoHoverContext)
}

export function BentoHoverProvider({
  children,
  isHovered,
  playKey,
  requestReplay,
}: BentoHoverCtx & { children: ReactNode }) {
  return (
    <BentoHoverContext.Provider value={{ isHovered, playKey, requestReplay }}>
      {children}
    </BentoHoverContext.Provider>
  )
}
