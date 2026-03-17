import { Switch } from "@/components/ui/switch"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useWizard } from "@/app/lib/state/useWizardStore"

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

    return (
        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border/40 bg-card/40 p-4 backdrop-blur-sm transition-all hover:bg-card/60 hover:border-primary/20 hover:shadow-sm">
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground/90">{label}</span>
                    {badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider whitespace-nowrap">
                            {badge}
                        </span>
                    )}
                </div>
                {description && (
                    <span className="text-xs text-muted-foreground leading-relaxed italic">{description}</span>
                )}
            </div>
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
                <Switch 
                  checked={checked} 
                  onCheckedChange={onCheckedChange} 
                  disabled={disabled} 
                  aria-label={`Enable ${label}`}
                />
            </div>
        </label>
    )
}
