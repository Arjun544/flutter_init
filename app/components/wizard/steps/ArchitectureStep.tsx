"use client"

import { ArchitectureStyle, architectureOptions } from "@/app/lib/config/schema"
import { OptionTile } from "@/app/components/wizard/OptionTile"
import { StepGrid, StepPanel } from "@/app/components/wizard/StepPanel"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { RadioGroup } from "@/components/ui/radio-group"

export function ArchitectureStep() {
    const { config, updateConfig, setSelectedItem } = useWizard()

    return (
        <StepPanel
            title="Architecture"
            description="Pick how features and layers are organized. This shapes the folder structure of your scaffold."
        >
            <RadioGroup
                value={config.architecture}
                onValueChange={(value) => {
                    updateConfig({ architecture: value as ArchitectureStyle })
                }}
                className="w-full"
            >
                <StepGrid cols={2}>
                    {architectureOptions.map((option) => (
                        <OptionTile
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            description={option.description}
                            selected={config.architecture === option.value}
                            onInfo={() => setSelectedItem(option.value)}
                        />
                    ))}
                </StepGrid>
            </RadioGroup>
        </StepPanel>
    )
}
