"use client"

import { BackendProvider, backendOptions, defaultBackendConfig } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StepFooter } from "../StepFooter"
import { ToggleRow } from "../ToggleRow"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function BackendStep() {
    const { config, updateConfig, next, prev, setSelectedItem } = useWizard()

    const handleProviderChange = (provider: BackendProvider) => {
        updateConfig({
            backend: defaultBackendConfig(provider),
        })
    }

    const backend = config.backend

    const toggleOption = (key: string, value: boolean | string) => {
        if (backend.provider === "none") return
        const options = {
            ...(backend as any).options,
            [key]: value,
        }
        updateConfig({ backend: { ...backend, options } as any })
    }

    return (
        <Card className="border-border/40 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
                <CardTitle className="bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent text-xl font-bold">Backend & Auth</CardTitle>
                <CardDescription>
                    Choose a backend and toggle the integrations you need.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2 group">
                    <Label className="transition-colors group-focus-within:text-primary">Backend Provider</Label>
                    <Select
                        value={backend.provider}
                        onValueChange={(value) => handleProviderChange(value as BackendProvider)}
                    >
                        <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm border-border/60 focus:ring-2 focus:ring-primary/20 hover:border-primary/40">
                            <SelectValue placeholder="Select backend" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/90 backdrop-blur-xl border-border/50">
                            {backendOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center justify-between w-full">
                                        <span>{option.label}</span>
                                        <button
                                            type="button"
                                            onPointerDown={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setSelectedItem(option.value)
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setSelectedItem(option.value)
                                            }}
                                            className="p-1 -mr-1 rounded-full hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors focus:outline-hidden [&_svg]:pointer-events-auto z-10"
                                            title="View details"
                                        >
                                            <HugeiconsIcon icon={InformationCircleIcon} size={16} />
                                        </button>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    {backend.provider === "firebase" && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <ToggleRow
                                label="Email auth"
                                checked={(backend as any).options.authEmail}
                                onCheckedChange={(value) => toggleOption("authEmail", value)}
                            />
                            <ToggleRow
                                label="Google auth"
                                checked={(backend as any).options.authGoogle}
                                onCheckedChange={(value) => toggleOption("authGoogle", value)}
                            />
                            <ToggleRow
                                label="Phone auth"
                                checked={(backend as any).options.authPhone}
                                onCheckedChange={(value) => toggleOption("authPhone", value)}
                            />
                            <ToggleRow
                                label="Firestore"
                                checked={(backend as any).options.firestore}
                                onCheckedChange={(value) => toggleOption("firestore", value)}
                            />
                            <ToggleRow
                                label="Realtime DB"
                                checked={(backend as any).options.realtimeDb}
                                onCheckedChange={(value) => toggleOption("realtimeDb", value)}
                            />
                            <ToggleRow
                                label="Storage"
                                checked={(backend as any).options.storage}
                                onCheckedChange={(value) => toggleOption("storage", value)}
                            />
                            <ToggleRow
                                label="Analytics"
                                checked={(backend as any).options.analytics}
                                onCheckedChange={(value) => toggleOption("analytics", value)}
                            />
                            <ToggleRow
                                label="Crashlytics"
                                checked={(backend as any).options.crashlytics}
                                onCheckedChange={(value) => toggleOption("crashlytics", value)}
                            />
                        </div>
                    )}

                    {backend.provider === "supabase" && (
                        <div className="grid gap-4 md:grid-cols-3">
                            <ToggleRow
                                label="Auth"
                                checked={(backend as any).options.auth}
                                onCheckedChange={(value) => toggleOption("auth", value)}
                            />
                            <ToggleRow
                                label="Database"
                                checked={(backend as any).options.database}
                                onCheckedChange={(value) => toggleOption("database", value)}
                            />
                            <ToggleRow
                                label="Edge functions"
                                checked={(backend as any).options.edgeFunctions}
                                onCheckedChange={(value) => toggleOption("edgeFunctions", value)}
                            />
                        </div>
                    )}

                    {backend.provider === "appwrite" && (
                        <div className="grid gap-4 md:grid-cols-3">
                            <ToggleRow
                                label="Auth"
                                checked={(backend as any).options.auth}
                                onCheckedChange={(value) => toggleOption("auth", value)}
                            />
                            <ToggleRow
                                label="Database"
                                checked={(backend as any).options.database}
                                onCheckedChange={(value) => toggleOption("database", value)}
                            />
                            <ToggleRow
                                label="Storage"
                                checked={(backend as any).options.storage}
                                onCheckedChange={(value) => toggleOption("storage", value)}
                            />
                        </div>
                    )}

                    {backend.provider === "customRest" && (
                        <div className="space-y-2 group">
                            <Label htmlFor="baseUrl" className="transition-colors group-focus-within:text-primary">Base URL</Label>
                            <Input
                                id="baseUrl"
                                placeholder="https://api.example.com"
                                value={(backend as any).options.baseUrl ?? ""}
                                onChange={(e) => toggleOption("baseUrl", e.target.value)}
                                className="bg-background/50 backdrop-blur-sm transition-all focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    )}
                </div>
            </CardContent>
            <StepFooter onPrev={prev} onNext={next} />
        </Card>
    )
}
