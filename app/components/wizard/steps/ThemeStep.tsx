"use client"

import {
    CustomFontEntry,
    FONT_MAX_SIZE_BYTES,
    SUPPORTED_FONT_EXTENSIONS,
    ThemePreset,
    deriveFontFamily,
    themePresetOptions,
} from "@/app/lib/config/schema"
import { StepGrid, StepPanel, StepSection } from "@/app/components/wizard/StepPanel"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
    AlertCircleIcon,
    Cancel01Icon,
    CloudUploadIcon,
    File01Icon,
    InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"
import { cn } from "@/lib/utils"

const ACCEPTED_EXTS = SUPPORTED_FONT_EXTENSIONS.join(",")

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
    const { theme } = config
    const customFonts = theme.customFonts ?? []

    const [dragOver, setDragOver] = React.useState(false)
    const [errors, setErrors] = React.useState<string[]>([])
    const fileInputRef = React.useRef<HTMLInputElement>(null)

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
            description="Set the design system, primary color, dark mode behavior, and optional custom fonts."
        >
            <StepSection title="Appearance" description="Core look-and-feel for the generated app.">
                <FieldGroup className="w-full">
                    <div className="grid w-full gap-6 md:grid-cols-2">
                        <Field>
                            <FieldLabel>Theme</FieldLabel>
                            <Select
                                value={theme.preset}
                                onValueChange={(value) =>
                                    updateConfig({
                                        theme: { ...theme, preset: value as ThemePreset },
                                    })
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    {themePresetOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex w-full items-center justify-between gap-3 pr-4">
                                                <div className="flex flex-col py-0.5 text-left">
                                                    <span className="font-medium">{option.label}</span>
                                                    {theme.preset !== option.value ? (
                                                        <span className="line-clamp-1 text-[10px] font-normal text-muted-foreground">
                                                            {option.description}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                {theme.preset !== option.value ? (
                                                    <button
                                                        type="button"
                                                        onPointerDown={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            setSelectedItem(`theme_${option.value}`)
                                                        }}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            setSelectedItem(`theme_${option.value}`)
                                                        }}
                                                        className="z-10 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary"
                                                        title="View details"
                                                    >
                                                        <HugeiconsIcon
                                                            icon={InformationCircleIcon}
                                                            size={16}
                                                        />
                                                    </button>
                                                ) : null}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
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
                                        style={{
                                            backgroundColor: theme.primaryColor ?? "#6750A4",
                                        }}
                                    />
                                </div>
                                <Input
                                    type="color"
                                    className="h-10 w-14 cursor-pointer p-1"
                                    value={theme.primaryColor ?? "#6750A4"}
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
                    </div>
                </FieldGroup>
            </StepSection>

            <Separator />

            <StepSection title="Dark mode" description="Enable dark theme support and system sync.">
                <div className="grid w-full gap-3 sm:grid-cols-2">
                    <label className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-lg border border-border/50 px-3.5 py-3 transition-colors hover:bg-muted/40">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-foreground">Enable dark mode</span>
                            <span className="text-xs text-muted-foreground">
                                Generate light and dark color schemes.
                            </span>
                        </div>
                        <Switch
                            checked={theme.darkMode.enabled}
                            onCheckedChange={(checked) =>
                                updateConfig({
                                    theme: {
                                        ...theme,
                                        darkMode: { ...theme.darkMode, enabled: checked },
                                    },
                                })
                            }
                        />
                    </label>
                    <label
                        className={cn(
                            "flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-lg border border-border/50 px-3.5 py-3 transition-colors hover:bg-muted/40",
                            !theme.darkMode.enabled && "pointer-events-none opacity-50"
                        )}
                    >
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-foreground">Follow system</span>
                            <span className="text-xs text-muted-foreground">
                                Match the device light/dark preference.
                            </span>
                        </div>
                        <Switch
                            checked={theme.darkMode.system}
                            onCheckedChange={(checked) =>
                                updateConfig({
                                    theme: {
                                        ...theme,
                                        darkMode: { ...theme.darkMode, system: checked },
                                    },
                                })
                            }
                            disabled={!theme.darkMode.enabled}
                        />
                    </label>
                </div>
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
