"use client"

import * as React from "react"

import {
    architectureOptions,
    ArchitectureStyle,
    backendOptions,
    BackendProvider,
    defaultBackendConfig,
    derivePackageId,
    extrasOptions,
    packageOptions,
    StateManagement,
    stateManagementOptions,
    StepId,
    stepOrder,
    ThemePreset,
} from "@/app/lib/config/schema"
import { useWizard, WizardProvider } from "@/app/lib/state/useWizardStore"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const steps: Record<
    StepId,
    { title: string; description: string; actionLabel?: string }
> = {
    basics: {
        title: "Project basics",
        description: "Set the app name and identifiers.",
    },
    theme: {
        title: "UI & theme",
        description: "Choose theming, fonts, and dark mode.",
    },
    state: {
        title: "State management",
        description: "Pick one state management strategy.",
    },
    backend: {
        title: "Backend & auth",
        description: "Configure backend integrations and auth.",
    },
    packages: {
        title: "Common packages",
        description: "Select routing, networking, and utilities.",
    },
    architecture: {
        title: "Architecture",
        description: "Choose how features are organized.",
    },
    extras: {
        title: "Extras",
        description: "Add polish like i18n, splash, and flavors.",
    },
    generate: {
        title: "Generate",
        description: "Review choices and download the scaffold.",
        actionLabel: "Generate",
    },
}

export default function Page() {
    return (
        <WizardProvider>
            <WizardShell />
        </WizardProvider>
    )
}

function WizardShell() {
    const { step, setStep, stepIndex, isHydrated } = useWizard()
    const progress = React.useMemo(
        () => Math.round(((stepIndex + 1) / stepOrder.length) * 100),
        [stepIndex]
    )

    if (!isHydrated) {
        return (
            <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
                <Card className="w-full max-w-xl">
                    <CardHeader>
                        <CardTitle>Loading wizard</CardTitle>
                        <CardDescription>
                            Restoring your previous selections…
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={40} />
                    </CardContent>
                </Card>
            </main>
        )
    }

    return (
        <main className="mx-auto flex min-h-screen max-w-6xl gap-6 px-6 py-10">
            <aside className="w-72 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Flutter scaffolder
                        </p>
                        <p className="text-lg font-semibold">Setup wizard</p>
                    </div>
                    <Badge variant="outline">shadcn/ui</Badge>
                </div>

                <Progress value={progress} />
                <div className="space-y-2">
                    {stepOrder.map((id) => {
                        const active = id === step
                        return (
                            <button
                                key={id}
                                onClick={() => setStep(id)}
                                className={cn(
                                    "w-full rounded-lg border px-3 py-2 text-left transition-colors",
                                    active
                                        ? "border-primary/40 bg-primary/5 text-primary"
                                        : "border-border hover:border-primary/40 hover:bg-muted/60"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold">{steps[id].title}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {id === step ? "In progress" : ""}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {steps[id].description}
                                </p>
                            </button>
                        )
                    })}
                </div>
            </aside>

            <section className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Step {stepIndex + 1} of {stepOrder.length}
                        </p>
                        <h1 className="text-2xl font-semibold leading-tight">
                            {steps[step].title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {steps[step].description}
                        </p>
                    </div>
                </div>

                <StepContent step={step} />
            </section>
        </main>
    )
}

function StepContent({ step }: { step: StepId }) {
    switch (step) {
        case "basics":
            return <BasicsStep />
        case "theme":
            return <ThemeStep />
        case "state":
            return <StateStep />
        case "backend":
            return <BackendStep />
        case "packages":
            return <PackagesStep />
        case "architecture":
            return <ArchitectureStep />
        case "extras":
            return <ExtrasStep />
        case "generate":
        default:
            return <GenerateStep />
    }
}

function BasicsStep() {
    const { config, updateConfig, next } = useWizard()

    const handleAppNameChange = (value: string) => {
        const derived = derivePackageId(value)
        updateConfig((prev) => ({
            appName: value,
            packageId:
                prev.packageId === derivePackageId(prev.appName) ? derived : prev.packageId,
        }))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Project basics</CardTitle>
                <CardDescription>
                    Name your app and set the package identifier.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="appName">App name</Label>
                    <Input
                        id="appName"
                        value={config.appName}
                        onChange={(e) => handleAppNameChange(e.target.value)}
                        placeholder="My Flutter App"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="packageId">Package ID</Label>
                    <Input
                        id="packageId"
                        value={config.packageId}
                        onChange={(e) => updateConfig({ packageId: e.target.value })}
                        placeholder="com.example.my_app"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={config.description ?? ""}
                        onChange={(e) => updateConfig({ description: e.target.value })}
                        placeholder="Short description for pubspec.yaml and README."
                    />
                </div>
            </CardContent>
            <StepFooter onNext={next} />
        </Card>
    )
}

function ThemeStep() {
    const { config, updateConfig, next, prev } = useWizard()
    const { theme } = config

    return (
        <Card>
            <CardHeader>
                <CardTitle>UI & theme</CardTitle>
                <CardDescription>
                    Choose your design system, dark mode, and fonts.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Theme</Label>
                        <Select
                            value={theme.preset}
                            onValueChange={(value) =>
                                updateConfig({ theme: { ...theme, preset: value as ThemePreset } })
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="material3">Material 3</SelectItem>
                                <SelectItem value="cupertino">Cupertino</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="primaryColor">Primary color</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="primaryColor"
                                value={theme.primaryColor ?? ""}
                                onChange={(e) =>
                                    updateConfig({ theme: { ...theme, primaryColor: e.target.value } })
                                }
                                placeholder="#6750A4"
                            />
                            <Input
                                type="color"
                                className="h-10 w-16 p-1"
                                value={theme.primaryColor ?? "#6750A4"}
                                onChange={(e) =>
                                    updateConfig({ theme: { ...theme, primaryColor: e.target.value } })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Dark mode</p>
                                <p className="text-sm text-muted-foreground">
                                    Support system and manual toggle.
                                </p>
                            </div>
                            <Switch
                                checked={theme.darkMode.enabled}
                                onCheckedChange={(checked) =>
                                    updateConfig({ theme: { ...theme, darkMode: { ...theme.darkMode, enabled: checked } } })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Follow system</p>
                            <Switch
                                checked={theme.darkMode.system}
                                onCheckedChange={(checked) =>
                                    updateConfig({ theme: { ...theme, darkMode: { ...theme.darkMode, system: checked } } })
                                }
                                disabled={!theme.darkMode.enabled}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Font</p>
                                <p className="text-sm text-muted-foreground">
                                    Use default or a Google Font.
                                </p>
                            </div>
                            <Select
                                value={theme.font.choice}
                                onValueChange={(value) =>
                                    updateConfig({ theme: { ...theme, font: { ...theme.font, choice: value as "default" | "google" } } })
                                }
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Default</SelectItem>
                                    <SelectItem value="google">Google Fonts</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {theme.font.choice === "google" && (
                            <div className="space-y-2">
                                <Label htmlFor="fontFamily">Font family</Label>
                                <Input
                                    id="fontFamily"
                                    value={theme.font.family ?? ""}
                                    onChange={(e) =>
                                        updateConfig({
                                            theme: { ...theme, font: { ...theme.font, family: e.target.value } },
                                        })
                                    }
                                    placeholder="e.g. Inter"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            <StepFooter onPrev={prev} onNext={next} />
        </Card>
    )
}

function StateStep() {
    const { config, updateConfig, next, prev } = useWizard()
    return (
        <Card>
            <CardHeader>
                <CardTitle>State management</CardTitle>
                <CardDescription>Select one approach.</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={config.stateManagement}
                    onValueChange={(value) => updateConfig({ stateManagement: value as StateManagement })}
                >
                    {stateManagementOptions.map((option) => (
                        <label
                            key={option.value}
                            className="flex items-center justify-between rounded-lg border p-3 hover:border-primary/60"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value={option.value} />
                                    <span className="font-medium">{option.label}</span>
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

function BackendStep() {
    const { config, updateConfig, next, prev } = useWizard()

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
        <Card>
            <CardHeader>
                <CardTitle>Backend & auth</CardTitle>
                <CardDescription>
                    Choose a backend and toggle the integrations you need.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Backend</Label>
                    <Select
                        value={backend.provider}
                        onValueChange={(value) => handleProviderChange(value as BackendProvider)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select backend" />
                        </SelectTrigger>
                        <SelectContent>
                            {backendOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

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
                    <div className="space-y-2">
                        <Label htmlFor="baseUrl">Base URL</Label>
                        <Input
                            id="baseUrl"
                            placeholder="https://api.example.com"
                            value={(backend as any).options.baseUrl ?? ""}
                            onChange={(e) => toggleOption("baseUrl", e.target.value)}
                        />
                    </div>
                )}
            </CardContent>
            <StepFooter onPrev={prev} onNext={next} />
        </Card>
    )
}

function PackagesStep() {
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
        <Card>
            <CardHeader>
                <CardTitle>Common packages</CardTitle>
                <CardDescription>Select the packages you want prewired.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
                {packageOptions.map((pkg) => (
                    <label
                        key={pkg.key}
                        className="flex items-start gap-3 rounded-lg border p-3 hover:border-primary/60"
                    >
                        <Checkbox
                            checked={config.commonPackages[pkg.key]}
                            onCheckedChange={() => togglePackage(pkg.key)}
                        />
                        <div>
                            <p className="font-medium">{pkg.label}</p>
                            {pkg.description ? (
                                <p className="text-xs text-muted-foreground">{pkg.description}</p>
                            ) : null}
                        </div>
                    </label>
                ))}
            </CardContent>
            <StepFooter onPrev={prev} onNext={next} />
        </Card>
    )
}

function ArchitectureStep() {
    const { config, updateConfig, next, prev } = useWizard()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Architecture style</CardTitle>
                <CardDescription>Pick how folders are structured.</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={config.architecture}
                    onValueChange={(value) =>
                        updateConfig({ architecture: value as ArchitectureStyle })
                    }
                >
                    {architectureOptions.map((option) => (
                        <label
                            key={option.value}
                            className="flex items-center justify-between rounded-lg border p-3 hover:border-primary/60"
                        >
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value={option.value} />
                                <span className="font-medium">{option.label}</span>
                            </div>
                        </label>
                    ))}
                </RadioGroup>
            </CardContent>
            <StepFooter onPrev={prev} onNext={next} />
        </Card>
    )
}

function ExtrasStep() {
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
        <Card>
            <CardHeader>
                <CardTitle>Extras</CardTitle>
                <CardDescription>
                    Add production touches like i18n, splash, and flavors.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
                {extrasOptions.map((extra) => (
                    <label
                        key={extra.key}
                        className="flex items-start gap-3 rounded-lg border p-3 hover:border-primary/60"
                    >
                        <Checkbox
                            checked={config.extras[extra.key]}
                            onCheckedChange={() => toggleExtra(extra.key)}
                        />
                        <div>
                            <p className="font-medium">{extra.label}</p>
                            {extra.description ? (
                                <p className="text-xs text-muted-foreground">
                                    {extra.description}
                                </p>
                            ) : null}
                        </div>
                    </label>
                ))}
            </CardContent>
            <StepFooter onPrev={prev} onNext={next} />
        </Card>
    )
}

function GenerateStep() {
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
        <Card>
            <CardHeader>
                <CardTitle>Review & generate</CardTitle>
                <CardDescription>
                    Confirm your selections before generating the ZIP.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <SummaryItem label="App name" value={config.appName} />
                <SummaryItem label="Package ID" value={config.packageId} />
                <SummaryItem label="Theme" value={config.theme.preset} />
                <SummaryItem label="State" value={config.stateManagement} />
                <SummaryItem label="Backend" value={config.backend.provider} />
                <SummaryItem label="Architecture" value={config.architecture} />

                <div className="rounded-lg border p-4">
                    <p className="text-sm font-semibold">Packages</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {packageOptions
                            .filter((pkg) => config.commonPackages[pkg.key])
                            .map((pkg) => (
                                <Badge key={pkg.key} variant="outline">
                                    {pkg.label}
                                </Badge>
                            ))}
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <p className="text-sm font-semibold">Extras</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {extrasOptions
                            .filter((extra) => config.extras[extra.key])
                            .map((extra) => (
                                <Badge key={extra.key} variant="outline">
                                    {extra.label}
                                </Badge>
                            ))}
                    </div>
                </div>

                {error ? (
                    <p className="text-sm text-destructive">Error: {error}</p>
                ) : null}
            </CardContent>
            <CardContent className="flex items-center justify-between gap-2 border-t pt-4">
                <Button variant="ghost" onClick={prev}>
                    Back
                </Button>
                <Button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? "Generating…" : "Generate ZIP"}
                </Button>
            </CardContent>
        </Card>
    )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    )
}

function ToggleRow({
    label,
    checked,
    onCheckedChange,
}: {
    label: string
    checked: boolean
    onCheckedChange: (value: boolean) => void
}) {
    return (
        <div className="flex items-center justify-between rounded-lg border p-3">
            <span>{label}</span>
            <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    )
}

function StepFooter({
    onPrev,
    onNext,
}: {
    onPrev?: () => void
    onNext?: () => void
}) {
    return (
        <CardContent className="flex items-center justify-between gap-3 border-t pt-4">
            <Button variant="ghost" onClick={onPrev} disabled={!onPrev}>
                Back
            </Button>
            <Button onClick={onNext} disabled={!onNext}>
                Continue
            </Button>
        </CardContent>
    )
}