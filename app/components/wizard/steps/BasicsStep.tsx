"use client"

import { derivePackageId } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

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
                    <div className="flex items-center justify-between">
                        <Label htmlFor="appName" className="transition-colors group-focus-within:text-primary">App name</Label>
                        {config.appName && !/^[a-z][a-z0-9_]*$/.test(config.appName) && (
                            <button
                                onClick={() => {
                                    const fixed = config.appName
                                        .toLowerCase()
                                        .replace(/[^a-z0-9_]/g, "_")
                                        .replace(/_+/g, "_")
                                        .replace(/^_+|_+$/g, "");
                                    handleAppNameChange(fixed || "app_name");
                                }}
                                className="text-[10px] font-medium text-primary hover:underline cursor-pointer"
                            >
                                Auto-fix to snake_case
                            </button>
                        )}
                    </div>
                    <Input
                        id="appName"
                        value={config.appName}
                        onChange={(e) => handleAppNameChange(e.target.value)}
                        placeholder="my_flutter_app"
                        className={cn(
                            "bg-background/50 backdrop-blur-sm transition-all focus:bg-background/80 focus:ring-2 focus:ring-primary/20",
                            config.appName && !/^[a-z][a-z0-9_]*$/.test(config.appName) && "border-destructive/50 focus:ring-destructive/20"
                        )}
                    />
                    {config.appName && !/^[a-z][a-z0-9_]*$/.test(config.appName) && (
                        <p className="text-[11px] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                            Must be lowercase, start with a letter, and only contain letters, numbers, and underscores.
                        </p>
                    )}
                </div>
                <div className="group space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="packageId" className="transition-colors group-focus-within:text-primary">Package ID</Label>
                        {config.packageId && !/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(config.packageId) && (
                            <button
                                onClick={() => {
                                    const fixed = config.packageId
                                        .toLowerCase()
                                        .replace(/[^a-z0-9_.]/g, "_")
                                        .replace(/_+/g, "_")
                                        .replace(/\.+/g, ".")
                                        .replace(/^_+|_+$/g, "")
                                        .replace(/^\.+|\.+$/g, "");
                                    updateConfig({ packageId: fixed || "com.example.app" });
                                }}
                                className="text-[10px] font-medium text-primary hover:underline"
                            >
                                Auto-fix format
                            </button>
                        )}
                    </div>
                    <Input
                        id="packageId"
                        value={config.packageId}
                        onChange={(e) => updateConfig({ packageId: e.target.value })}
                        placeholder="com.example.my_app"
                        className={cn(
                            "font-mono text-sm bg-background/50 backdrop-blur-sm transition-all focus:bg-background/80 focus:ring-2 focus:ring-primary/20",
                            config.packageId && !/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(config.packageId) && "border-destructive/50 focus:ring-destructive/20"
                        )}
                    />
                    {config.packageId && !/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(config.packageId) && (
                        <p className="text-[11px] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                            Must be a valid reverse-domain identifier (e.g., com.example.my_app).
                        </p>
                    )}
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
        </Card>
    )
}
