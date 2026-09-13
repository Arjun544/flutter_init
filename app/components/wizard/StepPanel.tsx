import { cn } from "@/lib/utils"
import * as React from "react"

export function StepPanel({
    title,
    description,
    children,
    actions,
    className,
}: {
    title: string
    description?: string
    children: React.ReactNode
    actions?: React.ReactNode
    className?: string
}) {
    return (
        <section
            className={cn(
                "flex w-full flex-1 flex-col items-start gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300",
                className
            )}
        >
            <header className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex max-w-2xl flex-col items-start gap-1.5">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
                        {title}
                    </h2>
                    {description ? (
                        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                            {description}
                        </p>
                    ) : null}
                </div>
                {actions ? (
                    <div className="flex shrink-0 items-center gap-2">{actions}</div>
                ) : null}
            </header>
            <div className="flex w-full flex-1 flex-col items-start gap-8">{children}</div>
        </section>
    )
}

export function StepSection({
    title,
    description,
    children,
    className,
    action,
}: {
    title?: string
    description?: string
    children: React.ReactNode
    className?: string
    action?: React.ReactNode
}) {
    return (
        <div className={cn("flex w-full flex-col items-start gap-4", className)}>
            {(title || description || action) && (
                <div className="flex w-full items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-col gap-1">
                        {title ? (
                            <h3 className="text-sm font-semibold tracking-tight text-foreground">
                                {title}
                            </h3>
                        ) : null}
                        {description ? (
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        ) : null}
                    </div>
                    {action}
                </div>
            )}
            {children}
        </div>
    )
}

export function StepGrid({
    children,
    cols = "auto",
    className,
}: {
    children: React.ReactNode
    cols?: "auto" | 1 | 2 | 3 | 4
    className?: string
}) {
    return (
        <div
            className={cn(
                "grid w-full gap-3",
                cols === "auto" &&
                    "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
                cols === 1 && "grid-cols-1",
                cols === 2 && "grid-cols-1 sm:grid-cols-2",
                cols === 3 && "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
                cols === 4 && "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
                className
            )}
        >
            {children}
        </div>
    )
}
