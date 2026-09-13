"use client"

import { StateManagement, stateManagementOptions } from "@/app/lib/config/schema"
import { OptionTile } from "@/app/components/wizard/OptionTile"
import { StepGrid, StepPanel } from "@/app/components/wizard/StepPanel"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { RadioGroup } from "@/components/ui/radio-group"

export function StateStep() {
    const { config, updateConfig, setSelectedItem } = useWizard()

    return (
        <StepPanel
            title="State management"
            description="Choose one strategy for app state. This also influences which navigation packages stay compatible."
        >
            <RadioGroup
                value={config.stateManagement}
                onValueChange={(value) => {
                    const stateManagement = value as StateManagement
                    const updates: Record<string, unknown> = { stateManagement }

                    if (stateManagement === "riverpod") {
                        updates.misc = {
                            ...config.misc,
                            usesFlutterHooks: true,
                        }
                    }

                    if (stateManagement === "getx") {
                        updates.navigation = "getx"
                    } else if (config.navigation === "getx") {
                        updates.navigation = "go_router"
                    }

                    updateConfig(updates)
                }}
                className="w-full"
            >
                <StepGrid cols={2}>
                    {stateManagementOptions.map((option) => (
                        <OptionTile
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            description={option.description}
                            selected={config.stateManagement === option.value}
                            onInfo={() => setSelectedItem(option.value)}
                        />
                    ))}
                </StepGrid>
            </RadioGroup>
        </StepPanel>
    )
}
