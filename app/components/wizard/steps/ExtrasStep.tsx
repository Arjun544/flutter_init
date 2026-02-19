"use client"

import { extrasOptions } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { StepFooter } from "../StepFooter"

export function ExtrasStep() {
    const { config, updateConfig, next, prev } = useWizard()

    const toggleExtra = (key: keyof typeof config.extras) => {
        updateConfig({
            extras: {
                ...config.extras,
                [key]: !config.extras[key],
            },
        })
    }

    return (
        <Card className="border-border/40 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
                <CardTitle className="bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent text-xl font-bold">Extras</CardTitle>
                <CardDescription>
                    Add production touches like i18n, splash screens, and flavors.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                {extrasOptions.map((extra) => {
                    const isChecked = config.extras[extra.key as keyof typeof config.extras];
                    return (
                        <label
                            key={extra.key}
                            className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:shadow-md
                            ${isChecked
                                    ? 'border-primary/50 bg-primary/5 shadow-inner'
                                    : 'border-border/40 bg-card/30 hover:bg-card/50 hover:border-primary/20'
                                }
                        `}
                        >
                            <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => toggleExtra(extra.key as keyof typeof config.extras)}
                                className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            <div className="space-y-1">
                                <p className="font-medium text-foreground/90">{extra.label}</p>
                                {extra.description ? (
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {extra.description}
                                    </p>
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
