"use client"

import { ArrowDown01Icon, SwatchIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  getShikiThemeLabel,
  SHIKI_THEMES,
  type ShikiThemeId,
} from "@/app/components/wizard/code-editor/highlightCode"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemePicker({
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
