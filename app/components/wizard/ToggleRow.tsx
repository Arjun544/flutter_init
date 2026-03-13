import { Switch } from "@/components/ui/switch"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useWizard } from "@/app/lib/state/useWizardStore"

export function ToggleRow({
    label,
    checked,
    onCheckedChange,
    disabled,
    infoKey,
}: {
    label: string
    checked: boolean
    onCheckedChange: (value: boolean) => void
    disabled?: boolean
    infoKey?: string
}) {
    const { setSelectedItem } = useWizard()

    return (
        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border/40 bg-card/40 p-4 backdrop-blur-sm transition-all hover:bg-card/60 hover:border-primary/20 hover:shadow-sm">
            <span className="font-medium text-foreground/90">{label}</span>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const key = infoKey || label.toLowerCase().replace(/\s+/g, '_')
                        setSelectedItem(key)
                    }}
                    className="p-1.5 rounded-full hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors focus:outline-hidden"
                    title="View details"
                >
                    <HugeiconsIcon icon={InformationCircleIcon} size={18} />
                </button>
                <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
            </div>
        </label>
    )
}
