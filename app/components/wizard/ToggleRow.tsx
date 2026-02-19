import { Switch } from "@/components/ui/switch"

export function ToggleRow({
    label,
    checked,
    onCheckedChange,
}: {
    label: string
    checked: boolean
    onCheckedChange: (value: boolean) => void
}) {
    return (
        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border/40 bg-card/40 p-4 backdrop-blur-sm transition-all hover:bg-card/60 hover:border-primary/20 hover:shadow-sm">
            <span className="font-medium text-foreground/90">{label}</span>
            <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </label>
    )
}
