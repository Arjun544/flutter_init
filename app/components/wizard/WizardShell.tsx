"use client"

import { trackGeneration } from "@/app/lib/analytics/trackGeneration"
import cliPackage from "@/cli/package.json"
import { scaffoldConfigSchema, StepId, stepOrder } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { buildGenerateForm } from "@/app/components/wizard/code-editor/buildGenerateForm"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarInset,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import {
    AiImageIcon,
    ArrowLeft02Icon,
    ArrowRight02Icon,
    CloudIcon,
    Database01Icon,
    Globe02Icon,
    Layers01Icon,
    LinkSquare02Icon,
    PackageIcon,
    SourceCodeIcon,
    Tick01Icon,
    WrenchIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import * as React from "react"
import { PackageInfoPanel } from "./PackageInfoPanel"
import { StepContent } from "./StepContent"
import Link from "next/link"
import { Highlight, HighlightItem } from "@/components/animate-ui/primitives/effects/highlight"

const steps: Record<
    StepId,
    { title: string; description: string; actionLabel?: string; icon: typeof SourceCodeIcon }
> = {
    basics: {
        title: "Project basics",
        description: "Set the app name and identifiers.",
        icon: SourceCodeIcon,
    },
    theme: {
        title: "UI & theme",
        description: "Choose theming, primary color, and dark mode.",
        icon: AiImageIcon,
    },
    icons: {
        title: "Icons",
        description: "Select which icon packs to include.",
        icon: PackageIcon,
    },
    architecture: {
        title: "Architecture",
        description: "Choose how features are organized.",
        icon: Layers01Icon,
    },
    state: {
        title: "State Management",
        description: "Pick one state management strategy.",
        icon: Database01Icon,
    },
    navigation: {
        title: "Navigation",
        description: "Select routing strategy.",
        icon: LinkSquare02Icon,
    },
    backend: {
        title: "Backend & Auth",
        description: "Configure backend integrations and auth.",
        icon: CloudIcon,
    },
    localization: {
        title: "Localization",
        description: "Setup easily with easy_localization.",
        icon: Globe02Icon,
    },
    misc: {
        title: "Miscellaneous",
        description: "Configure additional packages and settings.",
        icon: WrenchIcon,
    },
    generate: {
        title: "Generate",
        description: "Review choices and download the scaffold.",
        actionLabel: "Generate ZIP",
        icon: Tick01Icon,
    },
}

export function WizardShell() {
    const { step, setStep, stepIndex, isHydrated, config, fontFiles } = useWizard()
    const [isGenerating, setIsGenerating] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const isValid = React.useMemo(() => {
        return scaffoldConfigSchema.safeParse(config).success
    }, [config])

    const handleGenerate = async () => {
        if (!isValid) {
            setError("Please fix the errors in your configuration before generating.")
            return
        }
        setIsGenerating(true)
        setError(null)
        try {
            void trackGeneration(config)

            // Use multipart/form-data so binary font blobs can be sent alongside
            // the JSON config without serialization issues.
            const form = buildGenerateForm(config, fontFiles)

            // Do NOT set Content-Type — browser sets it automatically with the
            // correct multipart boundary.
            const response = await fetch("/api/generate", {
                method: "POST",
                body: form,
            })

            if (!response.ok) {
                const body: unknown = await response.json().catch(() => ({}))
                const message =
                    typeof body === "object" &&
                    body !== null &&
                    "error" in body &&
                    typeof body.error === "string"
                        ? body.error
                        : "Failed to generate project"
                throw new Error(message)
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
                            asChild
                            disabled={!isValid || isGenerating}
                            className="hidden lg:inline-flex h-10 px-4 border-border/40 bg-background/50 shadow-xs cursor-pointer"
                        >
                            <Link
                                href={isValid ? "/create/code" : "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-disabled={!isValid || isGenerating}
                                className={cn((!isValid || isGenerating) && "pointer-events-none opacity-50")}
                            >
                                <HugeiconsIcon icon={SourceCodeIcon} className="size-4 mr-1.5" />
                                Preview code
                            </Link>
                        </Button>
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
                            disabled={isGenerating || (step === "generate" && !isValid)}
                            className={cn(
                                "h-10 px-5 shadow-sm cursor-pointer min-w-25",
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

                {/* Mobile floating preview — keeps header uncluttered on small screens */}
                <Button
                    asChild
                    disabled={!isValid || isGenerating}
                    className={cn(
                        "lg:hidden fixed z-40 bottom-6 right-4 h-12 gap-2 rounded-xl px-5",
                        "bg-primary text-primary-foreground shadow-lg",
                        "hover:bg-primary/90 active:scale-[0.98] transition-transform",
                        (!isValid || isGenerating) && "opacity-50"
                    )}
                >
                    <Link
                        href={isValid ? "/create/code" : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Preview code"
                        aria-disabled={!isValid || isGenerating}
                        className={cn((!isValid || isGenerating) && "pointer-events-none")}
                    >
                        <HugeiconsIcon icon={SourceCodeIcon} className="size-4" />
                        Preview
                    </Link>
                </Button>

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
            <SidebarHeader className="border-b border-border/40 p-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-sm transition-transform duration-200 hover:scale-105"
                    >
                        <Image
                            src="/logo.svg"
                            alt="FlutterInit Logo"
                            width={24}
                            height={24}
                            className="size-6"
                            priority
                        />
                    </Link>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                            FlutterInit
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                            Project generator
                        </p>
                    </div>
                    <Badge
                        variant="outline"
                        className="ml-auto shrink-0 border-primary/20 bg-background/60 px-2 py-0.5 text-[10px] font-mono text-primary"
                    >
                        v{cliPackage.version}
                    </Badge>
                </div>
            </SidebarHeader>

            <SidebarContent className="no-scrollbar px-3 py-5">
                <SidebarGroup className="p-0">
                    <div className="mb-3 flex items-center justify-between px-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                            Build your app
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground/60">
                            {String(stepIndex + 1).padStart(2, "0")} / {String(stepOrder.length).padStart(2, "0")}
                        </span>
                    </div>
                    <Highlight
                        as="ul"
                        mode="parent"
                        value={step}
                        controlledItems
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="pointer-events-none rounded-2xl border border-primary/15 bg-primary/10 shadow-sm shadow-primary/5 dark:bg-primary/15"
                        containerClassName="relative flex w-full flex-col gap-1"
                    >
                        {stepOrder.map((id) => {
                            const isActive = id === step
                            const isCompleted = stepOrder.indexOf(id) < stepIndex

                            return (
                                <HighlightItem key={id} value={id} asChild>
                                    <SidebarMenuItem className="relative z-10">
                                        <SidebarMenuButton
                                            isActive={isActive}
                                            onClick={() => {
                                                setStep(id)
                                                if (isMobile) setOpenMobile(false)
                                            }}
                                            size="lg"
                                            className={cn(
                                                "h-auto min-h-14 w-full justify-start gap-3 rounded-2xl border border-transparent bg-transparent px-3 py-2.5 transition-colors duration-200 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-primary/40",
                                                isActive
                                                    ? "text-foreground"
                                                    : "text-muted-foreground hover:text-foreground",
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "flex size-9 shrink-0 items-center justify-center rounded-xl border text-[10px] font-semibold shadow-xs transition-all duration-300",
                                                    isActive
                                                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                                        : isCompleted
                                                            ? "border-primary/20 bg-primary/10 text-primary"
                                                            : "border-border/80 bg-background/40 text-muted-foreground",
                                                )}
                                            >
                                                {isCompleted ? (
                                                    <HugeiconsIcon icon={Tick01Icon} size={17} strokeWidth={2.5} />
                                                ) : (
                                                    <HugeiconsIcon
                                                        icon={steps[id].icon}
                                                        size={isActive ? 17 : 15}
                                                        strokeWidth={isActive ? 2 : 1.8}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                                                <div className="flex w-full items-center gap-2">
                                                    <span
                                                        className={cn(
                                                            "truncate text-sm leading-tight transition-colors",
                                                            isActive ? "font-semibold" : "font-medium",
                                                        )}
                                                    >
                                                        {steps[id].title}
                                                    </span>
                                                </div>
                                                {isActive ? (
                                                    <span className="line-clamp-2 text-left text-[11px] leading-snug text-muted-foreground animate-in fade-in slide-in-from-top-1 duration-300">
                                                        {steps[id].description}
                                                    </span>
                                                ) : isCompleted ? (
                                                    <span className="text-[10px] font-medium text-primary/70">
                                                        Complete
                                                    </span>
                                                ) : null}
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </HighlightItem>
                            )
                        })}
                    </Highlight>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-border/40 p-3">
                <div className="rounded-2xl border border-border/50 bg-card/40 p-3.5 shadow-sm backdrop-blur-sm">
                    <div className="mb-2.5 flex items-end justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold text-foreground">Setup progress</p>
                            <p className="mt-0.5 text-[10px] text-muted-foreground">Your choices are saved locally.</p>
                        </div>
                        <span className="font-mono text-sm font-semibold tabular-nums text-primary">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <Progress value={progress} className="h-1.5 bg-muted/70" aria-label="Wizard progress" />
                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground/70">
                        <span>Stage {stepIndex + 1}</span>
                        <span>{stepOrder.length - stepIndex - 1} remaining</span>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
