"use client"

import { derivePackageId } from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { StepPanel, StepSection } from "@/app/components/wizard/StepPanel"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export function BasicsStep() {
    const { config, updateConfig } = useWizard()

    const appNameInvalid =
        Boolean(config.appName) && !/^[a-z][a-z0-9_]*$/.test(config.appName)
    const packageIdInvalid =
        Boolean(config.packageId) &&
        !/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(config.packageId)

    const handleAppNameChange = (value: string) => {
        const derived = derivePackageId(value)
        updateConfig((prev) => ({
            ...prev,
            appName: value,
            packageId:
                prev.packageId === derivePackageId(prev.appName) ? derived : prev.packageId,
        }))
    }

    return (
        <StepPanel
            title="Project basics"
            description="Name your app and set the package identifier used across Android, iOS, and pubspec."
        >
            <StepSection>
                <FieldGroup className="gap-6 @container/basics w-full">
                    <div className="grid w-full gap-6 md:grid-cols-2">
                        <Field data-invalid={appNameInvalid || undefined}>
                            <div className="flex items-center justify-between gap-2">
                                <FieldLabel htmlFor="appName">App name</FieldLabel>
                                {appNameInvalid ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const fixed = config.appName
                                                .toLowerCase()
                                                .replace(/[^a-z0-9_]/g, "_")
                                                .replace(/_+/g, "_")
                                                .replace(/^_+|_+$/g, "")
                                            handleAppNameChange(fixed || "app_name")
                                        }}
                                        className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
                                    >
                                        Auto-fix to snake_case
                                    </button>
                                ) : null}
                            </div>
                            <Input
                                id="appName"
                                value={config.appName}
                                onChange={(e) => handleAppNameChange(e.target.value)}
                                placeholder="my_flutter_app"
                                aria-invalid={appNameInvalid || undefined}
                                className={cn(appNameInvalid && "border-destructive/50")}
                            />
                            <FieldDescription>
                                Lowercase letters, numbers, and underscores only.
                            </FieldDescription>
                            {appNameInvalid ? (
                                <FieldError>
                                    Must start with a letter and use only a–z, 0–9, and _.
                                </FieldError>
                            ) : null}
                        </Field>

                        <Field data-invalid={packageIdInvalid || undefined}>
                            <div className="flex items-center justify-between gap-2">
                                <FieldLabel htmlFor="packageId">Package ID</FieldLabel>
                                {packageIdInvalid ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const fixed = config.packageId
                                                .toLowerCase()
                                                .replace(/[^a-z0-9_.]/g, "_")
                                                .replace(/_+/g, "_")
                                                .replace(/\.+/g, ".")
                                                .replace(/^_+|_+$/g, "")
                                                .replace(/^\.+|\.+$/g, "")
                                            updateConfig({ packageId: fixed || "com.example.app" })
                                        }}
                                        className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
                                    >
                                        Auto-fix format
                                    </button>
                                ) : null}
                            </div>
                            <Input
                                id="packageId"
                                value={config.packageId}
                                onChange={(e) => updateConfig({ packageId: e.target.value })}
                                placeholder="com.example.my_app"
                                aria-invalid={packageIdInvalid || undefined}
                                className={cn(
                                    "font-mono text-sm",
                                    packageIdInvalid && "border-destructive/50"
                                )}
                            />
                            <FieldDescription>
                                Reverse-domain style, e.g. com.company.app_name.
                            </FieldDescription>
                            {packageIdInvalid ? (
                                <FieldError>
                                    Use a valid reverse-domain identifier with at least two segments.
                                </FieldError>
                            ) : null}
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="description">Description</FieldLabel>
                        <Textarea
                            id="description"
                            value={config.description ?? ""}
                            onChange={(e) => updateConfig({ description: e.target.value })}
                            placeholder="Short description for pubspec.yaml and README."
                            className="min-h-24 resize-none"
                        />
                        <FieldDescription>
                            Shown in generated docs and package metadata.
                        </FieldDescription>
                    </Field>
                </FieldGroup>
            </StepSection>
        </StepPanel>
    )
}
