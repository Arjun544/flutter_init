"use client"

import { localizationOptions } from "@/app/lib/config/schema"
import { OptionTile } from "@/app/components/wizard/OptionTile"
import { StepGrid, StepPanel, StepSection } from "@/app/components/wizard/StepPanel"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export function LocalizationStep() {
    const { config, updateConfig, setSelectedItem } = useWizard()

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
        <StepPanel
            title="Localization"
            description="Set up internationalization with easy_localization and choose supported languages."
            actions={
                <label className="flex items-center gap-3 rounded-lg border border-border/50 px-3.5 py-2.5">
                    <span className="text-sm font-medium text-foreground">Enable i18n</span>
                    <Switch
                        checked={enabled}
                        onCheckedChange={toggleEnabled}
                        aria-label="Enable localization"
                    />
                </label>
            }
        >
            <StepSection
                title="Supported languages"
                description="Select at least one locale. English is kept if you deselect everything."
            >
                <div
                    className={cn(
                        "w-full transition-opacity duration-200",
                        !enabled && "pointer-events-none opacity-50"
                    )}
                >
                    <StepGrid cols={3}>
                        {localizationOptions.map((locale) => {
                            const isChecked = supportedLocales.includes(locale.value)
                            return (
                                <OptionTile
                                    key={locale.value}
                                    value={locale.value}
                                    label={locale.label}
                                    description={locale.description}
                                    selected={isChecked}
                                    control="checkbox"
                                    onCheckedChange={() => toggleLocale(locale.value)}
                                    onInfo={() =>
                                        setSelectedItem(`localization_${locale.value}`)
                                    }
                                />
                            )
                        })}
                    </StepGrid>
                </div>
            </StepSection>
        </StepPanel>
    )
}
