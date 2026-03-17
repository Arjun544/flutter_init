"use client"

import { localizationOptions } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function LocalizationStep() {
    const { config, updateConfig, next, prev, setSelectedItem } = useWizard()

    const { enabled, supportedLocales } = config.localization

    const toggleEnabled = (checked: boolean) => {
        updateConfig({
            localization: {
                ...config.localization,
                enabled: checked,
            },
        })
    }

    const toggleLocale = (code: string) => {
        const set = new Set(supportedLocales)
        if (set.has(code)) {
            set.delete(code)
            // Enforce at least 1 locale if enabled
            if (set.size === 0) {
                set.add("en")
            }
        } else {
            set.add(code)
        }
        updateConfig({
            localization: {
                ...config.localization,
                supportedLocales: Array.from(set),
            },
        })
    }

    return (
        <Card className="border-border/40 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1.5">
                    <CardTitle className="bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent text-xl font-bold">Localization</CardTitle>
                    <CardDescription>
                        Set up internationalization (i18n) using easy_localization.
                    </CardDescription>
                </div>
                <Switch
                    checked={enabled}
                    onCheckedChange={toggleEnabled}
                    className="data-[state=checked]:bg-primary"
                />
            </CardHeader>
            <CardContent className="pt-6">
                <div className={`transition-all duration-300 ${enabled ? "opacity-100" : "opacity-50 pointer-events-none grayscale"}`}>
                    <div className="mb-4">
                        <p className="text-sm font-medium text-foreground">Supported Languages</p>
                        <p className="text-xs text-muted-foreground mt-1">Select the languages your app will support. At least one is required.</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {localizationOptions.map((locale) => {
                            const isChecked = supportedLocales.includes(locale.value)
                            return (
                                <label
                                    key={locale.value}
                                    className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all duration-200 hover:shadow-md
                                    ${isChecked
                                            ? 'border-primary/50 bg-primary/5 shadow-inner'
                                            : 'border-border/40 bg-card/30 hover:bg-card/50 hover:border-primary/20'
                                        }
                                `}
                                >
                                    <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={() => toggleLocale(locale.value)}
                                        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                    />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none text-foreground/90">{locale.label}</p>
                                        <p className="text-xs text-muted-foreground">{locale.value}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setSelectedItem(`localization_${locale.value}`)
                                        }}
                                        className="p-1 rounded-full hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors focus:outline-hidden cursor-pointer"
                                        title="View details"
                                    >
                                        <HugeiconsIcon icon={InformationCircleIcon} size={16} />
                                    </button>
                                </label>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
