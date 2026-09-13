"use client"

import { MiscConfig } from "@/app/lib/config/schema"
import { StepGrid, StepPanel, StepSection } from "@/app/components/wizard/StepPanel"
import { ToggleRow } from "@/app/components/wizard/ToggleRow"
import { useWizard } from "@/app/lib/state/useWizardStore"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    AiImageIcon,
    CloudIcon,
    DatabaseIcon,
    SmartPhone01Icon,
    SourceCodeIcon,
    WrenchIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface Category {
    id: string
    title: string
    description: string
    icon: typeof CloudIcon
    items: {
        key: keyof MiscConfig
        label: string
        description: string
        badge?: string
    }[]
}

export function MiscStep() {
    const { config, updateConfig } = useWizard()
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
                    description: "HTTP client with interceptors and global config",
                    badge: "Recommended",
                },
                {
                    key: "usesHttp",
                    label: "HTTP",
                    description: "Official lightweight package for basic requests",
                },
                {
                    key: "usesCachedNetworkImage",
                    label: "Cached Network Image",
                    description: "Download and cache network images automatically",
                    badge: "Popular",
                },
            ],
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
                    description: "Lightweight key-value NoSQL database",
                    badge: "Fast",
                },
                {
                    key: "usesSharedPreferences",
                    label: "Shared Preferences",
                    description: "Simple persistence for key-value pairs",
                    badge: "Essential",
                },
                {
                    key: "usesSecureStorage",
                    label: "Secure Storage",
                    description: "Store sensitive data in keychain / keystore",
                },
            ],
        },
        {
            id: "media",
            title: "Media & assets",
            description: "Image picking and SVG support",
            icon: AiImageIcon,
            items: [
                {
                    key: "usesFlutterSvg",
                    label: "Flutter SVG",
                    description: "SVG rendering support",
                    badge: "Popular",
                },
                {
                    key: "usesImagePicker",
                    label: "Image Picker",
                    description: "Gallery photos or camera capture",
                },
                {
                    key: "usesFilePicker",
                    label: "File Picker",
                    description: "Native file explorer for documents",
                },
            ],
        },
        {
            id: "utilities",
            title: "Essential utilities",
            description: "Common platform-specific tools",
            icon: WrenchIcon,
            items: [
                {
                    key: "usesUrlLauncher",
                    label: "URL Launcher",
                    description: "Open links, maps, phone, and email apps",
                    badge: "Essential",
                },
                {
                    key: "usesPathProvider",
                    label: "Path Provider",
                    description: "Find common filesystem locations",
                    badge: "Essential",
                },
                {
                    key: "usesSharePlus",
                    label: "Share Plus",
                    description: "Share content via the platform share sheet",
                },
                {
                    key: "usesPermissionHandler",
                    label: "Permission Handler",
                    description: "Check and request runtime permissions",
                    badge: "Essential",
                },
                {
                    key: "usesGeolocator",
                    label: "Geolocator",
                    description: "Current location and location updates",
                    badge: "Location",
                },
            ],
        },
        {
            id: "device",
            title: "Device & system",
            description: "Hardware and app information",
            icon: SmartPhone01Icon,
            items: [
                {
                    key: "usesDeviceInfoPlus",
                    label: "Device Info",
                    description: "Hardware and software information",
                },
                {
                    key: "usesAppVersionUpdate",
                    label: "App Version Update",
                    description: "Check for updates and prompt the user",
                },
            ],
        },
        {
            id: "advanced",
            title: "Advanced features",
            description: "Layout, lifecycle, and UI helpers",
            icon: SourceCodeIcon,
            items: [
                {
                    key: "usesFlutterHooks",
                    label: "Flutter Hooks",
                    description: "React-style hooks for widget lifecycle",
                    badge: "Popular",
                },
                {
                    key: "usesSkeletonizer",
                    label: "Skeletonizer",
                    description: "Auto-generate skeleton loaders from UI",
                    badge: "UI",
                },
                {
                    key: "usesScreenutil",
                    label: "Screenutil",
                    description: "Screen sizing and font scaling",
                    badge: "Popular",
                },
            ],
        },
    ]

    return (
        <StepPanel
            title="Packages"
            description="Add utility packages by category. Expand a group to toggle what gets wired into the scaffold."
        >
            <StepSection>
                <Accordion
                    type="multiple"
                    defaultValue={["networking"]}
                    className="grid w-full grid-cols-1 items-start gap-3 lg:grid-cols-2"
                >
                    {categories.map((category) => (
                        <AccordionItem
                            key={category.id}
                            value={category.id}
                            className="overflow-hidden rounded-2xl border border-border/50 bg-background px-0 not-last:border-b-0 data-[state=open]:z-10"
                        >
                            <AccordionTrigger className="items-center rounded-2xl px-4 py-3.5 hover:no-underline data-[state=open]:rounded-b-none data-[state=open]:bg-muted/20">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                        <HugeiconsIcon icon={category.icon} size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-foreground">
                                            {category.title}
                                        </p>
                                        <p className="text-xs font-normal text-muted-foreground">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pt-1 pb-4">
                                <StepGrid cols={1} className="gap-3">
                                    {category.items.map((item) => (
                                        <ToggleRow
                                            key={item.key}
                                            label={item.label}
                                            description={item.description}
                                            checked={misc[item.key] as boolean}
                                            onCheckedChange={(value) =>
                                                handleToggle(item.key, value)
                                            }
                                            badge={item.badge}
                                        />
                                    ))}
                                </StepGrid>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </StepSection>
        </StepPanel>
    )
}
