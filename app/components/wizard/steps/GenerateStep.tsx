"use client"

import { extrasOptions, packageOptions } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as React from "react"
import { SummaryItem } from "../SummaryItem"
// assuming icons are available or I'll remove them if not
// Wait, I saw lucide-react in package.json? No I didn't see it explicitly.
// But shadcn uses it. I'll check if lucide-react is installed.
// If uncertain, I'll avoid imports or use a safe fallback.
// In page.tsx no lucide icons were used.
// Let's stick to no icons to be safe, or just text.

export function GenerateStep() {
    const { config, prev } = useWizard()
    const [isGenerating, setIsGenerating] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const handleGenerate = async () => {
        setIsGenerating(true)
        setError(null)
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
            })

            if (!response.ok) {
                throw new Error("Failed to generate project")
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `${config.appName.replace(/\s+/g, "-").toLowerCase()}.zip`
            link.click()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Card className="border-border/40 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
                <CardTitle className="bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent text-xl font-bold">Review & Generate</CardTitle>
                <CardDescription>
                    Confirm your selections before generating the ZIP.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <SummaryItem label="App name" value={config.appName} />
                    <SummaryItem label="Package ID" value={config.packageId} />
                    <SummaryItem label="Theme" value={config.theme.preset} />
                    <SummaryItem label="Architecture" value={config.architecture} />
                    <SummaryItem label="State" value={config.stateManagement} />
                    <SummaryItem label="Navigation" value={config.navigation} />
                    <SummaryItem label="Backend" value={config.backend.provider} />
                </div>

                <div className="rounded-xl border border-border/40 bg-card/30 p-5 backdrop-blur-sm">
                    <p className="text-sm font-semibold mb-3">Packages</p>
                    <div className="flex flex-wrap gap-2">
                        {packageOptions
                            .filter((pkg) => config.commonPackages[pkg.key as keyof typeof config.commonPackages])
                            .map((pkg) => (
                                <Badge key={pkg.key} variant="secondary" className="bg-secondary/50 hover:bg-secondary/70 transition-colors">
                                    {pkg.label}
                                </Badge>
                            ))}
                        {Object.values(config.commonPackages).every(v => !v) && <span className="text-xs text-muted-foreground">None selected</span>}
                    </div>
                </div>

                <div className="rounded-xl border border-border/40 bg-card/30 p-5 backdrop-blur-sm">
                    <p className="text-sm font-semibold mb-3">Extras</p>
                    <div className="flex flex-wrap gap-2">
                        {extrasOptions
                            .filter((extra) => config.extras[extra.key as keyof typeof config.extras])
                            .map((extra) => (
                                <Badge key={extra.key} variant="secondary" className="bg-secondary/50 hover:bg-secondary/70 transition-colors">
                                    {extra.label}
                                </Badge>
                            ))}
                        {Object.values(config.extras).every(v => !v) && <span className="text-xs text-muted-foreground">None selected</span>}
                    </div>
                </div>

                {error ? (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                        Error: {error}
                    </div>
                ) : null}
            </CardContent>
            <CardContent className="flex items-center justify-between gap-4 border-t border-border/40 bg-muted/20 px-6 py-4 backdrop-blur-sm">
                <Button variant="ghost" onClick={prev} className="hover:bg-background/80 hover:shadow-sm">
                    Back
                </Button>
                <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 font-semibold text-primary-foreground min-w-[140px]"
                >
                    {isGenerating ? "Generating…" : "Generate ZIP"}
                </Button>
            </CardContent>
        </Card>
    )
}
