"use client"

import { useWizard } from "@/app/lib/state/useWizardStore"
import { StepGrid, StepPanel, StepSection } from "@/app/components/wizard/StepPanel"
import { ToggleRow } from "@/app/components/wizard/ToggleRow"
import { Badge } from "@/components/ui/badge"

export function IconsStep() {
    const { config, updateConfig } = useWizard()
    const { icons } = config

    const handleToggle = (
        key: "iconsax_plus" | "flutter_remix" | "hugeicons",
        value: boolean
    ) => {
        updateConfig({
            icons: {
                ...icons,
                iconsax_plus: key === "iconsax_plus" ? value : false,
                flutter_remix: key === "flutter_remix" ? value : false,
                hugeicons: key === "hugeicons" ? value : false,
            },
        })
    }

    const selectedIcons = [
        "Default",
        icons.iconsax_plus && "Iconsax Plus",
        icons.flutter_remix && "Flutter Remix",
        icons.hugeicons && "Hugeicons",
    ].filter(Boolean) as string[]

    return (
        <StepPanel
            title="Icons"
            description="Include Material by default, then optionally add one extra icon pack."
            actions={
                <div className="flex flex-wrap items-center gap-1.5">
                    {selectedIcons.map((name) => (
                        <Badge key={name} variant="secondary" className="font-medium">
                            {name}
                        </Badge>
                    ))}
                </div>
            }
        >
            <StepSection
                title="Icon packs"
                description="Only one third-party pack can be active at a time."
            >
                <StepGrid cols={2}>
                    <ToggleRow
                        label="Default Flutter icons"
                        description="Material icons ship with every Flutter project."
                        checked
                        onCheckedChange={() => {}}
                        disabled
                    />
                    <ToggleRow
                        label="Iconsax Plus"
                        description="Clean icons in linear and bold styles."
                        checked={icons.iconsax_plus}
                        onCheckedChange={(value) => handleToggle("iconsax_plus", value)}
                    />
                    <ToggleRow
                        label="Flutter Remix"
                        description="2,200+ neutral system symbols."
                        checked={icons.flutter_remix}
                        onCheckedChange={(value) => handleToggle("flutter_remix", value)}
                    />
                    <ToggleRow
                        label="Hugeicons"
                        description="3,800+ icons across five styles."
                        checked={icons.hugeicons}
                        onCheckedChange={(value) => handleToggle("hugeicons", value)}
                    />
                </StepGrid>
            </StepSection>
        </StepPanel>
    )
}
