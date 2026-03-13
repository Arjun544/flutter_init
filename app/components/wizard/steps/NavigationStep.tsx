"use client"

import { NavigationStyle, navigationOptions } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { StepFooter } from "../StepFooter"

export function NavigationStep() {
    const { config, updateConfig, next, prev, setSelectedItem } = useWizard()

    // Filter options based on state management selection
    const filteredOptions = navigationOptions.filter(option => {
        if (option.value === "getx") {
            return config.stateManagement === "getx"
        }
        return true
    })

    return (
        <Card className="border-border/40 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
                <CardTitle className="bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent text-xl font-bold">Navigation & Routing</CardTitle>
                <CardDescription>Select the routing strategy for your application.</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={config.navigation}
                    onValueChange={(value) => {
                        updateConfig({ navigation: value as NavigationStyle })
                    }}
                    className="grid gap-3"
                >
                    {filteredOptions.map((option) => {
                        const isSelected = config.navigation === option.value

                        return (
                            <label
                                key={option.value}
                                className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all duration-200
                                    ${isSelected
                                        ? 'border-primary/50 bg-primary/5 shadow-md shadow-primary/5 ring-1 ring-primary/20'
                                        : 'border-border/40 bg-card/30 hover:bg-card/50 hover:border-primary/20'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <RadioGroupItem value={option.value} id={option.value} className="text-primary border-primary" />
                                    <div className="space-y-1">
                                        <span className="font-semibold text-foreground/90">{option.label}</span>
                                        {option.value === 'go_router' && (
                                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Popular</span>
                                        )}
                                        <p className="text-xs text-muted-foreground">{option.description}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setSelectedItem(option.value)
                                    }}
                                    className="p-1.5 rounded-full hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors focus:outline-hidden"
                                    title="View details"
                                >
                                    <HugeiconsIcon icon={InformationCircleIcon} size={20} />
                                </button>
                            </label>
                        )
                    })}
                </RadioGroup>
            </CardContent>
            <StepFooter onPrev={prev} onNext={next} />
        </Card>
    )
}
