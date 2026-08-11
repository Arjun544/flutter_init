import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export function SyncStatus({ syncing }: { syncing: boolean }) {
  return (
    <div
      className={cn(
        "flex h-7 items-center gap-1.5 rounded-md border px-2 text-xs font-medium sm:gap-2 sm:px-2.5",
        syncing
          ? "border-primary/25 bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground"
      )}
      aria-live="polite"
      aria-label={syncing ? "Syncing" : "Live"}
    >
      {syncing ? (
        <Spinner className="size-3.5 text-primary" />
      ) : (
        <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
      )}
      <span className="hidden sm:inline">{syncing ? "Syncing" : "Live"}</span>
    </div>
  )
}
