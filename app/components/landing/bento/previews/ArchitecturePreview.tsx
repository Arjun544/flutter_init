"use client"
// Architecture Agnostic preview — animated folder tree

import { cn } from "@/lib/utils"
import { Folder, File } from "lucide-react"
import { useBentoHover } from "../bento-hover-context"

const TREE = [
  { indent: 0, label: "lib/", type: "dir" },
  { indent: 1, label: "features/", type: "dir" },
  { indent: 2, label: "auth/", type: "dir" },
  { indent: 3, label: "data/", type: "dir" },
  { indent: 3, label: "domain/", type: "dir" },
  { indent: 3, label: "presentation/", type: "dir" },
  { indent: 2, label: "home/", type: "dir" },
  { indent: 1, label: "core/", type: "dir" },
  { indent: 2, label: "utils.dart", type: "file" },
]

export function ArchitecturePreview() {
  const { isHovered } = useBentoHover()

  return (
    <div
      className={cn(
        "rounded-2xl px-3 py-2 font-mono text-[11px] leading-relaxed transition-all duration-300",
      )}
    >
      {TREE.map((node, i) => {
        const delayStyle = {
          transitionDelay: isHovered ? `${i * 30}ms` : "0ms",
        }

        return (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 transition-all duration-200 opacity-100 translate-x-0"
            )}
            style={{ paddingLeft: node.indent * 12 }}
          >
            <span
              className={cn(
                "transition-colors duration-300 flex items-center justify-center size-4",
                node.type === "dir"
                  ? (isHovered ? "text-amber-500" : "text-zinc-300")
                  : (isHovered ? "text-primary" : "text-zinc-300")
              )}
              style={delayStyle}
            >
              {node.type === "dir" ? (
                <Folder className="size-3.5 shrink-0" />
              ) : (
                <File className="size-3.5 shrink-0" />
              )}
            </span>
            <span
              className={cn(
                "transition-colors duration-300",
                isHovered ? "text-zinc-700" : "text-zinc-400"
              )}
              style={delayStyle}
            >
              {node.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
