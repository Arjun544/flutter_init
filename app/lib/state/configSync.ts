import type { ScaffoldConfig } from "@/app/lib/config/schema"

export const WIZARD_CONFIG_STORAGE_KEY = "flutter_scaffold_config_v1"
export const WIZARD_CONFIG_SYNC_CHANNEL = "flutter_init_wizard_config_v1"

export type WizardConfigSyncMessage = {
  type: "config"
  config: ScaffoldConfig
  at: number
}

export function persistWizardConfig(config: ScaffoldConfig) {
  // Font File binaries can't be serialized. Strip customFonts from localStorage
  // so a reload doesn't show orphaned metadata without blobs — but broadcast the
  // live config (including font metadata) so sibling tabs like Preview code stay
  // in sync without wiping the tab that still holds the files.
  const configToSave: ScaffoldConfig = {
    ...config,
    theme: {
      ...config.theme,
      customFonts: [],
    },
  }
  window.localStorage.setItem(
    WIZARD_CONFIG_STORAGE_KEY,
    JSON.stringify(configToSave)
  )
  broadcastWizardConfig(config)
  return configToSave
}

export function broadcastWizardConfig(config: ScaffoldConfig) {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return
  }
  try {
    const channel = new BroadcastChannel(WIZARD_CONFIG_SYNC_CHANNEL)
    const message: WizardConfigSyncMessage = {
      type: "config",
      config,
      at: Date.now(),
    }
    channel.postMessage(message)
    channel.close()
  } catch {
    // ignore
  }
}

export function configsEqual(a: ScaffoldConfig, b: ScaffoldConfig): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}
