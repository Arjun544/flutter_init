"use client"

import {
    CustomFontEntry,
    FontStyle,
    FontWeight,
    FONT_MAX_SIZE_BYTES,
    SUPPORTED_FONT_EXTENSIONS,
    ThemePreset,
    deriveFontFamily,
    fontStyleSchema,
    fontWeightSchema,
    themePresetOptions,
} from "@/app/lib/config/schema"
import { useWizard } from "@/app/lib/state/useWizardStore"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCEPTED_EXTS = SUPPORTED_FONT_EXTENSIONS.join(",")
const FONT_WEIGHTS: { value: FontWeight; label: string }[] = [
    { value: "100", label: "100 — Thin" },
    { value: "200", label: "200 — ExtraLight" },
    { value: "300", label: "300 — Light" },
    { value: "400", label: "400 — Regular" },
    { value: "500", label: "500 — Medium" },
    { value: "600", label: "600 — SemiBold" },
    { value: "700", label: "700 — Bold" },
    { value: "800", label: "800 — ExtraBold" },
    { value: "900", label: "900 — Black" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── ThemeStep ────────────────────────────────────────────────────────────────

export function ThemeStep() {
    const { config, updateConfig, setSelectedItem, addFontFile, removeFontFile, fontFiles } = useWizard()
    const { theme } = config
    const customFonts = theme.customFonts ?? []

    const [dragOver, setDragOver] = React.useState(false)
    const [errors, setErrors] = React.useState<string[]>([])
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // ── File processing ──────────────────────────────────────────────────────

    function processFiles(files: FileList | File[]) {
        const arr = Array.from(files)
        const newErrors: string[] = []

        for (const file of arr) {
            if (!isSupported(file.name)) {
                const ext = getExt(file.name) || "(no extension)"
                newErrors.push(
                    `"${file.name}" — unsupported format ${ext}. Flutter supports .ttf, .otf, .ttc only (not .woff/.woff2 on desktop).`
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

    // ── Drag handlers ─────────────────────────────────────────────────────────

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
            e.target.value = "" // reset so same file can be re-added after remove
        }
    }

    // ── Per-font update ───────────────────────────────────────────────────────

    function updateFontMeta(fileName: string, patch: Partial<CustomFontEntry>) {
        const file = fontFiles.get(fileName)
        const existing = customFonts.find((f) => f.fileName === fileName)
        if (!existing) return
        const updated = { ...existing, ...patch }
        if (file) {
            addFontFile(file, updated) // re-registers with updated metadata
        } else {
            // file blob not in memory (page was refreshed) — update metadata only
            updateConfig((prev) => ({
                ...prev,
                theme: {
                    ...prev.theme,
                    customFonts: (prev.theme.customFonts ?? []).map((f) =>
                        f.fileName === fileName ? updated : f
                    ),
                },
            }))
        }
    }

    return (
        <Card className="border-border/40 bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
                <CardTitle className="bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent text-xl font-bold">UI &amp; Theme</CardTitle>
                <CardDescription>
                    Choose your design system, primary color, dark mode, and custom fonts.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* ── Theme + Color ── */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2 group">
                        <Label className="transition-colors group-focus-within:text-primary">Theme</Label>
                        <Select
                            value={theme.preset}
                            onValueChange={(value) =>
                                updateConfig({ theme: { ...theme, preset: value as ThemePreset } })
                            }
                        >
                            <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm transition-all focus:ring-2 focus:ring-primary/20 hover:border-primary/40">
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent className="bg-background/90 backdrop-blur-xl border-border/50">
                                {themePresetOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center justify-between w-full pr-6">
                                            <div className="flex flex-col py-0.5 text-left">
                                                <span className="font-medium">{option.label}</span>
                                                {theme.preset !== option.value && (
                                                    <span className="text-[10px] text-muted-foreground font-normal line-clamp-1">{option.description}</span>
                                                )}
                                            </div>
                                            {theme.preset !== option.value && (
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
                                                    className="p-1 -mr-2 rounded-full hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors focus:outline-hidden [&_svg]:pointer-events-auto z-10 cursor-pointer"
                                                    title="View details"
                                                >
                                                    <HugeiconsIcon icon={InformationCircleIcon} size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 group">
                        <Label htmlFor="primaryColor" className="transition-colors group-focus-within:text-primary">Primary color</Label>
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Input
                                    id="primaryColor"
                                    value={theme.primaryColor ?? ""}
                                    onChange={(e) =>
                                        updateConfig({ theme: { ...theme, primaryColor: e.target.value } })
                                    }
                                    placeholder="#6750A4"
                                    className="pl-10 font-mono bg-background/50 backdrop-blur-sm transition-all focus:ring-2 focus:ring-primary/20"
                                />
                                <div
                                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-border"
                                    style={{ backgroundColor: theme.primaryColor ?? "#6750A4" }}
                                />
                            </div>
                            <Input
                                type="color"
                                className="h-10 w-16 p-1 cursor-pointer hover:scale-105 transition-transform"
                                value={theme.primaryColor ?? "#6750A4"}
                                onChange={(e) =>
                                    updateConfig({ theme: { ...theme, primaryColor: e.target.value } })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* ── Dark Mode ── */}
                <div className="space-y-4 rounded-xl border border-border/40 bg-card/30 p-5 backdrop-blur-sm transition-all hover:bg-card/50 hover:border-primary/20 click-scale">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-foreground/90">Dark mode</p>
                            <p className="text-sm text-muted-foreground">
                                Support system and manual toggle.
                            </p>
                        </div>
                        <Switch
                            checked={theme.darkMode.enabled}
                            onCheckedChange={(checked) =>
                                updateConfig({ theme: { ...theme, darkMode: { ...theme.darkMode, enabled: checked } } })
                            }
                            className="data-[state=checked]:bg-primary"
                        />
                    </div>
                    <div className={`flex items-center justify-between transition-opacity duration-300 ${!theme.darkMode.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                        <p className="text-sm text-muted-foreground">Follow system</p>
                        <Switch
                            checked={theme.darkMode.system}
                            onCheckedChange={(checked) =>
                                updateConfig({ theme: { ...theme, darkMode: { ...theme.darkMode, system: checked } } })
                            }
                            disabled={!theme.darkMode.enabled}
                        />
                    </div>
                </div>

                {/* ── Custom Fonts ── */}
                <div className="space-y-4">
                    <div>
                        <p className="font-semibold text-foreground/90">Custom fonts</p>
                        <p className="text-sm text-muted-foreground">
                            Drop font files to bundle them.
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                            Supported formats: <span className="font-mono">.ttf · .otf · .ttc</span>
                        </p>
                        <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-muted border border-border text-xs">
                            <HugeiconsIcon icon={AlertCircleIcon} size={15} />
                            <span>FlutterInit does not persist your fonts. You will need to select them again if you refresh the page.</span>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {errors.length > 0 && (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-destructive font-medium text-sm">
                                    <HugeiconsIcon icon={AlertCircleIcon} size={15} />
                                    <span>{errors.length === 1 ? "1 file rejected" : `${errors.length} files rejected`}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setErrors([])}
                                    className="text-destructive/60 hover:text-destructive transition-colors"
                                    aria-label="Dismiss errors"
                                >
                                    <HugeiconsIcon icon={Cancel01Icon} size={14} />
                                </button>
                            </div>
                            <ul className="text-xs text-destructive/80 space-y-0.5 pl-1">
                                {errors.map((e, i) => <li key={i}>{e}</li>)}
                            </ul>
                        </div>
                    )}

                    {/* Drop Zone */}
                    <div
                        role="button"
                        tabIndex={0}
                        aria-label="Drop font files here or click to browse"
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click() }}
                        className={[
                            "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer",
                            "transition-all duration-200 select-none",
                            dragOver
                                ? "border-primary bg-primary/10 scale-[1.01]"
                                : "border-border/50 hover:border-primary/40 hover:bg-muted/30 bg-card/20",
                        ].join(" ")}
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
                        <div className={[
                            "flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-200",
                            dragOver ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground",
                        ].join(" ")}>
                            <HugeiconsIcon icon={CloudUploadIcon} size={22} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-foreground/80">
                                {dragOver ? "Drop to add fonts" : "Drag & drop font files here"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                or <span className="underline underline-offset-2 text-primary">click to browse</span>
                                {" "}· .ttf · .otf · .ttc · max 10 MB each
                            </p>
                        </div>
                    </div>

                    {/* Font Cards */}
                    {customFonts.length > 0 && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {customFonts.map((font) => (
                                <FontCard
                                    key={font.fileName}
                                    font={font}
                                    onRemove={() => removeFontFile(font.fileName)}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </CardContent>
        </Card>
    )
}

// ─── FontCard ─────────────────────────────────────────────────────────────────

interface FontCardProps {
    font: CustomFontEntry
    onRemove: () => void
}

function FontCard({ font, onRemove }: FontCardProps) {
    const ext = getExt(font.fileName).replace(".", "").toUpperCase()

    return (
        <div className="group relative rounded-xl border border-border/30 bg-card/30 p-3 transition-all hover:border-primary/20 hover:bg-card/50 animate-in fade-in slide-in-from-bottom-1 duration-200">
            {/* Remove button */}
            <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${font.fileName}`}
                className="absolute top-1/2 -translate-y-1/2 right-3 flex h-7 w-7 items-center cursor-pointer justify-center rounded-full text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive focus:opacity-100"
            >
                <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </button>

            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary/60">
                    <HugeiconsIcon icon={File01Icon} size={18} />
                </div>
                <div className="min-w-0 flex-1 pr-8">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground/90 truncate">{font.fileName}</p>
                        <Badge variant="outline" className="text-[9px] h-3.5 px-1 font-mono border-muted-foreground/20 text-muted-foreground/70">
                            {ext}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-x-3 gap-y-1 mt-1 flex-wrap">
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold">Family</span>
                            <span className="text-xs text-foreground/70">{font.family}</span>
                        </div>
                        <div className="flex items-center gap-1 border-l border-border/50 pl-3">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold">Weight</span>
                            <span className="text-xs text-foreground/70 font-mono">{font.weight}</span>
                        </div>
                        {font.style === "italic" && (
                            <div className="flex items-center gap-1 border-l border-border/50 pl-3">
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold italic">Italic</span>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

