"use client"

import type { ScaffoldConfig } from "@/app/lib/config/schema"

const SESSION_KEY = "fi_session_id"

function getSessionId() {
    const existing = window.sessionStorage.getItem(SESSION_KEY)
    if (existing) return existing

    const generated = crypto.randomUUID()
    window.sessionStorage.setItem(SESSION_KEY, generated)
    return generated
}

function deriveNetworking(config: ScaffoldConfig) {
    if (config.misc.usesDio) return "dio"
    if (config.misc.usesHttp) return "http"
    return "none"
}

function deriveFeatures(config: ScaffoldConfig) {
    const features: string[] = []

    if (config.localization.enabled) features.push("localization")
    if (config.misc.usesPermissionHandler) features.push("permissions")
    if (config.misc.usesGeolocator) features.push("geolocation")
    if (config.misc.usesFilePicker) features.push("file_picker")
    if (config.misc.usesLogger) features.push("logger")
    if (config.misc.usesImagePicker) features.push("image_picker")
    if (config.misc.usesSharePlus) features.push("share_plus")

    return features
}

export function trackGeneration(config: ScaffoldConfig) {
    try {
        void fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                session_id: getSessionId(),
                architecture: config.architecture,
                state_mgmt: config.stateManagement,
                backend_provider: config.backend.provider,
                navigation: config.navigation,
                networking: deriveNetworking(config),
                dark_mode: config.theme.darkMode.enabled,
                features: deriveFeatures(config),
            }),
            keepalive: true,
        })
    } catch {
        // Best effort only: generation must never fail due to analytics.
    }
}
