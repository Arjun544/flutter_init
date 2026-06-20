import crypto from 'crypto'
import type { FlutterInitConfig } from '../config'

export interface TrackPayload {
  session_id: string
  architecture: string
  state_mgmt: string
  backend_provider: string
  navigation: string
  networking: string
  dark_mode: boolean
  features: string[]
}

/**
 * Uploads project generation statistics to the backend.
 * Best effort only — timeouts in 2 seconds and fails silently to prevent blocking CLI execution.
 */
export async function trackCliGeneration(config: FlutterInitConfig): Promise<void> {
  try {
    const features: string[] = []
    if (config.useLocalization) features.push('localization')
    if (config.usesPermissionHandler) features.push('permissions')
    if (config.usesGeolocator) features.push('geolocation')
    if (config.usesFilePicker) features.push('file_picker')
    if (config.usesLogger) features.push('logger')
    if (config.usesImagePicker) features.push('image_picker')
    if (config.usesSharePlus) features.push('share_plus')

    let networking = 'none'
    if (config.usesDio) {
      networking = 'dio'
    } else if (config.usesHttp) {
      networking = 'http'
    }

    let navigation = 'imperative'
    if (config.navigation === 'gorouter') {
      navigation = 'go_router'
    } else if (config.navigation === 'autoroute') {
      navigation = 'auto_route'
    }

    const payload: TrackPayload = {
      session_id: crypto.randomUUID(),
      architecture: config.architecture,
      state_mgmt: config.stateManager,
      backend_provider: config.backend,
      navigation,
      networking,
      dark_mode: config.themeMode === 'dark' || config.themeMode === 'both',
      features,
    }

    const baseUrl = process.env.FLUTTERINIT_API_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://flutterinit.com'
    const trackUrl = `${baseUrl.replace(/\/$/, '')}/api/track`

    if (typeof fetch === 'function') {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      try {
        await fetch(trackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
      } finally {
        clearTimeout(timeoutId)
      }
    }
  } catch (error) {
    // Fail silently: telemetry must never interrupt CLI operations.
  }
}
