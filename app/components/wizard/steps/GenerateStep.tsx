"use client"

import { useWizard } from "@/app/lib/state/useWizardStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as React from "react"
import { SummaryItem, SummaryTagItem } from "../SummaryItem"

export function GenerateStep({ error, isGenerating }: { error: string | null, isGenerating: boolean }) {
    const { config } = useWizard()

    return (
        <Card className="border-border/40 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
                <CardTitle className="bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent text-xl font-bold">Review & Generate</CardTitle>
                <CardDescription>
                    Confirm your selections before generating the ZIP.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <SummaryItem label="App name" value={config.appName} />
                    <SummaryItem label="Package ID" value={config.packageId} />
                    <SummaryItem label="Theme" value={config.theme.preset} />
                    <SummaryItem label="Architecture" value={config.architecture} />
                    <SummaryItem label="State" value={config.stateManagement} />
                    <SummaryItem label="Navigation" value={config.navigation} />
                    <SummaryItem label="Backend" value={config.backend.provider} />
                    <SummaryTagItem
                        label="Icons"
                        tags={[
                            "Default",
                            config.icons.iconsax_plus && "Iconsax Plus",
                            config.icons.flutter_remix && "Flutter Remix",
                            config.icons.hugeicons && "Hugeicons",
                        ].filter(Boolean) as string[]}
                    />
                    <SummaryTagItem
                        label="Misc"
                        tags={[
                            config.misc.usesScreenutil && "Screenutil",
                            config.misc.usesDio && "Dio",
                            config.misc.usesHttp && "HTTP",
                            config.misc.usesHive && "Hive",
                            config.misc.usesSharedPreferences && "Shared Pref",
                            config.misc.usesSecureStorage && "Secure Storage",
                            config.misc.usesCachedNetworkImage && "Cached Image",
                            config.misc.usesFlutterSvg && "SVG",
                            config.misc.usesSkeletonizer && "Skeletonizer",
                            config.misc.usesFlutterHooks && "Hooks",
                            config.misc.usesImagePicker && "Image Picker",
                            config.misc.usesFilePicker && "File Picker",
                            config.misc.usesUrlLauncher && "Url Launcher",
                            config.misc.usesPermissionHandler && "Permissions",
                            config.misc.usesDeviceInfoPlus && "Device Info",
                            config.misc.usesAppVersionUpdate && "App Version",
                            config.misc.usesDotenv && "Dotenv",

                        ].filter(Boolean) as string[]}
                    />
                </div>

                {error ? (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                        Error: {error}
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}
