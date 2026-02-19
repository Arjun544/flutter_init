
export function SummaryItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-border/40 bg-card/40 p-3 backdrop-blur-sm hover:bg-card/60 hover:border-border/60 transition-colors">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-foreground tracking-tight">{value}</span>
        </div>
    )
}
