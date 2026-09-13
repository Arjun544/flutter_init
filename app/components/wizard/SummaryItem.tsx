import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function SummaryItem({
    label,
    value,
    error,
}: {
    label: string
    value: string
    error?: boolean
}) {
    return (
        <div
            className={cn(
                "flex min-h-12 items-center justify-between gap-3 border-b border-border/50 py-3",
                error && "text-destructive"
            )}
        >
            <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
            <span
                className={cn(
                    "truncate text-right text-sm font-medium tracking-tight",
                    error ? "text-destructive" : "text-foreground"
                )}
            >
                {value}
            </span>
        </div>
    )
}

export function SummaryTagItem({ label, tags }: { label: string; tags: string[] }) {
    return (
        <div className="flex flex-col gap-2 border-b border-border/50 py-3 last:border-b-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="font-medium text-foreground/80"
                    >
                        {tag}
                    </Badge>
                ))}
            </div>
        </div>
    )
}
