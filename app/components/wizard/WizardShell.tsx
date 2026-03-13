"use client"

import { StepId, stepOrder } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import * as React from "react"
import { StepContent } from "./StepContent"
import { PackageInfoPanel } from "./PackageInfoPanel"

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
        description: "Choose theming, primary color, and dark mode.",
    },
    icons: {
        title: "Icons",
        description: "Select which icon packs to include.",
    },
    architecture: {
        title: "Architecture",
        description: "Choose how features are organized.",
    },
    state: {
        title: "State Management",
        description: "Pick one state management strategy.",
    },
    navigation: {
        title: "Navigation",
        description: "Select routing strategy.",
    },
    backend: {
        title: "Backend & Auth",
        description: "Configure backend integrations and auth.",
    },
    localization: {
        title: "Localization",
        description: "Setup easily with easy_localization.",
    },
    generate: {
        title: "Generate",
        description: "Review choices and download the scaffold.",
        actionLabel: "Generate",
    },
}

export function WizardShell() {
    const { step, setStep, stepIndex, isHydrated } = useWizard()
    const progress = React.useMemo(
        () => Math.round(((stepIndex + 1) / stepOrder.length) * 100),
        [stepIndex]
    )

    if (!isHydrated) {
        return (
            <main className="mx-auto flex min-h-screen items-center justify-center p-6 bg-background relative overflow-hidden mt-20">
                <div className="absolute inset-0 bg-linear-to-tr from-primary/10 via-background to-background -z-10" />
                <Card className="w-full max-w-xl border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Loading wizard</CardTitle>
                        <CardDescription>
                            Restoring your previous selections…
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={40} className="h-2 bg-primary/10" />
                    </CardContent>
                </Card>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background relative selection:bg-primary/20">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-20 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-secondary/20 via-background to-background -z-20 pointer-events-none" />
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 pointer-events-none" />

            <div className="mx-auto flex min-h-screen max-w-7xl gap-8 px-6 pt-32 pb-12 lg:gap-16">
                {/* Sidebar */}
                <aside className="hidden lg:block w-80 shrink-0 space-y-8 sticky top-12 h-fit">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                            Setup Wizard
                        </h1>
                        <Badge variant="outline" className="bg-background/50 backdrop-blur-sm border-primary/20 text-primary">1.0</Badge>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-primary/10" />
                    </div>

                    <nav className="space-y-1">
                        {stepOrder.map((id, index) => {
                            const isActive = id === step
                            const isCompleted = stepOrder.indexOf(id) < stepIndex

                            return (
                                <button
                                    key={id}
                                    onClick={() => setStep(id)}
                                    className={cn(
                                        "w-full group relative flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-300",
                                        isActive
                                            ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors border",
                                        isActive ? "bg-primary text-primary-foreground border-primary" :
                                            isCompleted ? "bg-muted text-muted-foreground border-transparent group-hover:border-border" : "bg-transparent border-border text-muted-foreground"
                                    )}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className={cn("text-sm font-medium", isActive && "font-bold")}>{steps[id].title}</span>
                                        </div>
                                        {isActive && (
                                            <p className="text-xs text-muted-foreground/80 mt-0.5 line-clamp-1 animate-in fade-in slide-in-from-left-1">
                                                {steps[id].description}
                                            </p>
                                        )}
                                    </div>
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                    )}
                                </button>
                            )
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <section className="flex-1 min-w-0 space-y-6">
                    <header className="lg:hidden mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Flutter scaffolder
                                </p>
                                <p className="text-xl font-bold">Setup Wizard</p>
                            </div>
                            <Badge variant="outline">Step {stepIndex + 1}/{stepOrder.length}</Badge>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </header>

                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-primary">
                                Step {stepIndex + 1} of {stepOrder.length}
                            </p>
                            <h2 className="text-3xl font-bold tracking-tight text-foreground">
                                {steps[step].title}
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                {steps[step].description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <StepContent step={step} />
                    </div>
                </section>

                {/* Right Panel */}
                <PackageInfoPanel />
            </div>
        </main>
    )
}
