"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroupItem } from "@/components/ui/radio-group"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip"
import { cn } from "@/lib/utils"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function OptionTile({
    value,
    label,
    description,
    selected,
    badge,
    onInfo,
    control = "radio",
    onCheckedChange,
}: {
    value: string
    label: string
    description?: string
    selected: boolean
    badge?: string
    onInfo?: () => void
    control?: "radio" | "checkbox"
    onCheckedChange?: (checked: boolean) => void
}) {
    const controlClassName = cn(
        "mt-0.5 shrink-0",
        selected
            ? "border-primary text-primary"
            : "border-muted-foreground/50 text-muted-foreground/50",
    )

    return (
        <Label htmlFor={value} className="block h-full w-full cursor-pointer font-normal">
            <Card
                data-selected={selected || undefined}
                className={cn(
                    "group h-full w-full gap-0 py-0 rounded-3xl transition-[box-shadow,background-color] duration-200 ease-out",
                    "hover:smooth-shadow-ring-sm!",
                    "focus-within:smooth-shadow-ring-sm! focus-within:smooth-ring-primary/30",
                    selected
                        ? "bg-primary/5 smooth-shadow-ring-sm! smooth-ring-primary/40 shadow-primary/15"
                        : "bg-card hover:bg-muted/30",
                )}
            >
                <CardHeader className="flex! flex-row items-start gap-3 p-4">
                    {control === "checkbox" ? (
                        <Checkbox
                            id={value}
                            checked={selected}
                            onCheckedChange={(checked) => {
                                onCheckedChange?.(checked === true)
                            }}
                            className={controlClassName}
                        />
                    ) : (
                        <RadioGroupItem
                            value={value}
                            id={value}
                            className={controlClassName}
                        />
                    )}

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

                    {onInfo ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-lg"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        onInfo()
                                    }}
                                    className={cn(
                                        "-mr-2.5 shrink-0 self-center rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-opacity",
                                        selected
                                            ? "opacity-100"
                                            : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100",
                                    )}
                                    aria-label={`Details for ${label}`}
                                >
                                    <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>View details</TooltipContent>
                        </Tooltip>
                    ) : null}
                </CardHeader>
            </Card>
        </Label>
    )
}
