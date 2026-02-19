"use client"

import { packageOptions } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { StepFooter } from "../StepFooter"

export function PackagesStep() {
    const { config, updateConfig, next, prev } = useWizard()

    const togglePackage = (key: keyof typeof config.commonPackages) => {
        updateConfig({
            commonPackages: {
                ...config.commonPackages,
                [key]: !config.commonPackages[key],
            },
        })
    }

    return (
        <Card className="border-border/40 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
                <CardTitle className="bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent text-xl font-bold">Common Packages</CardTitle>
                <CardDescription>Select the packages you want prewired.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                {packageOptions.map((pkg) => {
                    const isChecked = config.commonPackages[pkg.key as keyof typeof config.commonPackages];

                    return (
                        <label
                            key={pkg.key}
                            className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:shadow-md
                            ${isChecked
                                    ? 'border-primary/50 bg-primary/5 shadow-inner'
                                    : 'border-border/40 bg-card/30 hover:bg-card/50 hover:border-primary/20'
                                }
                        `}
                        >
                            <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => togglePackage(pkg.key as keyof typeof config.commonPackages)}
                                className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            <div className="space-y-1">
                                <p className="font-semibold text-foreground/90">{pkg.label}</p>
                                {pkg.description ? (
                                    <p className="text-xs text-muted-foreground leading-relaxed">{pkg.description}</p>
                                ) : null}
                            </div>
                        </label>
                    )
                })}
            </CardContent>
            <StepFooter onPrev={prev} onNext={next} />
        </Card>
    )
}
