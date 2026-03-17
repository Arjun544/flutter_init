"use client"

import { useWizard } from "@/app/lib/state/useWizardStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InformationCircleIcon, LinkSquare02Icon, PackageIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { fetchPackageMetrics } from "@/app/actions/pub"
import { Skeleton } from "@/components/ui/skeleton"

const PACKAGE_INFO: Record<string, {
    title: string;
    description?: string;
    packageName?: string;
    version?: string;
    publisher?: string;
    likes?: number;
    points?: number;
    downloads?: number;
    url?: string;
}> = {
    riverpod: {
        title: "Riverpod",
        packageName: "flutter_riverpod",
    },
    bloc: {
        title: "Bloc",
        packageName: "flutter_bloc",
    },
    getx: {
        title: "GetX",
        packageName: "get",
    },
    provider: {
        title: "Provider",
        packageName: "provider",
    },
    mobx: {
        title: "MobX",
        packageName: "flutter_mobx",
    },
    go_router: {
        title: "go_router",
        packageName: "go_router",
    },
    auto_route: {
        title: "auto_route",
        packageName: "auto_route",
    },
    firebase: {
        title: "Firebase",
        packageName: "firebase_core",
    },
    supabase: {
        title: "Supabase",
        packageName: "supabase_flutter",
    },
    appwrite: {
        title: "Appwrite",
        packageName: "appwrite",
    },
    iconsax_plus: {
        title: "Iconsax Plus",
        packageName: "iconsax_plus",
    },
    flutter_remix: {
        title: "Flutter Remix",
        packageName: "flutter_remix",
    },
    hugeicons: {
        title: "Hugeicons",
        packageName: "hugeicons",
    },
    geolocator: {
        title: "Geolocator",
        packageName: "geolocator",
    },
    default_flutter_icons: {
        title: "Default Flutter Icons",
        description: "The default Material Design icons provided natively by the Flutter SDK.",
    },
    clean: {
        title: "Clean Architecture",
        description: "Separates code into distinct layers (Presentation, Domain, Data) to ensure testability, maintainability, and independence from frameworks."
    },
    "feature-first": {
        title: "Feature-first Architecture",
        description: "Organizes code by feature instead of by layer. This makes scaling large projects easier by keeping related code together."
    },
    mvc: {
        title: "MVC Architecture",
        description: "Model-View-Controller architecture. Separates the application logic into three interconnected elements."
    },
    mvvm: {
        title: "MVVM Architecture",
        description: "Model-View-ViewModel architecture. Highly compatible with data-binding. Great for declarative UIs. In FlutterInit, this utilizes ViewModels (via Providers or Blocs) to handle presentation logic and cleanly supplies state to Views without a specific external package."
    },
    "layer-first": {
        title: "Layer-first Architecture",
        description: "Organizes code primarily by layers (models, views, controllers), rather than by features."
    },
    imperative: {
        title: "Imperative Routing",
        description: "Uses the standard Navigator 1.0. Simple configuration with direct generic push and pop."
    },
    "customRest": {
        title: "Custom REST",
        description: "Design your custom REST API client using http or dio package, ideal when you already have an existing backend."
    },
    none: {
        title: "None",
        description: "No specific package used. Uses native capabilities or default Flutter libraries."
    },
    theme_material3: {
        title: "Material 3",
        description: "The latest evolution of Google's Material Design system. It offers updated styling, vibrant dynamic colors, and better accessibility by default.",
    },
    theme_cupertino: {
        title: "Cupertino",
        description: "Replicates the iOS design language. Best suited if you are specifically targeting Apple platforms with native-looking widgets.",
    },
    theme_custom: {
        title: "Custom Theme",
        description: "A blank canvas allowing you to implement your own completely bespoke design system and styling from scratch without relying on pre-built design languages.",
    },
    localization_en: {
        title: "English Localization",
        description: "Provides built-in English translations and formatting options for your app.",
    },
    localization_es: {
        title: "Spanish Localization",
        description: "Provides built-in Spanish translations and formatting options for your app.",
    },
    localization_fr: {
        title: "French Localization",
        description: "Provides built-in French translations and formatting options for your app.",
    },
    localization_de: {
        title: "German Localization",
        description: "Provides built-in German translations and formatting options for your app.",
    },
    localization_it: {
        title: "Italian Localization",
        description: "Provides built-in Italian translations and formatting options for your app.",
    },
    localization_pt: {
        title: "Portuguese Localization",
        description: "Provides built-in Portuguese translations and formatting options for your app.",
    },
    localization_ru: {
        title: "Russian Localization",
        description: "Provides built-in Russian translations and formatting options for your app.",
    },
    localization_zh: {
        title: "Chinese Localization",
        description: "Provides built-in Chinese translations and formatting options for your app.",
    },
    localization_ja: {
        title: "Japanese Localization",
        description: "Provides built-in Japanese translations and formatting options for your app.",
    },
    localization_ar: {
        title: "Arabic Localization",
        description: "Provides built-in Arabic translations and formatting options for your app, including Right-to-Left (RTL) text support.",
    }
}

export function PackageInfoPanel() {
    const { selectedItem, setSelectedItem } = useWizard()
    const [fetchedMetrics, setFetchedMetrics] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    const open = !!selectedItem

    const staticInfo = selectedItem ? PACKAGE_INFO[selectedItem] || {
        title: selectedItem.charAt(0).toUpperCase() + selectedItem.slice(1).replace(/_/g, " "),
        description: "Specific details for this choice have not been provided.",
    } : PACKAGE_INFO['none'];

    useEffect(() => {
        if (open && staticInfo.packageName) {
            setIsLoading(true)
            fetchPackageMetrics(staticInfo.packageName).then((data) => {
                if (data) {
                    setFetchedMetrics(data)
                } else {
                    setFetchedMetrics(null)
                }
                setIsLoading(false)
            }).catch(() => {
                setFetchedMetrics(null)
                setIsLoading(false)
            })
        } else {
            setFetchedMetrics(null)
            setIsLoading(false)
        }
    }, [open, staticInfo.packageName])

    const info = {
        title: staticInfo.title,
        description: fetchedMetrics?.description || staticInfo.description,
        packageName: staticInfo.packageName,
        version: fetchedMetrics?.version || staticInfo.version,
        publisher: fetchedMetrics?.publisher || staticInfo.publisher,
        likes: fetchedMetrics?.likes || staticInfo.likes,
        points: fetchedMetrics?.points || staticInfo.points,
        downloads: fetchedMetrics?.downloads || staticInfo.downloads,
        url: staticInfo.packageName ? `https://pub.dev/packages/${staticInfo.packageName}` : staticInfo.url,
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) setSelectedItem(null)
        }}>
            <DialogContent className="max-w-md p-0 border-border/40 bg-background shadow-2xl sm:rounded-[32px] overflow-hidden">
                <div className="relative p-6 md:p-8 flex flex-col gap-6">
                    <DialogHeader className="pb-0">
                        <div className="flex items-start gap-5">
                            <div className="relative flex shrink-0 items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-primary/20 to-primary/5 border border-primary/20 shadow-inner group">
                                <div className="absolute inset-0 rounded-2xl bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[20px] pointer-events-none" />
                                {info.packageName ? (
                                    <HugeiconsIcon icon={PackageIcon} size={30} className="text-primary z-10 drop-shadow-md" />
                                ) : (
                                    <HugeiconsIcon icon={InformationCircleIcon} size={30} className="text-primary z-10 drop-shadow-md" />
                                )}
                            </div>
                            <div className="flex-1 space-y-1.5 pt-1">
                                <DialogTitle className="text-2xl font-black tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    {info.title}
                                </DialogTitle>
                                {info.packageName && (
                                    <div className="flex items-center">
                                        <span className="px-2.5 py-0.5 rounded-md bg-muted/60 border border-border/40 text-xs font-mono font-semibold text-muted-foreground shadow-xs">
                                            {info.packageName}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="w-full h-px bg-linear-to-r from-border/10 via-border/60 to-border/10" />

                    <div className="space-y-8">
                        {isLoading && info.packageName ? (
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[90%]" />
                                <Skeleton className="h-4 w-[80%]" />
                            </div>
                        ) : (
                            <p className="text-[15px] font-medium text-foreground/80 leading-relaxed tracking-wide">
                                {info.description}
                            </p>
                        )}

                        {info.packageName && (
                            <div className="grid grid-cols-2 gap-3">
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-[68px] w-full rounded-2xl" />
                                        <Skeleton className="h-[68px] w-full rounded-2xl" />
                                        <Skeleton className="h-[68px] w-full rounded-2xl" />
                                        <Skeleton className="h-[68px] w-full rounded-2xl" />
                                        <Skeleton className="h-[68px] w-full rounded-2xl col-span-2" />
                                    </>
                                ) : (
                                    <>
                                        {info.version && (
                                            <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-card border border-border/50 shadow-sm transition-colors group">
                                                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase group-hover:text-primary transition-colors">Version</span>
                                                <span className="font-mono text-sm font-semibold text-foreground/90">{info.version}</span>
                                            </div>
                                        )}
                                        {info.points && (
                                            <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-card border border-border/50 shadow-sm transition-colors group">
                                                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors">Pub points</span>
                                                <span className="font-mono text-sm font-semibold text-foreground/90">{info.points}/160</span>
                                            </div>
                                        )}
                                        {info.likes && (
                                            <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-card border border-border/50 shadow-sm transition-colors group">
                                                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors">Likes</span>
                                                <span className="text-sm font-bold text-foreground/90">{info.likes.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {info.downloads && (
                                            <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-card border border-border/50 shadow-sm transition-colors group">
                                                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors">Downloads</span>
                                                <span className="text-sm font-bold text-foreground/90">{info.downloads.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {info.publisher && (
                                            <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-card border border-border/50 shadow-sm transition-colors col-span-2 group">
                                                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors">Publisher</span>
                                                <span className="text-sm font-semibold text-primary/90">
                                                    {info.publisher}
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {info.url && (
                            <div className="pt-2">
                                <Link
                                    href={info.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold tracking-wide transition-all hover:shadow-[0_0_30px_-5px] hover:shadow-primary/40 active:scale-[0.98] overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform ease-in-out" />
                                    <span className="relative z-10">View on pub.dev</span>
                                    <HugeiconsIcon icon={LinkSquare02Icon} size={18} className="relative z-10 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
