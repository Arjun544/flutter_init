"use client"

import { useWizard } from "@/app/lib/state/useWizardStore"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"

export function ToggleRow({
    label,
    description,
    checked,
    onCheckedChange,
    disabled,
    infoKey,
    badge,
}: {
    label: string
    description?: string
    checked: boolean
    onCheckedChange: (value: boolean) => void
    disabled?: boolean
    infoKey?: string
    badge?: string
}) {
    const { setSelectedItem } = useWizard()
    const switchId = React.useId()
    const selected = checked && !disabled

    return (
        <Label
            htmlFor={switchId}
            className={cn(
                "block h-full w-full font-normal leading-normal",
                disabled ? "cursor-not-allowed" : "cursor-pointer",
            )}
        >
            <Card
                data-selected={selected || undefined}
                className={cn(
                    // Borders (not soft shadows): ToggleRows sit in dense accordion
                    // lists where the next grid row paints over downward box-shadows,
                    // which reads as a clipped/faded bottom edge.
                    "group h-full w-full gap-0 overflow-visible rounded-3xl border bg-card py-0 smooth-shadow-none! transition-[background-color,border-color] duration-200 ease-out",
                    selected
                        ? "border-primary/45 bg-primary/5"
                        : "border-border/70 hover:bg-muted/30",
                    !disabled && !selected && "hover:border-primary/35",
                    !disabled && "focus-within:border-primary/35",
                    disabled && "opacity-60",
                )}
            >
                <CardHeader className="flex! flex-row items-center gap-3 p-4">
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1">
                            <CardTitle
                                className={cn(
                                    "text-sm leading-5",
                                    selected
                                        ? "font-semibold text-foreground"
                                        : "font-medium text-foreground",
                                )}
                            >
                                {label}
                            </CardTitle>
                            {badge ? (
                                <Badge
                                    variant="secondary"
                                    className="h-5 shrink-0 px-1.5 text-[10px] leading-none font-medium uppercase tracking-wide"
                                >
                                    {badge}
                                </Badge>
                            ) : null}
                        </div>
                        {description ? (
                            <CardDescription className="text-xs leading-5 line-clamp-2">
                                {description}
                            </CardDescription>
                        ) : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-lg"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        const key =
                                            infoKey ||
                                            label.toLowerCase().replace(/\s+/g, "_")
                                        setSelectedItem(key)
                                    }}
                                    className={cn(
                                        "-mr-1 shrink-0 self-center rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-opacity",
                                        selected
                                            ? "opacity-100"
                                            : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100",
                                    )}
                                    aria-label={`Details for ${label}`}
                                >
                                    <HugeiconsIcon
                                        icon={InformationCircleIcon}
                                        strokeWidth={2}
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>View details</TooltipContent>
                        </Tooltip>

                        <Switch
                            id={switchId}
                            checked={checked}
                            onCheckedChange={onCheckedChange}
                            disabled={disabled}
                            aria-label={`Enable ${label}`}
                            className={cn(
                                "cursor-pointer",
                                !selected &&
                                    "data-unchecked:bg-muted-foreground/30 data-unchecked:opacity-50",
                            )}
                        />
                    </div>
                </CardHeader>
            </Card>
        </Label>
    )
}
