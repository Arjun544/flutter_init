"use client"

import { useWizard } from "@/app/lib/state/useWizardStore"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InformationCircleIcon, LinkSquare02Icon, PackageIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

const PACKAGE_INFO: Record<string, {
    title: string;
    description: string;
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
        description: "A reactive caching and data-binding framework. Riverpod makes working with asynchronous code a breeze.",
        packageName: "flutter_riverpod",
        version: "3.3.1",
        publisher: "dash-overflow.net",
        likes: 2836,
        points: 140,
        downloads: 1464175,
        url: "https://pub.dev/packages/flutter_riverpod"
    },
    bloc: {
        title: "Bloc",
        description: "A predictable state management library that helps implement the BLoC design pattern. Widely used in enterprise.",
        packageName: "flutter_bloc",
        version: "8.1.5",
        publisher: "bloclibrary.dev",
        likes: 5431,
        points: 160,
        downloads: 8464175,
        url: "https://pub.dev/packages/flutter_bloc"
    },
    getx: {
        title: "GetX",
        description: "An extra-light and powerful solution for Flutter. It combines high-performance state management, intelligent dependency injection, and route management quickly.",
        packageName: "get",
        version: "4.6.6",
        publisher: "jonataslaw",
        likes: 12154,
        points: 140,
        downloads: 12064175,
        url: "https://pub.dev/packages/get"
    },
    provider: {
        title: "Provider",
        description: "A wrapper around InheritedWidget to make them easier to use and more reusable. Recommended by Google.",
        packageName: "provider",
        version: "6.1.2",
        publisher: "dash-overflow.net",
        likes: 8021,
        points: 140,
        downloads: 10464175,
        url: "https://pub.dev/packages/provider"
    },
    mobx: {
        title: "MobX",
        description: "Supercharge the state-management in your apps with Transparent Functional Reactive Programming (TFRP).",
        packageName: "flutter_mobx",
        version: "2.2.1",
        publisher: "mobx.netlify.app",
        likes: 1354,
        points: 140,
        downloads: 946417,
        url: "https://pub.dev/packages/flutter_mobx"
    },
    go_router: {
        title: "go_router",
        description: "A declarative routing package for Flutter that uses the Router API to provide a convenient, url-based API for navigating between different screens.",
        packageName: "go_router",
        version: "13.2.0",
        publisher: "flutter.dev",
        likes: 4721,
        points: 140,
        downloads: 6464175,
        url: "https://pub.dev/packages/go_router"
    },
    auto_route: {
        title: "auto_route",
        description: "AutoRoute is a declarative routing solution, where everything needed for navigation is automatically generated for you.",
        packageName: "auto_route",
        version: "7.8.4",
        publisher: "milad-akarie",
        likes: 2577,
        points: 140,
        downloads: 1464175,
        url: "https://pub.dev/packages/auto_route"
    },
    firebase: {
        title: "Firebase",
        description: "A comprehensive app development platform that provides backend services, including authentication, database, storage, and analytics.",
        packageName: "firebase_core",
        version: "2.25.4",
        publisher: "flutter.dev",
        likes: 3121,
        points: 140,
        downloads: 8464175,
        url: "https://pub.dev/packages/firebase_core"
    },
    supabase: {
        title: "Supabase",
        description: "An open source Firebase alternative providing a Postgres database, Authentication, instant APIs, Edge Functions, and Storage.",
        packageName: "supabase_flutter",
        version: "2.3.1",
        publisher: "supabase.io",
        likes: 1845,
        points: 140,
        downloads: 946417,
        url: "https://pub.dev/packages/supabase_flutter"
    },
    appwrite: {
        title: "Appwrite",
        description: "Appwrite is an open-source backend-as-a-service that abstracts web and mobile development, providing a set of scalable REST APIs.",
        packageName: "appwrite",
        version: "11.0.1",
        publisher: "appwrite.io",
        likes: 934,
        points: 140,
        downloads: 246417,
        url: "https://pub.dev/packages/appwrite"
    },
    iconsax_plus: {
        title: "Iconsax Plus",
        description: "Iconsax are the official icons of the Vuesax framework, these icons can be used for personal and commercial use for free",
        packageName: "iconsax_plus",
        version: "1.0.0",
        likes: 45,
        points: 150,
        downloads: 5029,
        url: "https://pub.dev/packages/iconsax_plus"
    },
    flutter_remix: {
        title: "Flutter Remix",
        description: "The complete Remix Icon pack available as Flutter Icons. This package acts as a more attractive replacement for the default Material icon set.",
        packageName: "flutter_remix",
        version: "0.0.3",
        likes: 59,
        points: 150,
        downloads: 832,
        url: "https://pub.dev/packages/flutter_remix"
    },
    hugeicons: {
        title: "Hugeicons",
        description: "4,700+ Free Flutter Icons with automatic theme color inheritance and dark mode support. Created by Hugeicons Pro Icon Library. The most beautiful icon library for developers.",
        packageName: "hugeicons",
        version: "1.1.5",
        publisher: "hugeicons.com",
        likes: 409,
        points: 150,
        downloads: 22489,
        url: "https://pub.dev/packages/hugeicons"
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
        description: "Model-View-ViewModel architecture. Highly compatible with data-binding. Great for declarative UIs."
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

    const open = !!selectedItem

    const info = selectedItem ? PACKAGE_INFO[selectedItem] || {
        title: selectedItem.charAt(0).toUpperCase() + selectedItem.slice(1).replace(/_/g, " "),
        description: "Specific details for this choice have not been provided.",
    } : PACKAGE_INFO['none'];

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
                        <p className="text-[15px] font-medium text-foreground/80 leading-relaxed tracking-wide">
                            {info.description}
                        </p>

                        {info.packageName && (
                            <div className="grid grid-cols-2 gap-3">
                                {info.version && (
                                    <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-card border border-border/50 shadow-sm transition-colors group">
                                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase group-hover:text-primary transition-colors">Version</span>
                                        <span className="font-mono text-sm font-semibold text-foreground/90">{info.version}</span>
                                    </div>
                                )}
                                {info.points && (
                                    <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-card border border-border/50 shadow-sm transition-colors group">
                                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercasey transition-colors">Pub points</span>
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
                            </div>
                        )}

                        {info.url && (
                            <div className="pt-2">
                                <Link
                                    href={info.url}
                                    target="_blank"
                                    rel="noreferrer"
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
