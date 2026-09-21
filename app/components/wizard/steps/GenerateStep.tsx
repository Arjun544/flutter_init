"use client"

import { StepPanel, StepSection } from "@/app/components/wizard/StepPanel"
import { SummaryItem, SummaryTagItem } from "@/app/components/wizard/SummaryItem"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function GenerateStep({
    error,
    isGenerating,
}: {
    error: string | null
    isGenerating: boolean
}) {
    const { config } = useWizard()

    return (
        <StepPanel
            title="Review & generate"
            description={
                isGenerating
                    ? "Building your Flutter scaffold…"
                    : "Confirm your selections, then generate the ZIP from the header."
            }
        >
            {error ? (
                <Alert variant="destructive">
                    <HugeiconsIcon icon={AlertCircleIcon} />
                    <AlertTitle>Generation failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : null}

            <div className="grid w-full gap-8 lg:grid-cols-2">
                <StepSection title="Project" description="Identity and core stack.">
                    <div className="w-full">
                        <SummaryItem
                            label="App name"
                            value={config.appName}
                            error={
                                config.appName !== "" &&
                                !/^[a-z][a-z0-9_]*$/.test(config.appName)
                            }
                        />
                        <SummaryItem
                            label="Package ID"
                            value={config.packageId}
                            error={
                                config.packageId !== "" &&
                                !/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(
                                    config.packageId
                                )
                            }
                        />
                        <SummaryItem
                            label="Theme"
                            value={
                                config.ui.shadcn
                                    ? "shadcn_ui"
                                    : config.theme.preset === "cupertino"
                                      ? "Cupertino"
                                      : "Material"
                            }
                        />
                        <SummaryItem
                            label="Appearance"
                            value={
                                !config.theme.darkMode.enabled
                                    ? "Light"
                                    : config.theme.darkMode.system
                                      ? "Auto"
                                      : "Dark"
                            }
                        />
                        {config.ui.shadcn ? (
                            <SummaryItem
                                label="Default app"
                                value={
                                    config.ui.defaultKit === "shadcn"
                                        ? "ShadApp"
                                        : config.theme.preset === "cupertino"
                                          ? "CupertinoApp"
                                          : "MaterialApp"
                                }
                            />
                        ) : null}
                        <SummaryItem label="Architecture" value={config.architecture} />
                        <SummaryItem label="State" value={config.stateManagement} />
                        <SummaryItem label="Navigation" value={config.navigation} />
                        <SummaryItem label="Backend" value={config.backend.provider} />
                    </div>
                </StepSection>

                <StepSection title="Extras" description="Icons and utility packages.">
                    <div className="w-full">
                        <SummaryTagItem
                            label="Icons"
                            tags={
                                [
                                    "Default",
                                    config.icons.iconsax_plus && "Iconsax Plus",
                                    config.icons.flutter_remix && "Flutter Remix",
                                    config.icons.hugeicons && "Hugeicons",
                                ].filter(Boolean) as string[]
                            }
                        />
                        <SummaryTagItem
                            label="Packages"
                            tags={
                                [
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
                                    "Dotenv",
                                ].filter(Boolean) as string[]
                            }
                        />
                    </div>
                </StepSection>
            </div>
        </StepPanel>
    )
}
