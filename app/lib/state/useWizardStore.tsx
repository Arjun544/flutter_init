"use client"

import * as React from "react"

import {
    CustomFontEntry,
    ScaffoldConfig,
    StepId,
    defaultConfig,
    scaffoldConfigSchema,
    stepOrder,
} from "@/app/lib/config/schema"

const STORAGE_KEY = "flutter_scaffold_config_v1"

type WizardContextValue = {
    config: ScaffoldConfig
    step: StepId
    stepIndex: number
    isHydrated: boolean
    updateConfig: (
        updater:
            | Partial<ScaffoldConfig>
            | ((prev: ScaffoldConfig) => Partial<ScaffoldConfig> | ScaffoldConfig)
    ) => void
    setStep: (step: StepId) => void
    next: () => void
    prev: () => void
    reset: () => void
    selectedItem: string | null
    setSelectedItem: (item: string | null) => void
    /** Binary font files (not persisted — reset on page reload) */
    fontFiles: Map<string, File>
    addFontFile: (file: File, meta: CustomFontEntry) => void
    removeFontFile: (fileName: string) => void
    clearFontFiles: () => void
}

const WizardContext = React.createContext<WizardContextValue | null>(null)

function clampStep(step: StepId): StepId {
    return stepOrder.includes(step) ? step : stepOrder[0]
}

function safeParseConfig(candidate: unknown): ScaffoldConfig {
    const parsed = scaffoldConfigSchema.safeParse(candidate)
    if (parsed.success) return parsed.data
    return defaultConfig
}

export function WizardProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = React.useState<ScaffoldConfig>(defaultConfig)
    const [step, setStepInternal] = React.useState<StepId>(stepOrder[0])
    const [isHydrated, setIsHydrated] = React.useState(false)
    const [selectedItem, setSelectedItem] = React.useState<string | null>(null)
    // Non-persisted: stores binary File objects keyed by fileName
    const [fontFiles, setFontFiles] = React.useState<Map<string, File>>(new Map())

    React.useEffect(() => {
        if (typeof window === "undefined") return

        try {
            const cached = window.localStorage.getItem(STORAGE_KEY)
            if (cached) {
                const parsed = safeParseConfig(JSON.parse(cached))
                setConfig(parsed)
            }
        } catch {
            // ignore corrupted cache and fallback to defaults
        } finally {
            setIsHydrated(true)
        }
    }, [])

    React.useEffect(() => {
        if (!isHydrated) return
        try {
            // Do not persist custom fonts. They must be re-uploaded on refresh.
            const configToSave = {
                ...config,
                theme: {
                    ...config.theme,
                    customFonts: [],
                },
            }
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave))
            
            // Sync with dev script if in development
            if (process.env.NODE_ENV === "development") {
                fetch("/api/dev/sync-config", {
                    method: "POST",
                    body: JSON.stringify(config),
                    headers: { "Content-Type": "application/json" }
                }).catch(() => { /* Silent failure - script might not be running or API failed */ })
            }
        } catch {
            // ignore write errors (storage full or unavailable)
        }
    }, [config, isHydrated])

    const updateConfig = React.useCallback(
        (
            updater:
                | Partial<ScaffoldConfig>
                | ((prev: ScaffoldConfig) => Partial<ScaffoldConfig> | ScaffoldConfig)
        ) => {
            setConfig((prev) => {
                const next =
                    typeof updater === "function"
                        ? updater(prev)
                        : {
                            ...prev,
                            ...updater,
                        }

                return { ...prev, ...next }
            })
        },
        []
    )

    const setStep = React.useCallback((nextStep: StepId) => {
        setStepInternal(clampStep(nextStep))
        setSelectedItem(null) // Reset selection when step changes
    }, [])

    const next = React.useCallback(() => {
        const currentIndex = stepOrder.indexOf(step)
        const nextStep = stepOrder[currentIndex + 1] ?? step
        setStepInternal(nextStep)
        setSelectedItem(null)
    }, [step])

    const prev = React.useCallback(() => {
        const currentIndex = stepOrder.indexOf(step)
        const prevStep = stepOrder[currentIndex - 1] ?? step
        setStepInternal(prevStep)
        setSelectedItem(null)
    }, [step])

    const reset = React.useCallback(() => {
        setConfig(defaultConfig)
        setStepInternal(stepOrder[0])
        setFontFiles(new Map()) // clear non-persisted font blobs too
        try {
            window.localStorage.removeItem(STORAGE_KEY)
        } catch {
            // ignore
        }
    }, [])

    const addFontFile = React.useCallback((file: File, meta: CustomFontEntry) => {
        // Store the binary blob
        setFontFiles((prev) => new Map(prev).set(meta.fileName, file))
        // Store metadata in config
        setConfig((prev) => {
            const existing = prev.theme.customFonts ?? []
            const filtered = existing.filter((f) => f.fileName !== meta.fileName)
            return {
                ...prev,
                theme: { ...prev.theme, customFonts: [...filtered, meta] },
            }
        })
    }, [])

    const removeFontFile = React.useCallback((fileName: string) => {
        setFontFiles((prev) => {
            const next = new Map(prev)
            next.delete(fileName)
            return next
        })
        setConfig((prev) => ({
            ...prev,
            theme: {
                ...prev.theme,
                customFonts: (prev.theme.customFonts ?? []).filter(
                    (f) => f.fileName !== fileName
                ),
            },
        }))
    }, [])

    const clearFontFiles = React.useCallback(() => {
        setFontFiles(new Map())
        setConfig((prev) => ({
            ...prev,
            theme: { ...prev.theme, customFonts: [] },
        }))
    }, [])

    const stepIndex = React.useMemo(
        () => Math.max(0, stepOrder.indexOf(step)),
        [step]
    )

    const value = React.useMemo<WizardContextValue>(
        () => ({
            config,
            step,
            stepIndex,
            isHydrated,
            selectedItem,
            updateConfig,
            setStep,
            next,
            prev,
            reset,
            setSelectedItem,
            fontFiles,
            addFontFile,
            removeFontFile,
            clearFontFiles,
        }),
        [config, isHydrated, next, prev, setStep, step, stepIndex, updateConfig, selectedItem, setSelectedItem, fontFiles, addFontFile, removeFontFile, clearFontFiles]
    )

    return (
        <WizardContext.Provider value= { value } > { children } </WizardContext.Provider>
    )
}

export function useWizard() {
    const ctx = React.useContext(WizardContext)
    if (!ctx) {
        throw new Error("useWizard must be used within WizardProvider")
    }
    return ctx
}
