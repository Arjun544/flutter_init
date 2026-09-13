"use client"

import { NavigationStyle, navigationOptions } from "@/app/lib/config/schema"
import { OptionTile } from "@/app/components/wizard/OptionTile"
import { StepGrid, StepPanel } from "@/app/components/wizard/StepPanel"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { RadioGroup } from "@/components/ui/radio-group"

export function NavigationStep() {
    const { config, updateConfig, setSelectedItem } = useWizard()

    const filteredOptions = navigationOptions.filter((option) => {
        if (config.stateManagement === "getx") {
            return option.value === "getx"
        }
        return option.value !== "getx"
    })

    return (
        <StepPanel
            title="Navigation"
            description="Select the routing strategy for deep links, stacks, and screen transitions."
        >
            <RadioGroup
                value={config.navigation}
                onValueChange={(value) => {
                    updateConfig({ navigation: value as NavigationStyle })
                }}
                className="w-full"
            >
                <StepGrid cols={2}>
                    {filteredOptions.map((option) => (
                        <OptionTile
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            description={option.description}
                            selected={config.navigation === option.value}
                            badge={option.value === "go_router" ? "Popular" : undefined}
                            onInfo={() => setSelectedItem(option.value)}
                        />
                    ))}
                </StepGrid>
            </RadioGroup>
        </StepPanel>
    )
}
