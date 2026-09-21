"use client"

import {
    Highlight,
    HighlightItem,
} from "@/components/animate-ui/primitives/effects/highlight"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip"
import {
    Code,
    CodeBlock,
} from "@/components/animate-ui/components/animate/code"
import { Button } from "@/components/ui/button"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"

const ink = {
    black: "#111111",
    white: "#ffffff",
    grey1: "#e8e8e8",
    grey2: "#d0d0d0",
    grey3: "#a3a3a3",
    grey4: "#6b6b6b",
} as const

export function PreviewChoiceGroup({
    value,
    children,
    className,
}: {
    value: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn("relative flex flex-wrap gap-3", className)}>
            <Highlight
                mode="children"
                value={value}
                controlledItems
                click={false}
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
                className="rounded-2xl bg-muted"
            >
                {children}
            </Highlight>
        </div>
    )
}

export function PreviewChoiceCard({
    value,
    label,
    selected,
    children,
    onInfo,
    className,
    surfaceClassName,
}: {
    value: string
    label: string
    selected: boolean
    children: React.ReactNode
    onInfo?: () => void
    className?: string
    surfaceClassName?: string
}) {
    return (
        <label
            htmlFor={value}
            className={cn(
                "group relative z-10 flex w-48 shrink-0 cursor-pointer",
                "transition-transform duration-150 ease-out",
                "active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100",
                className
            )}
        >
            <RadioGroupItem value={value} id={value} className="sr-only" />
            <HighlightItem
                value={value}
                className="w-full rounded-2xl p-2"
            >
                <div className="flex w-full flex-col gap-2.5">
                    <div
                        data-slot="preview-surface"
                        data-selected={selected || undefined}
                        className={cn(
                            "relative aspect-5/3 w-full overflow-hidden rounded-xl bg-card",
                            "transition-[border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
                            "group-has-focus-visible:outline-2 group-has-focus-visible:outline-offset-2 group-has-focus-visible:outline-ring",
                            selected
                                ? "border-2 border-primary"
                                : "border-2 border-transparent group-hover:border-border/60",
                            surfaceClassName
                        )}
                    >
                        {children}
                        {onInfo ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            onInfo()
                                        }}
                                        className={cn(
                                            "absolute top-1 right-1 z-10 size-7 rounded-full",
                                            "bg-background/80 text-muted-foreground backdrop-blur-sm",
                                            "hover:bg-background hover:text-foreground",
                                            "opacity-0 transition-opacity duration-150",
                                            "group-hover:opacity-100 focus-visible:opacity-100"
                                        )}
                                        aria-label={`Details for ${label}`}
                                    >
                                        <HugeiconsIcon
                                            icon={InformationCircleIcon}
                                            size={14}
                                        />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>View details</TooltipContent>
                            </Tooltip>
                        ) : null}
                    </div>
                    <span
                        className={cn(
                            "px-0.5 text-[13px] leading-snug tracking-tight transition-colors duration-150",
                            selected
                                ? "font-medium text-foreground"
                                : "font-normal text-muted-foreground group-hover:text-foreground/80"
                        )}
                    >
                        {label}
                    </span>
                </div>
            </HighlightItem>
        </label>
    )
}

function Bar({
    className,
    tone = "mid",
}: {
    className?: string
    tone?: "light" | "mid" | "dark" | "ink"
}) {
    const bg =
        tone === "ink"
            ? ink.black
            : tone === "dark"
              ? ink.grey4
              : tone === "mid"
                ? ink.grey2
                : ink.grey1
    return (
        <div
            className={cn("h-1 rounded-full", className)}
            style={{ backgroundColor: bg }}
        />
    )
}

function SkeletonBlock({
    dark,
    className,
}: {
    dark?: boolean
    className?: string
}) {
    return (
        <div className={cn("flex h-full flex-col gap-2 p-2", className)}>
            <div className="flex items-start gap-1.5">
                <div
                    className="size-3.5 shrink-0 rounded"
                    style={{
                        backgroundColor: dark ? "rgba(255,255,255,0.18)" : ink.grey2,
                    }}
                />
                <div className="flex flex-1 flex-col gap-1 pt-0.5">
                    <div
                        className="h-1 w-[70%] rounded-full"
                        style={{
                            backgroundColor: dark
                                ? "rgba(255,255,255,0.22)"
                                : ink.grey3,
                        }}
                    />
                    <div
                        className="h-1 w-[40%] rounded-full"
                        style={{
                            backgroundColor: dark
                                ? "rgba(255,255,255,0.12)"
                                : ink.grey1,
                        }}
                    />
                </div>
            </div>
            <div
                className="mt-auto h-1.5 w-7 rounded-full"
                style={{
                    backgroundColor: dark ? "rgba(255,255,255,0.35)" : ink.black,
                }}
            />
        </div>
    )
}

export function AppearancePreview({
    mode,
}: {
    mode: "light" | "dark" | "auto"
    accent?: string
}) {
    if (mode === "auto") {
        return (
            <div className="flex h-full w-full">
                <div className="w-1/2" style={{ backgroundColor: ink.white }}>
                    <SkeletonBlock />
                </div>
                <div className="w-1/2" style={{ backgroundColor: ink.black }}>
                    <SkeletonBlock dark />
                </div>
            </div>
        )
    }

    return (
        <div
            className="flex h-full w-full flex-col"
            style={{
                backgroundColor: mode === "dark" ? ink.black : ink.white,
            }}
        >
            <SkeletonBlock dark={mode === "dark"} />
        </div>
    )
}

export function ThemePresetPreview({
    preset,
}: {
    preset: "material3" | "cupertino" | "custom"
    accent?: string
}) {
    if (preset === "cupertino") {
        return (
            <div
                className="flex h-full w-full flex-col gap-1.5 p-2"
                style={{ backgroundColor: ink.grey1 }}
            >
                <Bar className="w-8" tone="ink" />
                <div
                    className="flex flex-1 flex-col overflow-hidden rounded-md"
                    style={{ backgroundColor: ink.white }}
                >
                    <div className="flex items-center gap-1.5 border-b border-black/5 px-2 py-1.5">
                        <div
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: ink.grey1 }}
                        />
                        <Bar className="w-8" tone="mid" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1.5">
                        <div
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: ink.grey1 }}
                        />
                        <Bar className="w-5" tone="light" />
                    </div>
                    <div className="mt-auto px-2 pb-2">
                        <div
                            className="h-3 w-full rounded-full"
                            style={{ backgroundColor: ink.black }}
                        />
                    </div>
                </div>
            </div>
        )
    }

    if (preset === "custom") {
        return (
            <div
                className="flex h-full w-full flex-col gap-1.5 p-2"
                style={{ backgroundColor: ink.grey1 }}
            >
                <Bar className="w-6 rounded-sm" tone="mid" />
                <div className="grid flex-1 grid-cols-2 gap-1">
                    <div
                        className="rounded border border-dashed"
                        style={{
                            borderColor: ink.grey2,
                            backgroundColor: ink.white,
                        }}
                    />
                    <div
                        className="rounded border border-dashed"
                        style={{
                            borderColor: ink.grey2,
                            backgroundColor: ink.white,
                        }}
                    />
                    <div
                        className="col-span-2 flex items-center justify-center rounded border border-dashed"
                        style={{
                            borderColor: ink.grey2,
                            backgroundColor: ink.white,
                        }}
                    >
                        <Bar className="w-8 rounded-sm" tone="ink" />
                    </div>
                </div>
            </div>
        )
    }

    // Material 3 — monochrome app bar + cards + FAB
    return (
        <div
            className="flex h-full w-full flex-col"
            style={{ backgroundColor: ink.white }}
        >
            <div className="h-4 shrink-0" style={{ backgroundColor: ink.black }} />
            <div className="relative flex flex-1 flex-col gap-1.5 p-1.5">
                <div
                    className="h-5 rounded-md"
                    style={{ backgroundColor: ink.grey1 }}
                />
                <div
                    className="h-3.5 rounded-md"
                    style={{ backgroundColor: ink.grey1 }}
                />
                <div
                    className="absolute right-1.5 bottom-1.5 size-4 rounded-lg"
                    style={{ backgroundColor: ink.black }}
                />
            </div>
        </div>
    )
}

export function PlatformPreview({
    style,
}: {
    style: "adaptive" | "material" | "cupertino"
    accent?: string
}) {
    if (style === "adaptive") {
        return (
            <div className="flex h-full w-full">
                <div
                    className="flex w-1/2 flex-col border-r border-black/5"
                    style={{ backgroundColor: ink.white }}
                >
                    <div
                        className="h-3 shrink-0"
                        style={{ backgroundColor: ink.black }}
                    />
                    <div className="relative flex-1 p-1">
                        <div
                            className="h-full rounded"
                            style={{ backgroundColor: ink.grey1 }}
                        />
                        <div
                            className="absolute right-1 bottom-1 size-2.5 rounded"
                            style={{ backgroundColor: ink.black }}
                        />
                    </div>
                </div>
                <div
                    className="flex w-1/2 flex-col"
                    style={{ backgroundColor: ink.grey1 }}
                >
                    <div className="flex-1 px-1.5 pt-1.5">
                        <Bar className="w-6" tone="ink" />
                        <Bar className="mt-1.5 w-4" tone="light" />
                    </div>
                    <div
                        className="flex h-4 items-center justify-around border-t border-black/5"
                        style={{ backgroundColor: ink.white }}
                    >
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="size-1 rounded-full"
                                style={{
                                    backgroundColor:
                                        i === 0 ? ink.black : ink.grey2,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (style === "cupertino") {
        return (
            <div
                className="flex h-full w-full flex-col"
                style={{ backgroundColor: ink.grey1 }}
            >
                <div className="px-2 pt-2 pb-1">
                    <Bar className="w-10" tone="ink" />
                </div>
                <div
                    className="mx-1.5 flex-1 rounded-md p-2"
                    style={{ backgroundColor: ink.white }}
                >
                    <Bar className="mb-1 w-8" tone="mid" />
                    <Bar className="w-5" tone="light" />
                </div>
                <div
                    className="mt-1 flex h-4 items-center justify-around border-t border-black/5"
                    style={{ backgroundColor: ink.white }}
                >
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="size-1.5 rounded-full"
                            style={{
                                backgroundColor: i === 1 ? ink.black : ink.grey2,
                            }}
                        />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div
            className="flex h-full w-full flex-col"
            style={{ backgroundColor: ink.white }}
        >
            <div
                className="flex h-4 shrink-0 items-center px-2"
                style={{ backgroundColor: ink.black }}
            >
                <div
                    className="h-1 w-7 rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.75)" }}
                />
            </div>
            <div className="relative flex flex-1 flex-col gap-1 p-1.5">
                <div
                    className="h-4 rounded"
                    style={{ backgroundColor: ink.grey1 }}
                />
                <div
                    className="h-4 rounded"
                    style={{ backgroundColor: ink.grey1 }}
                />
                <div
                    className="absolute right-1.5 bottom-1.5 size-3.5 rounded-lg"
                    style={{ backgroundColor: ink.black }}
                />
            </div>
            <div
                className="flex h-3.5 items-center justify-around"
                style={{ backgroundColor: ink.grey1 }}
            >
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="h-0.5 w-3 rounded-full"
                        style={{
                            backgroundColor: i === 0 ? ink.black : ink.grey3,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export function UiKitPreview({
    kit,
}: {
    kit: "app" | "shadcn"
    accent?: string
}) {
    if (kit === "shadcn") {
        return (
            <div
                className="flex h-full w-full flex-col justify-end gap-1.5 p-2"
                style={{ backgroundColor: ink.grey1 }}
            >
                <div
                    className="h-3.5 rounded border"
                    style={{
                        borderColor: ink.grey2,
                        backgroundColor: ink.white,
                    }}
                />
                <div
                    className="flex h-3.5 items-center justify-center rounded"
                    style={{ backgroundColor: ink.black }}
                >
                    <div
                        className="h-0.5 w-6 rounded-sm"
                        style={{ backgroundColor: ink.white }}
                    />
                </div>
                <div
                    className="h-3.5 rounded border"
                    style={{ borderColor: ink.grey3 }}
                />
            </div>
        )
    }

    return (
        <div
            className="flex h-full w-full flex-col justify-end gap-1.5 p-2"
            style={{ backgroundColor: ink.white }}
        >
            <div
                className="flex h-3.5 items-center justify-center rounded-full"
                style={{ backgroundColor: ink.black }}
            >
                <div
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: ink.white }}
                />
            </div>
            <div
                className="flex h-3.5 items-center justify-center rounded-full border"
                style={{ borderColor: ink.black }}
            >
                <div
                    className="h-0.5 w-5 rounded-full"
                    style={{ backgroundColor: ink.black }}
                />
            </div>
        </div>
    )
}

const DEFAULT_APP_SNIPPETS = {
    material: `return MaterialApp(
  theme: ThemeData(
    colorSchemeSeed: const Color(0xFF6750A4),
    useMaterial3: true,
  ),
  home: const HomePage(),
);`,
    cupertino: `return CupertinoApp(
  theme: const CupertinoThemeData(
    primaryColor: CupertinoColors.activeBlue,
  ),
  home: const HomePage(),
);`,
    shad: `return ShadApp.custom(
  themeMode: ThemeMode.dark,
  darkTheme: ShadThemeData(
    brightness: Brightness.dark,
    colorScheme: const ShadSlateColorScheme.dark(),
  ),
  appBuilder: (context) {
    return MaterialApp(
      theme: Theme.of(context),
    );
  },
);`,
} as const

export function DefaultAppPreview({
    app,
    animate = false,
}: {
    app: "material" | "cupertino" | "shad"
    animate?: boolean
}) {
    const code = DEFAULT_APP_SNIPPETS[app]

    return (
        <Code
            code={code}
            className="h-full w-full rounded-none border-0 bg-zinc-50 dark:bg-zinc-950"
        >
            <CodeBlock
                key={`${app}-${animate ? "on" : "off"}`}
                lang="dart"
                writing={animate}
                duration={1800}
                inView
                className={cn(
                    "h-full overflow-hidden p-3",
                    "[&_code]:text-[11px]! [&_code]:leading-normal! [&_pre]:m-0!",
                    "text-zinc-800 dark:text-zinc-200"
                )}
            />
        </Code>
    )
}
