"use client"

import {
    CustomFontEntry,
    FONT_MAX_SIZE_BYTES,
    PlatformStyle,
    SUPPORTED_FONT_EXTENSIONS,
    ThemePreset,
    UiKit,
    deriveFontFamily,
} from "@/app/lib/config/schema"
import {
    AppearancePreview,
    DefaultAppPreview,
    PreviewChoiceCard,
    PreviewChoiceGroup,
    ThemePresetPreview,
    UiKitPreview,
} from "@/app/components/wizard/PreviewChoiceCard"
import { StepGrid, StepPanel, StepSection } from "@/app/components/wizard/StepPanel"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
    AlertCircleIcon,
    Cancel01Icon,
    CloudUploadIcon,
    File01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"
import { cn } from "@/lib/utils"

const ACCEPTED_EXTS = SUPPORTED_FONT_EXTENSIONS.join(",")

type AppearanceMode = "light" | "dark" | "auto"
type ThemeChoice = "material" | "cupertino" | "shadcn"
type DefaultApp = "material" | "cupertino" | "shad"

const appearanceOptions: Array<{
    value: AppearanceMode
    label: string
    description: string
}> = [
    {
        value: "light",
        label: "Light mode",
        description: "Always use the light color scheme.",
    },
    {
        value: "dark",
        label: "Dark mode",
        description: "Generate dark schemes and prefer dark.",
    },
    {
        value: "auto",
        label: "Auto",
        description: "Follow the device light/dark preference.",
    },
]

const themeChoiceOptions: Array<{
    value: ThemeChoice
    label: string
    description: string
}> = [
    {
        value: "material",
        label: "Material",
        description: "Material Design with MaterialApp.",
    },
    {
        value: "cupertino",
        label: "Cupertino",
        description: "iOS-style widgets with CupertinoApp.",
    },
    {
        value: "shadcn",
        label: "shadcn_ui",
        description: "shadcn/ui package plus ShadApp* wrappers.",
    },
]

const defaultAppOptions: Array<{
    value: DefaultApp
    /** Unique radio id — must not collide with Theme choice values. */
    radioValue: string
    label: string
    description: string
}> = [
    {
        value: "material",
        radioValue: "default_app_material",
        label: "MaterialApp",
        description: "Root app is MaterialApp; screens use App* widgets.",
    },
    {
        value: "cupertino",
        radioValue: "default_app_cupertino",
        label: "CupertinoApp",
        description: "Root app is CupertinoApp; screens use App* widgets.",
    },
    {
        value: "shad",
        radioValue: "default_app_shad",
        label: "ShadApp",
        description: "Root wraps with ShadApp; screens use ShadApp* widgets.",
    },
]

function appearanceFromConfig(darkMode: { enabled: boolean; system: boolean }): AppearanceMode {
    if (!darkMode.enabled) return "light"
    if (darkMode.system) return "auto"
    return "dark"
}

function darkModeFromAppearance(mode: AppearanceMode) {
    switch (mode) {
        case "light":
            return { enabled: false, system: false }
        case "dark":
            return { enabled: true, system: false }
        case "auto":
            return { enabled: true, system: true }
    }
}

function themeChoiceFromConfig(theme: {
    preset: ThemePreset
}, ui: { shadcn: boolean }): ThemeChoice {
    if (ui.shadcn) return "shadcn"
    if (theme.preset === "cupertino") return "cupertino"
    return "material"
}

function defaultAppFromConfig(theme: {
    preset: ThemePreset
}, ui: { platformStyle: PlatformStyle; defaultKit: UiKit }): DefaultApp {
    if (ui.defaultKit === "shadcn") return "shad"
    if (theme.preset === "cupertino" || ui.platformStyle === "cupertino") {
        return "cupertino"
    }
    return "material"
}

function getExt(name: string) {
    const i = name.lastIndexOf(".")
    return i === -1 ? "" : name.slice(i).toLowerCase()
}

function isSupported(name: string) {
    return (SUPPORTED_FONT_EXTENSIONS as readonly string[]).includes(getExt(name))
}

function formatBytes(bytes: number) {
    return bytes < 1024 * 1024
        ? `${(bytes / 1024).toFixed(1)} KB`
        : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ThemeStep() {
    const { config, updateConfig, setSelectedItem, addFontFile, removeFontFile } =
        useWizard()
    const { theme, ui } = config
    const customFonts = theme.customFonts ?? []
    const accent = theme.primaryColor || "#6750A4"
    const appearance = appearanceFromConfig(theme.darkMode)
    const themeChoice = themeChoiceFromConfig(theme, ui)
    const defaultApp = defaultAppFromConfig(theme, ui)

    const [dragOver, setDragOver] = React.useState(false)
    const [errors, setErrors] = React.useState<string[]>([])
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    function applyThemeChoice(choice: ThemeChoice) {
        if (choice === "material") {
            updateConfig({
                theme: { ...theme, preset: "material3" },
                ui: {
                    ...ui,
                    platformStyle: "material",
                    shadcn: false,
                    defaultKit: "app",
                },
            })
            return
        }

        if (choice === "cupertino") {
            updateConfig({
                theme: { ...theme, preset: "cupertino" },
                ui: {
                    ...ui,
                    platformStyle: "cupertino",
                    shadcn: false,
                    defaultKit: "app",
                },
            })
            return
        }

        applyDefaultApp(defaultApp === "shad" ? "shad" : defaultApp)
    }

    function applyDefaultApp(app: DefaultApp) {
        if (app === "cupertino") {
            updateConfig({
                theme: { ...theme, preset: "cupertino" },
                ui: {
                    ...ui,
                    platformStyle: "cupertino",
                    shadcn: true,
                    defaultKit: "app",
                },
            })
            return
        }

        if (app === "shad") {
            updateConfig({
                theme: { ...theme, preset: "material3" },
                ui: {
                    ...ui,
                    platformStyle: "material",
                    shadcn: true,
                    defaultKit: "shadcn",
                },
            })
            return
        }

        updateConfig({
            theme: { ...theme, preset: "material3" },
            ui: {
                ...ui,
                platformStyle: "material",
                shadcn: true,
                defaultKit: "app",
            },
        })
    }

    function processFiles(files: FileList | File[]) {
        const arr = Array.from(files)
        const newErrors: string[] = []

        for (const file of arr) {
            if (!isSupported(file.name)) {
                const ext = getExt(file.name) || "(no extension)"
                newErrors.push(
                    `"${file.name}" — unsupported format ${ext}. Flutter supports .ttf, .otf, .ttc only.`
                )
                continue
            }
            if (file.size > FONT_MAX_SIZE_BYTES) {
                newErrors.push(
                    `"${file.name}" — file too large (${formatBytes(file.size)}). Maximum is 10 MB.`
                )
                continue
            }

            const meta: CustomFontEntry = {
                family: deriveFontFamily(file.name),
                fileName: file.name,
                style: "normal",
                weight: "400",
            }
            addFontFile(file, meta)
        }

        if (newErrors.length > 0) setErrors((prev) => [...prev, ...newErrors])
    }

    function onDragOver(e: React.DragEvent) {
        e.preventDefault()
        setDragOver(true)
    }

    function onDragLeave(e: React.DragEvent) {
        e.preventDefault()
        setDragOver(false)
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault()
        setDragOver(false)
        if (e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files)
        }
    }

    function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files)
            e.target.value = ""
        }
    }

    return (
        <StepPanel
            title="UI & theme"
            description="Customize appearance, primary color, design system, and custom fonts."
        >
            <StepSection
                title="Appearance"
                description="Customize your theme for a tailored experience."
            >
                <RadioGroup
                    value={appearance}
                    onValueChange={(value) =>
                        updateConfig({
                            theme: {
                                ...theme,
                                darkMode: darkModeFromAppearance(value as AppearanceMode),
                            },
                        })
                    }
                    className="w-full"
                >
                    <PreviewChoiceGroup value={appearance}>
                        {appearanceOptions.map((option) => (
                            <PreviewChoiceCard
                                key={option.value}
                                value={option.value}
                                label={option.label}
                                selected={appearance === option.value}
                                onInfo={() => setSelectedItem(`appearance_${option.value}`)}
                            >
                                <AppearancePreview mode={option.value} />
                            </PreviewChoiceCard>
                        ))}
                    </PreviewChoiceGroup>
                </RadioGroup>
            </StepSection>

            <Separator />

            <StepSection
                title="Primary color"
                description="Seed color for the generated light and dark schemes."
            >
                <FieldGroup className="w-full">
                    <Field className="max-w-sm">
                        <FieldLabel htmlFor="primaryColor">Primary color</FieldLabel>
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Input
                                    id="primaryColor"
                                    value={theme.primaryColor ?? ""}
                                    onChange={(e) =>
                                        updateConfig({
                                            theme: {
                                                ...theme,
                                                primaryColor: e.target.value,
                                            },
                                        })
                                    }
                                    placeholder="#6750A4"
                                    className="pl-10 font-mono"
                                />
                                <div
                                    className="absolute top-1/2 left-3 size-4 -translate-y-1/2 rounded-full border border-border"
                                    style={{ backgroundColor: accent }}
                                />
                            </div>
                            <Input
                                type="color"
                                className="h-10 w-14 cursor-pointer p-1"
                                value={accent}
                                onChange={(e) =>
                                    updateConfig({
                                        theme: {
                                            ...theme,
                                            primaryColor: e.target.value,
                                        },
                                    })
                                }
                                aria-label="Pick primary color"
                            />
                        </div>
                    </Field>
                </FieldGroup>
            </StepSection>

            <Separator />

            <StepSection
                title="Theme"
                description="Pick Material, Cupertino, or shadcn_ui as the design system."
            >
                <RadioGroup
                    value={themeChoice}
                    onValueChange={(value) => applyThemeChoice(value as ThemeChoice)}
                    className="w-full"
                >
                    <PreviewChoiceGroup value={themeChoice}>
                        {themeChoiceOptions.map((option) => (
                            <PreviewChoiceCard
                                key={option.value}
                                value={option.value}
                                label={option.label}
                                selected={themeChoice === option.value}
                                onInfo={() => setSelectedItem(`theme_${option.value}`)}
                            >
                                {option.value === "shadcn" ? (
                                    <UiKitPreview kit="shadcn" />
                                ) : (
                                    <ThemePresetPreview
                                        preset={
                                            option.value === "cupertino"
                                                ? "cupertino"
                                                : "material3"
                                        }
                                    />
                                )}
                            </PreviewChoiceCard>
                        ))}
                    </PreviewChoiceGroup>
                </RadioGroup>

                {themeChoice === "shadcn" ? (
                    <div className="mt-4 flex w-full flex-col gap-2">
                        <span className="text-sm font-medium text-foreground">
                            Default app
                        </span>
                        <p className="text-xs text-muted-foreground">
                            Choose the root app widget used with shadcn_ui.
                        </p>
                        <RadioGroup
                            value={`default_app_${defaultApp}`}
                            onValueChange={(value) => {
                                const match = defaultAppOptions.find(
                                    (option) => option.radioValue === value
                                )
                                if (match) applyDefaultApp(match.value)
                            }}
                            className="w-full"
                        >
                            <PreviewChoiceGroup value={`default_app_${defaultApp}`}>
                                {defaultAppOptions.map((option) => (
                                    <PreviewChoiceCard
                                        key={option.radioValue}
                                        value={option.radioValue}
                                        label={option.label}
                                        selected={defaultApp === option.value}
                                        className="w-56"
                                        surfaceClassName="aspect-[5/4]"
                                        onInfo={() =>
                                            setSelectedItem(option.radioValue)
                                        }
                                    >
                                        <DefaultAppPreview
                                            app={option.value}
                                            animate={defaultApp === option.value}
                                        />
                                    </PreviewChoiceCard>
                                ))}
                            </PreviewChoiceGroup>
                        </RadioGroup>
                    </div>
                ) : null}
            </StepSection>

            <Separator />

            <StepSection
                title="Custom fonts"
                description="Bundle .ttf, .otf, or .ttc files with the project. Max 10 MB each."
            >
                <Alert>
                    <HugeiconsIcon icon={AlertCircleIcon} />
                    <AlertTitle>Fonts are session-only</AlertTitle>
                    <AlertDescription>
                        FlutterInit does not persist uploaded fonts. Re-select them after a refresh.
                    </AlertDescription>
                </Alert>

                {errors.length > 0 ? (
                    <Alert variant="destructive">
                        <HugeiconsIcon icon={AlertCircleIcon} />
                        <AlertTitle className="flex items-center justify-between gap-2">
                            <span>
                                {errors.length === 1
                                    ? "1 file rejected"
                                    : `${errors.length} files rejected`}
                            </span>
                            <button
                                type="button"
                                onClick={() => setErrors([])}
                                className="cursor-pointer text-destructive/70 transition-colors hover:text-destructive"
                                aria-label="Dismiss errors"
                            >
                                <HugeiconsIcon icon={Cancel01Icon} size={14} />
                            </button>
                        </AlertTitle>
                        <AlertDescription>
                            <ul className="mt-1 list-disc pl-4">
                                {errors.map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                ) : null}

                <div
                    role="button"
                    tabIndex={0}
                    aria-label="Drop font files here or click to browse"
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click()
                    }}
                    className={cn(
                        "flex w-full cursor-pointer flex-col items-start gap-3 rounded-lg border border-dashed px-5 py-6 transition-colors duration-150 select-none sm:flex-row sm:items-center",
                        dragOver
                            ? "border-primary bg-primary/10"
                            : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                    )}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept={ACCEPTED_EXTS}
                        className="sr-only"
                        onChange={onFileInput}
                        aria-label="Select font files"
                        tabIndex={-1}
                    />
                    <div
                        className={cn(
                            "flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors",
                            dragOver
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                        )}
                    >
                        <HugeiconsIcon icon={CloudUploadIcon} size={20} />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">
                            {dragOver ? "Drop to add fonts" : "Drag & drop font files here"}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            or{" "}
                            <span className="text-primary underline underline-offset-2">
                                click to browse
                            </span>{" "}
                            · .ttf · .otf · .ttc · max 10 MB each
                        </p>
                    </div>
                </div>

                {customFonts.length > 0 ? (
                    <StepGrid cols={2}>
                        {customFonts.map((font) => (
                            <FontRow
                                key={font.fileName}
                                font={font}
                                onRemove={() => removeFontFile(font.fileName)}
                            />
                        ))}
                    </StepGrid>
                ) : null}
            </StepSection>
        </StepPanel>
    )
}

function FontRow({ font, onRemove }: { font: CustomFontEntry; onRemove: () => void }) {
    const ext = getExt(font.fileName).replace(".", "").toUpperCase()

    return (
        <div className="group relative flex items-center gap-3 rounded-lg border border-border/50 px-3.5 py-3 transition-colors hover:bg-muted/40">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <HugeiconsIcon icon={File01Icon} size={16} />
            </div>
            <div className="min-w-0 flex-1 pr-8">
                <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{font.fileName}</p>
                    <Badge variant="outline" className="h-4 px-1 font-mono text-[9px]">
                        {ext}
                    </Badge>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span>
                        Family <span className="text-foreground/80">{font.family}</span>
                    </span>
                    <span>
                        Weight <span className="font-mono text-foreground/80">{font.weight}</span>
                    </span>
                    {font.style === "italic" ? <span className="italic">Italic</span> : null}
                </div>
            </div>
            <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${font.fileName}`}
                className="absolute top-1/2 right-2.5 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus:opacity-100"
            >
                <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </button>
        </div>
    )
}
