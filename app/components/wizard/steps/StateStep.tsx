"use client"

import { StateManagement, stateManagementOptions } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { StepFooter } from "../StepFooter"

export function StateStep() {
    const { config, updateConfig, next, prev } = useWizard()

    return (
        <Card className="border-border/40 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
                <CardTitle className="bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent text-xl font-bold">State Management</CardTitle>
                <CardDescription>Select your preferred approach for managing application state.</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={config.stateManagement}
                    onValueChange={(value) => updateConfig({ stateManagement: value as StateManagement })}
                    className="grid gap-3"
                >
                    {stateManagementOptions.map((option) => (
                        <label
                            key={option.value}
                            className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all duration-200
                                ${config.stateManagement === option.value
                                    ? 'border-primary/50 bg-primary/5 shadow-md shadow-primary/5 ring-1 ring-primary/20'
                                    : 'border-border/40 bg-card/30 hover:bg-card/50 hover:border-primary/20'
                                }
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <RadioGroupItem value={option.value} className="text-primary border-primary" />
                                <div className="space-y-1">
                                    <span className="font-semibold text-foreground/90">{option.label}</span>
                                    <p className="text-xs text-muted-foreground">{option.description}</p>
                                </div>
                            </div>
                        </label>
                    ))}
                </RadioGroup>
            </CardContent>
            <StepFooter onPrev={prev} onNext={next} />
        </Card>
    )
}
