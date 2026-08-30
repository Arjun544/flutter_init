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
import {
    WIZARD_CONFIG_STORAGE_KEY,
    WIZARD_CONFIG_SYNC_CHANNEL,
    configsEqual,
    persistWizardConfig,
    type WizardConfigSyncMessage,
} from "@/app/lib/state/configSync"

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
    const [fontFiles, setFontFiles] = React.useState<Map<string, File>>(new Map())
    const applyingRemoteRef = React.useRef(false)

    const applyRemoteConfig = React.useCallback(
        (candidate: unknown, source: "storage" | "broadcast") => {
            const next = safeParseConfig(candidate)
            setConfig((prev) => {
                // localStorage is always written with customFonts wiped. Applying
                // that via the storage event would clear live font metadata in
                // the tab that still holds File blobs (and in Preview code after
                // a metadata broadcast). BroadcastChannel carries the real config.
                const shouldPreserveFonts =
                    source === "storage" &&
                    (prev.theme.customFonts?.length ?? 0) > 0 &&
                    (next.theme.customFonts?.length ?? 0) === 0

                const merged = shouldPreserveFonts
                    ? {
                          ...next,
                          theme: {
                              ...next.theme,
                              customFonts: prev.theme.customFonts,
                          },
                      }
                    : next

                if (configsEqual(prev, merged)) return prev
                applyingRemoteRef.current = true
                return merged
            })
        },
        []
    )

    React.useEffect(() => {
        if (typeof window === "undefined") return

        try {
            const cached = window.localStorage.getItem(WIZARD_CONFIG_STORAGE_KEY)
            if (cached) {
                setConfig(safeParseConfig(JSON.parse(cached)))
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
            if (applyingRemoteRef.current) {
                applyingRemoteRef.current = false
                window.localStorage.setItem(
                    WIZARD_CONFIG_STORAGE_KEY,
                    JSON.stringify({
                        ...config,
                        theme: { ...config.theme, customFonts: [] },
                    })
                )
            } else {
                persistWizardConfig(config)
            }

            if (process.env.NODE_ENV === "development") {
                fetch("/api/dev/sync-config", {
                    method: "POST",
                    body: JSON.stringify(config),
                    headers: { "Content-Type": "application/json" },
                }).catch(() => {
                    /* Silent failure */
                })
            }
        } catch {
            // ignore write errors
        }
    }, [config, isHydrated])

    React.useEffect(() => {
        if (!isHydrated || typeof window === "undefined") return

        const onStorage = (event: StorageEvent) => {
            if (event.key !== WIZARD_CONFIG_STORAGE_KEY || !event.newValue) return
            try {
                applyRemoteConfig(JSON.parse(event.newValue), "storage")
            } catch {
                // ignore
            }
        }

        window.addEventListener("storage", onStorage)

        let channel: BroadcastChannel | null = null
        if (typeof BroadcastChannel !== "undefined") {
            channel = new BroadcastChannel(WIZARD_CONFIG_SYNC_CHANNEL)
            channel.onmessage = (event: MessageEvent<WizardConfigSyncMessage>) => {
                if (event.data?.type !== "config") return
                applyRemoteConfig(event.data.config, "broadcast")
            }
        }

        return () => {
            window.removeEventListener("storage", onStorage)
            channel?.close()
        }
    }, [applyRemoteConfig, isHydrated])

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
        setSelectedItem(null)
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
        setFontFiles(new Map())
        try {
            window.localStorage.removeItem(WIZARD_CONFIG_STORAGE_KEY)
        } catch {
            // ignore
        }
    }, [])

    const addFontFile = React.useCallback((file: File, meta: CustomFontEntry) => {
        setFontFiles((prev) => new Map(prev).set(meta.fileName, file))
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
        [config, step, stepIndex, isHydrated, selectedItem, updateConfig, setStep, next, prev, reset, fontFiles, addFontFile, removeFontFile, clearFontFiles]
    )

    return (
        <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
    )
}

export function useWizard() {
    const ctx = React.useContext(WizardContext)
    if (!ctx) {
        throw new Error("useWizard must be used within WizardProvider")
    }
    return ctx
}
