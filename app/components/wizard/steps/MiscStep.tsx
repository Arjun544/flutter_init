"use client"

import { MiscConfig } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
    AiImageIcon,
    CloudIcon,
    DatabaseIcon,
    PackageIcon,
    SmartPhone01Icon,
    SourceCodeIcon,
    WrenchIcon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { ToggleRow } from "../ToggleRow"

interface Category {
    id: string
    title: string
    description: string
    icon: any
    items: {
        key: keyof MiscConfig
        label: string
        description: string
        badge?: string
    }[]
}

export function MiscStep() {
    const { config, updateConfig, next, prev } = useWizard()
    const { misc } = config

    const handleToggle = (key: keyof MiscConfig, value: boolean) => {
        const newMisc = { ...misc, [key]: value }

        if (config.backend.provider === "custom" && !value) {
            if (key === "usesDio" && !newMisc.usesHttp) {
                newMisc.usesHttp = true
            }
            if (key === "usesHttp" && !newMisc.usesDio) {
                newMisc.usesDio = true
            }
        }

        updateConfig({
            misc: newMisc,
        })
    }

    const categories: Category[] = [
        {
            id: "networking",
            title: "Networking",
            description: "API communication and HTTP clients",
            icon: CloudIcon,
            items: [
                {
                    key: "usesDio",
                    label: "Dio",
                    description: "Powerful HTTP client with interceptors and global config",
                    badge: "Recommended"
                },
                {
                    key: "usesHttp",
                    label: "HTTP",
                    description: "Official lightweight package for basic requests"
                },
                {
                    key: "usesCachedNetworkImage",
                    label: "Cached Network Image",
                    description: "Download and cache network images automatically",
                    badge: "Popular"
                }
            ]
        },
        {
            id: "storage",
            title: "Persistence",
            description: "Local data storage and databases",
            icon: DatabaseIcon,
            items: [
                {
                    key: "usesHive",
                    label: "Hive",
                    description: "Lightweight and blazing fast key-value NoSQL database",
                    badge: "Fast"
                },
                {
                    key: "usesSharedPreferences",
                    label: "Shared Preferences",
                    description: "Simple persistence for key-value pairs",
                    badge: "Essential"
                },
                {
                    key: "usesSecureStorage",
                    label: "Secure Storage",
                    description: "Store sensitive data in keychain / keystore"
                }
            ]
        },
        {
            id: "media",
            title: "Media & Assets",
            description: "Image picking and SVG support",
            icon: AiImageIcon,
            items: [
                {
                    key: "usesFlutterSvg",
                    label: "Flutter SVG",
                    description: "Scalable Vector Graphics (SVG) rendering support",
                    badge: "Popular"
                },
                {
                    key: "usesImagePicker",
                    label: "Image Picker",
                    description: "Select images from gallery or take photos with camera"
                },
                {
                    key: "usesFilePicker",
                    label: "File Picker",
                    description: "Native file explorer for selecting documents"
                }
            ]
        },
        {
            id: "utilities",
            title: "Essential Utilities",
            description: "Common platform-specific tools",
            icon: WrenchIcon,
            items: [
                {
                    key: "usesUrlLauncher",
                    label: "URL Launcher",
                    description: "Open links, maps, phone, and email apps",
                    badge: "Essential"
                },
                {
                    key: "usesPathProvider",
                    label: "Path Provider",
                    description: "Find commonly used locations on host file system",
                    badge: "Essential"
                },
                {
                    key: "usesSharePlus",
                    label: "Share Plus",
                    description: "Share content via the platform's share dialog"
                },
                {
                    key: "usesPermissionHandler",
                    label: "Permission Handler",
                    description: "Generic API to check and request permissions",
                    badge: "Essential"
                },
                {
                    key: "usesGeolocator",
                    label: "Geolocator",
                    description: "Get current location and monitor location updates",
                    badge: "Location"
                }
            ]
        },
        {
            id: "device",
            title: "Device & System",
            description: "Hardware and app information",
            icon: SmartPhone01Icon,
            items: [
                {
                    key: "usesDeviceInfoPlus",
                    label: "Device Info",
                    description: "Get detailed hardware and software information"
                },
                {
                    key: "usesAppVersionUpdate",
                    label: "App Version Update",
                    description: "Check for updates and prompt user to update the app"
                }
            ]
        },
        {
            id: "advanced",
            title: "Advanced Features",
            description: "Layout, lifecycle and logic tools",
            icon: SourceCodeIcon,
            items: [
                {
                    key: "usesFlutterHooks",
                    label: "Flutter Hooks",
                    description: "React-style hooks for flutter lifecycle management",
                    badge: "Popular"
                },
                {
                    key: "usesSkeletonizer",
                    label: "Skeletonizer",
                    description: "Automatically generate skeleton loaders from UI",
                    badge: "UI"
                },
                {
                    key: "usesScreenutil",
                    label: "Screenutil",
                    description: "Adapter for screen sizing and font scaling",
                    badge: "Popular"
                }
            ]
        }
    ]

    return (
        <Card className="border-border/40 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <HugeiconsIcon icon={PackageIcon} size={24} />
                    </div>
                    <div>
                        <CardTitle className="bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent text-xl font-bold">
                            Package Selection
                        </CardTitle>
                        <CardDescription>
                            Customize your project with these categorized utilities.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Accordion type="multiple" defaultValue={["networking"]} className="space-y-3">
                    {categories.map((category) => (
                        <AccordionItem
                            key={category.id}
                            value={category.id}
                            className="border border-border/40 bg-background/40 hover:bg-background/60 rounded-xl overflow-hidden transition-all duration-300"
                        >
                            <AccordionTrigger className="px-5 hover:no-underline">
                                <div className="flex items-center gap-4 text-left">
                                    <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground group-hover:text-primary transition-colors">
                                        <HugeiconsIcon icon={category.icon} size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground leading-none mb-1">{category.title}</p>
                                        <p className="text-xs text-muted-foreground font-normal">{category.description}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5">
                                <div className="grid gap-3 pt-2">
                                    {category.items.map((item) => (
                                        <div key={item.key}>
                                            <ToggleRow
                                                label={item.label}
                                                description={item.description}
                                                checked={misc[item.key] as boolean}
                                                onCheckedChange={(value) => handleToggle(item.key, value)}
                                                badge={item.badge}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    )
}
