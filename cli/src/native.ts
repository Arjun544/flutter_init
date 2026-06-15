// ─────────────────────────────────────────────────────────────────────────────
// FlutterInit CLI — Native File Configurator
// Post-processes AndroidManifest.xml and Info.plist to inject permissions and
// usage descriptions required by selected packages.
//
// Runs after flutter create (files exist) but before flutter pub get.
// All steps are non-fatal: a failure logs instructions and continues.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { log } from '@clack/prompts'
import type { FlutterInitConfig } from './config'

// ─── Entry point ──────────────────────────────────────────────────────────────

export async function configureNativeFiles(config: FlutterInitConfig): Promise<void> {
  if (!hasAnyNativeFeature(config)) return

  await configureAndroid(config)
  await configureIos(config)
}

function hasAnyNativeFeature(config: FlutterInitConfig): boolean {
  return (
    config.usesCamera ||
    config.usesImagePicker ||
    config.usesFilePicker ||
    config.usesGeolocator ||
    config.usesNotifications
  )
}

// ─── Android ──────────────────────────────────────────────────────────────────

async function configureAndroid(config: FlutterInitConfig): Promise<void> {
  const manifestPath = join(
    config.outputDir,
    'android',
    'app',
    'src',
    'main',
    'AndroidManifest.xml',
  )

  try {
    let manifest = readFileSync(manifestPath, 'utf-8')

    const permissions = buildAndroidPermissions(config)
    if (permissions.length === 0) return

    // Deduplicate in case multiple features share the same permission
    const unique = [...new Set(permissions)]

    // 4-space indent — standard AndroidManifest.xml convention
    const permissionsBlock = unique
      .map(p => `    <uses-permission android:name="${p}"/>`)
      .join('\n')

    // Inject before <application — always the correct position in AndroidManifest.xml.
    // flutter create always generates <application as a top-level child of <manifest>.
    manifest = manifest.replace(
      /(\s*)<application/,
      `\n${permissionsBlock}\n\n$1<application`,
    )

    writeFileSync(manifestPath, manifest, 'utf-8')
  } catch (err) {
    log.warn(`AndroidManifest.xml configuration failed: ${(err as Error).message}`)
    log.warn(`File path: ${manifestPath}`)
    logManualAndroidInstructions(config)
    return
  }

  await configureAndroidBuildGradle(config)
}

async function configureAndroidBuildGradle(config: FlutterInitConfig): Promise<void> {
  const gradlePath = join(
    config.outputDir,
    'android',
    'app',
    'build.gradle',
  )

  try {
    // geolocator requires minSdk 19 (already met by Flutter default of 21).
    // flutter_local_notifications requires minSdk 21 (already met).
    // No SDK bumps needed for the current package set.
    // This function is a no-op stub — easy to add bumps here when future
    // packages require a higher minSdk.
    //
    // Example for a future bump:
    //   let gradle = readFileSync(gradlePath, 'utf-8')
    //   gradle = gradle.replace(/minSdk\s+\d+/, 'minSdk 23')
    //   writeFileSync(gradlePath, gradle, 'utf-8')
    void gradlePath
  } catch (err) {
    log.warn(`build.gradle configuration failed: ${(err as Error).message}`)
  }
}

// ─── Android permission builder (exported for unit tests) ─────────────────────

export function buildAndroidPermissions(config: FlutterInitConfig): string[] {
  const permissions: string[] = []

  if (config.usesCamera || config.usesImagePicker) {
    permissions.push(
      'android.permission.CAMERA',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
    )
  }

  if (config.usesFilePicker) {
    permissions.push(
      'android.permission.READ_EXTERNAL_STORAGE',
    )
  }

  if (config.usesGeolocator) {
    permissions.push(
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
    )
  }

  if (config.usesNotifications) {
    permissions.push(
      'android.permission.RECEIVE_BOOT_COMPLETED',
      'android.permission.VIBRATE',
      'android.permission.WAKE_LOCK',
      // POST_NOTIFICATIONS is required on Android 13+ (API 33+).
      // Adding it unconditionally is safe — ignored on lower API levels.
      'android.permission.POST_NOTIFICATIONS',
    )
  }

  return permissions
}

// ─── iOS ──────────────────────────────────────────────────────────────────────

async function configureIos(config: FlutterInitConfig): Promise<void> {
  const plistPath = join(
    config.outputDir,
    'ios',
    'Runner',
    'Info.plist',
  )

  try {
    let plist = readFileSync(plistPath, 'utf-8')

    const entries = buildIosPlistEntries(config)
    if (entries.length === 0) return

    const entriesBlock = entries.join('\n')

    // Inject before the closing </dict> of the root dict.
    // Info.plist always ends with </dict>\n</plist>.
    // flutter create output is predictable here.
    plist = plist.replace(
      /(<\/dict>\s*<\/plist>)/,
      `${entriesBlock}\n$1`,
    )

    writeFileSync(plistPath, plist, 'utf-8')
  } catch (err) {
    log.warn(`Info.plist configuration failed: ${(err as Error).message}`)
    log.warn(`File path: ${plistPath}`)
    logManualIosInstructions(config)
    return
  }

  await configureIosPodfile(config)
}

async function configureIosPodfile(config: FlutterInitConfig): Promise<void> {
  const podfilePath = join(config.outputDir, 'ios', 'Podfile')

  try {
    // geolocator requires iOS 10+ (already met by Flutter default of 12.0).
    // image_picker requires iOS 11+ (already met).
    // flutter_local_notifications requires iOS 10+ (already met).
    // No platform bumps needed for the current package set.
    // This function is a no-op stub — easy to add bumps here when future
    // packages require a higher deployment target.
    //
    // Example for a future bump:
    //   let podfile = readFileSync(podfilePath, 'utf-8')
    //   podfile = podfile.replace(/platform :ios, '\d+\.\d+'/, "platform :ios, '13.0'")
    //   writeFileSync(podfilePath, podfile, 'utf-8')
    void podfilePath
  } catch (err) {
    log.warn(`Podfile configuration failed: ${(err as Error).message}`)
  }
}

// ─── iOS plist entry builder (exported for unit tests) ────────────────────────

export function buildIosPlistEntries(config: FlutterInitConfig): string[] {
  const entries: string[] = []

  if (config.usesCamera || config.usesImagePicker) {
    entries.push(
      '\t<key>NSCameraUsageDescription</key>',
      '\t<string>This app requires camera access</string>',
      '\t<key>NSPhotoLibraryUsageDescription</key>',
      '\t<string>This app requires photo library access</string>',
      '\t<key>NSPhotoLibraryAddUsageDescription</key>',
      '\t<string>This app requires photo library write access</string>',
    )
  }

  if (config.usesFilePicker) {
    // file_picker on iOS does not require plist entries for the document
    // picker. Entries are only needed when accessing the photo library.
    entries.push(
      '\t<key>NSPhotoLibraryUsageDescription</key>',
      '\t<string>This app requires photo library access</string>',
    )
  }

  if (config.usesGeolocator) {
    entries.push(
      '\t<key>NSLocationWhenInUseUsageDescription</key>',
      '\t<string>This app requires location access</string>',
      '\t<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>',
      '\t<string>This app requires location access</string>',
    )
  }

  if (config.usesNotifications) {
    // flutter_local_notifications does not require Info.plist entries —
    // UNUserNotificationCenter usage is handled at runtime.
    // Block intentionally empty; kept for future additions.
  }

  // Deduplicate by key — camera + filePicker both need NSPhotoLibraryUsageDescription.
  return deduplicatePlistEntries(entries)
}

// ─── Deduplication ────────────────────────────────────────────────────────────

function deduplicatePlistEntries(entries: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (let i = 0; i < entries.length; i++) {
    const line = entries[i]!
    if (line.includes('<key>')) {
      if (seen.has(line)) {
        i++ // skip the immediately following <string> line too
        continue
      }
      seen.add(line)
    }
    result.push(line)
  }

  return result
}

// ─── Manual instruction fallbacks ─────────────────────────────────────────────

function logManualAndroidInstructions(config: FlutterInitConfig): void {
  const permissions = buildAndroidPermissions(config)
  if (permissions.length === 0) return

  log.warn('Add these manually to android/app/src/main/AndroidManifest.xml')
  log.warn('Place them before the <application tag:\n')
  for (const p of [...new Set(permissions)]) {
    log.message(`    <uses-permission android:name="${p}"/>`)
  }
}

function logManualIosInstructions(config: FlutterInitConfig): void {
  const entries = buildIosPlistEntries(config)
  if (entries.length === 0) return

  log.warn('Add these manually to ios/Runner/Info.plist')
  log.warn('Place them before the closing </dict> tag:\n')
  for (const entry of entries) {
    log.message(entry)
  }
}
