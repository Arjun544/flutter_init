import { cn } from "@/lib/utils"

export function SummaryItem({ label, value, error }: { label: string; value: string; error?: boolean }) {
    return (
        <div className={cn(
            "flex items-center justify-between rounded-lg border border-border/40 bg-card/40 p-3 backdrop-blur-sm transition-colors",
            error ? "border-destructive/50 bg-destructive/5" : "hover:bg-card/60 hover:border-border/60"
        )}>
            <span className="text-sm text-muted-foreground shrink-0">{label}</span>
            <span className={cn(
                "text-sm font-medium tracking-tight text-right",
                error ? "text-destructive" : "text-foreground"
            )}>{value}</span>
        </div>
    )
}

export function SummaryTagItem({ label, tags }: { label: string; tags: string[] }) {
    return (
        <div className="flex flex-col gap-2 rounded-lg border border-border/40 bg-card/40 p-3 backdrop-blur-sm hover:bg-card/60 hover:border-border/60 transition-colors">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center rounded-md border border-border/50 bg-muted/60 px-2 py-0.5 text-xs font-medium text-foreground/80 backdrop-blur-sm"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    )
}
