"use client"

import { derivePackageId } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StepFooter } from "../StepFooter"

export function BasicsStep() {
    const { config, updateConfig, next } = useWizard()

    const handleAppNameChange = (value: string) => {
        const derived = derivePackageId(value)
        updateConfig((prev) => ({
            ...prev,
            appName: value,
            packageId:
                prev.packageId === derivePackageId(prev.appName) ? derived : prev.packageId,
        }))
    }

    return (
        <Card className="border-border/40 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
                <CardTitle className="text-xl font-bold tracking-tight bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">Project basics</CardTitle>
                <CardDescription>
                    Name your app and set the package identifier.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="group space-y-2">
                    <Label htmlFor="appName" className="transition-colors group-focus-within:text-primary">App name</Label>
                    <Input
                        id="appName"
                        value={config.appName}
                        onChange={(e) => handleAppNameChange(e.target.value)}
                        placeholder="My Flutter App"
                        className="bg-background/50 backdrop-blur-sm transition-all focus:bg-background/80 focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div className="group space-y-2">
                    <Label htmlFor="packageId" className="transition-colors group-focus-within:text-primary">Package ID</Label>
                    <Input
                        id="packageId"
                        value={config.packageId}
                        onChange={(e) => updateConfig({ packageId: e.target.value })}
                        placeholder="com.example.my_app"
                        className="font-mono text-sm bg-background/50 backdrop-blur-sm transition-all focus:bg-background/80 focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div className="group space-y-2">
                    <Label htmlFor="description" className="transition-colors group-focus-within:text-primary">Description</Label>
                    <Textarea
                        id="description"
                        value={config.description ?? ""}
                        onChange={(e) => updateConfig({ description: e.target.value })}
                        placeholder="Short description for pubspec.yaml and README."
                        className="min-h-[100px] resize-none bg-background/50 backdrop-blur-sm transition-all focus:bg-background/80 focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </CardContent>
            <StepFooter onNext={next} />
        </Card>
    )
}
