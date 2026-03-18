"use client"

import { StepId, stepOrder } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import * as React from "react"
import { StepContent } from "./StepContent"
import { PackageInfoPanel } from "./PackageInfoPanel"
import { Separator } from "@/components/ui/separator"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft02Icon, ArrowRight02Icon, Tick01Icon } from "@hugeicons/core-free-icons"

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
    misc: {
        title: "Miscellaneous",
        description: "Configure additional packages and settings.",
    },
    generate: {
        title: "Generate",
        description: "Review choices and download the scaffold.",
        actionLabel: "Generate ZIP",
    },
}

export function WizardShell() {
    const { step, setStep, stepIndex, isHydrated, config } = useWizard()
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

    const progress = React.useMemo(
        () => Math.round(((stepIndex + 1) / stepOrder.length) * 100),
        [stepIndex]
    )

    const handleNext = async () => {
        if (stepIndex === stepOrder.length - 1) {
            await handleGenerate()
        } else if (stepIndex < stepOrder.length - 1) {
            setStep(stepOrder[stepIndex + 1])
        }
    }

    const handleBack = () => {
        if (stepIndex > 0) {
            setStep(stepOrder[stepIndex - 1])
        }
    }

    if (!isHydrated) {
        return (
            <main className="mx-auto flex min-h-dvh items-center justify-center p-6 bg-background relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-tr from-primary/10 via-background to-background -z-10" />
                <Card className="w-full max-w-xl border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Loading wizard</CardTitle>
                        <CardDescription>
                            Restoring your previous selections…
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={40} className="h-2 bg-primary/10" aria-label="Restoring session" />
                    </CardContent>
                </Card>
            </main>
        )
    }

    return (
        <SidebarProvider style={{ "--sidebar-width": "20rem" } as React.CSSProperties}>
            <WizardSidebar />

            {/* Main Content Area */}
            <SidebarInset className="min-w-0 relative flex flex-col min-h-dvh">
                {/* Background Details */}
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/5 via-background/0 to-background/0 -z-20 pointer-events-none" />
                <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-secondary/10 via-background/0 to-background/0 -z-20 pointer-events-none" />
                <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 pointer-events-none" />

                {/* Top Nav Bar */}
                <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-xl px-4 md:px-6">
                    <div className="flex items-center gap-4 overflow-hidden">
                        <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground hover:bg-muted" />
                        <Separator orientation="vertical" className="h-8" />

                        <span className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider">
                            Step {stepIndex + 1} of {stepOrder.length}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={stepIndex === 0 || isGenerating}
                            className="h-10 px-4 border-border/40 bg-background/50 shadow-sm cursor-pointer"
                        >
                            <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4 mr-1.5 hidden sm:block" />
                            <span className="hidden sm:inline">Back</span>
                            <span className="sm:hidden -mx-0.5">Prev</span>
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={isGenerating}
                            className={cn(
                                "h-10 px-5 shadow-sm cursor-pointer min-w-[100px]",
                                stepIndex === stepOrder.length - 1 && "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 font-semibold text-primary-foreground"
                            )}
                        >
                            {isGenerating ? (
                                "Generating…"
                            ) : stepIndex === stepOrder.length - 1 ? (
                                steps[step].actionLabel || "Finish"
                            ) : (
                                <>
                                    <span className="hidden sm:inline">Continue</span>
                                    <span className="sm:hidden -mx-0.5">Next</span>
                                    <HugeiconsIcon icon={ArrowRight02Icon} className="size-4 ml-1.5 sm:block" />
                                </>
                            )}
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto selection:bg-primary/20">
                    <main className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-10 pb-32">
                        {/* Step Content Area */}
                        <div className="relative fade-in animate-in slide-in-from-bottom-2 duration-500">
                            <h1 className="sr-only">Flutter Project Configuration Wizard - {steps[step].title}</h1>
                            <StepContent step={step} error={error} isGenerating={isGenerating} />
                        </div>
                    </main>
                </div>

                <PackageInfoPanel />
            </SidebarInset>
        </SidebarProvider>
    )
}

function WizardSidebar() {
    const { step, setStep, stepIndex } = useWizard()
    const { setOpenMobile, isMobile } = useSidebar()

    const progress = React.useMemo(
        () => Math.round(((stepIndex + 1) / stepOrder.length) * 100),
        [stepIndex]
    )

    return (
        <Sidebar variant="sidebar" className="border-r border-border/40 bg-background/50 backdrop-blur-xl">
            <SidebarHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                    <Image
                        src="/logo.svg"
                        alt="FlutterInit Logo"
                        width={24}
                        height={24}
                        className="h-6 w-6"
                        priority
                    />
                    <Badge variant="outline" className="ml-auto bg-background/50 backdrop-blur-sm border-primary/20 text-primary hover:bg-transparent">
                        1.0
                    </Badge>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2 py-4 no-scrollbar">
                <SidebarGroup>
                    <SidebarMenu>
                        {stepOrder.map((id, index) => {
                            const isActive = id === step
                            const isCompleted = stepOrder.indexOf(id) < stepIndex

                            return (
                                <SidebarMenuItem key={id}>
                                    <SidebarMenuButton
                                        isActive={isActive}
                                        onClick={() => {
                                            setStep(id)
                                            if (isMobile) setOpenMobile(false)
                                        }}
                                        size="lg"
                                        className={cn(
                                            "w-full justify-start h-auto py-3 px-3 relative transition-all duration-300 rounded-xl",
                                            isActive ? "bg-primary/10 ring-1 ring-primary/20 text-primary hover:bg-primary/15 hover:text-primary" : "text-muted-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-colors border shadow-xs",
                                                isActive
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : isCompleted
                                                        ? "bg-muted text-muted-foreground border-transparent"
                                                        : "bg-transparent border-input text-muted-foreground"
                                            )}
                                        >
                                            {isCompleted ? <HugeiconsIcon icon={Tick01Icon} className="size-4" strokeWidth={2.5} /> : index + 1}
                                        </div>
                                        <div className="flex flex-col items-start min-w-0">
                                            <span className={cn("text-sm transition-colors", isActive ? "font-bold text-foreground" : "font-medium")}>
                                                {steps[id].title}
                                            </span>
                                            {isActive && (
                                                <span className="text-xs opacity-80 text-left whitespace-normal leading-snug pt-0.5 animate-in fade-in slide-in-from-top-1 duration-300">
                                                    {steps[id].description}
                                                </span>
                                            )}
                                        </div>
                                        {isActive && (
                                            <div className="absolute absolute-y-center left-0 w-1 h-6 bg-primary rounded-r-full -ml-px" />
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-border/40">
                <div className="flex justify-between text-xs font-medium text-muted-foreground mb-2 px-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-muted/50" aria-label="Wizard progress" />
            </SidebarFooter>
        </Sidebar>
    )
}
