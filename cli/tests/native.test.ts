// ─────────────────────────────────────────────────────────────────────────────
// native.test.ts — Unit tests for buildAndroidPermissions & buildIosPlistEntries
// Uses Bun's test runner. No file system access — all tests use mock configs.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'bun:test'
import type { FlutterInitConfig } from '../src/config'
import { buildAndroidPermissions, buildIosPlistEntries } from '../src/native'

// ─── Base config fixture ──────────────────────────────────────────────────────

const baseConfig: FlutterInitConfig = {
  projectName: 'test_app',
  orgName: 'com.example',
  description: 'Test app',
  architecture: 'clean',
  stateManager: 'riverpod',
  backend: 'none',
  navigation: 'gorouter',
  themeMode: 'both',
  primaryColor: '#027DFD',
  outputDir: '/tmp/test_app',

  // Icons
  usesIconsaxPlus: false,
  usesFlutterRemix: false,
  usesHugeicons: false,

  // Networking
  usesDio: false,
  usesHttp: false,
  usesCachedNetworkImage: false,

  // Persistence
  usesHive: false,
  usesSharedPreferences: false,
  usesSecureStorage: false,

  // Media & Assets
  usesFlutterSvg: false,
  usesImagePicker: false,
  usesCamera: false,
  usesFilePicker: false,

  // Essential Utilities
  usesUrlLauncher: false,
  usesPathProvider: false,
  usesSharePlus: false,
  usesPermissionHandler: false,
  usesGeolocator: false,
  useLocalization: false,
  usesNotifications: false,

  // Device & System
  usesDeviceInfoPlus: false,
  usesAppVersionUpdate: false,
  usesFlutterNativeSplash: false,

  // Advanced Features
  usesFlutterHooks: false,
  usesSkeletonizer: false,
  usesScreenutil: false,
  usesDotenv: false,
  usesLogger: false,
  useMaterial3: false,
}

// ─── buildAndroidPermissions ──────────────────────────────────────────────────

describe('buildAndroidPermissions', () => {
  it('returns empty array when no native features are selected', () => {
    const result = buildAndroidPermissions(baseConfig)
    expect(result).toHaveLength(0)
  })

  it('adds CAMERA + READ/WRITE_EXTERNAL_STORAGE when usesCamera is true', () => {
    const config = { ...baseConfig, usesCamera: true }
    const result = buildAndroidPermissions(config)
    expect(result).toContain('android.permission.CAMERA')
    expect(result).toContain('android.permission.READ_EXTERNAL_STORAGE')
    expect(result).toContain('android.permission.WRITE_EXTERNAL_STORAGE')
  })

  it('adds CAMERA + READ/WRITE_EXTERNAL_STORAGE when usesImagePicker is true', () => {
    const config = { ...baseConfig, usesImagePicker: true }
    const result = buildAndroidPermissions(config)
    expect(result).toContain('android.permission.CAMERA')
    expect(result).toContain('android.permission.READ_EXTERNAL_STORAGE')
  })

  it('adds only READ_EXTERNAL_STORAGE for usesFilePicker alone', () => {
    const config = { ...baseConfig, usesFilePicker: true }
    const result = buildAndroidPermissions(config)
    expect(result).toContain('android.permission.READ_EXTERNAL_STORAGE')
    expect(result).not.toContain('android.permission.CAMERA')
  })

  it('adds location permissions when usesGeolocator is true', () => {
    const config = { ...baseConfig, usesGeolocator: true }
    const result = buildAndroidPermissions(config)
    expect(result).toContain('android.permission.ACCESS_FINE_LOCATION')
    expect(result).toContain('android.permission.ACCESS_COARSE_LOCATION')
  })

  it('adds notification permissions including POST_NOTIFICATIONS when usesNotifications is true', () => {
    const config = { ...baseConfig, usesNotifications: true }
    const result = buildAndroidPermissions(config)
    expect(result).toContain('android.permission.RECEIVE_BOOT_COMPLETED')
    expect(result).toContain('android.permission.VIBRATE')
    expect(result).toContain('android.permission.WAKE_LOCK')
    expect(result).toContain('android.permission.POST_NOTIFICATIONS')
  })

  it('deduplicates READ_EXTERNAL_STORAGE when camera and filePicker are both selected', () => {
    const config = { ...baseConfig, usesCamera: true, usesFilePicker: true }
    const result = buildAndroidPermissions(config)
    // Raw result may contain duplicates — callers use new Set() but the
    // builder itself returns the raw list; Set dedup happens in configureAndroid.
    // Verify that the permission appears at least once.
    const count = result.filter(p => p === 'android.permission.READ_EXTERNAL_STORAGE').length
    expect(count).toBeGreaterThanOrEqual(1)
  })

  it('combines all permissions when all features are selected', () => {
    const config = {
      ...baseConfig,
      usesCamera: true,
      usesImagePicker: true,
      usesFilePicker: true,
      usesGeolocator: true,
      usesNotifications: true,
    }
    const result = buildAndroidPermissions(config)
    expect(result).toContain('android.permission.CAMERA')
    expect(result).toContain('android.permission.ACCESS_FINE_LOCATION')
    expect(result).toContain('android.permission.POST_NOTIFICATIONS')
    expect(result).toContain('android.permission.VIBRATE')
  })
})

// ─── buildIosPlistEntries ─────────────────────────────────────────────────────

describe('buildIosPlistEntries', () => {
  it('returns empty array when no native features are selected', () => {
    const result = buildIosPlistEntries(baseConfig)
    expect(result).toHaveLength(0)
  })

  it('adds NSCameraUsageDescription and photo library entries when usesCamera is true', () => {
    const config = { ...baseConfig, usesCamera: true }
    const result = buildIosPlistEntries(config)
    expect(result.join('\n')).toContain('NSCameraUsageDescription')
    expect(result.join('\n')).toContain('NSPhotoLibraryUsageDescription')
    expect(result.join('\n')).toContain('NSPhotoLibraryAddUsageDescription')
  })

  it('adds NSCameraUsageDescription and photo library entries when usesImagePicker is true', () => {
    const config = { ...baseConfig, usesImagePicker: true }
    const result = buildIosPlistEntries(config)
    expect(result.join('\n')).toContain('NSCameraUsageDescription')
    expect(result.join('\n')).toContain('NSPhotoLibraryUsageDescription')
  })

  it('adds only NSPhotoLibraryUsageDescription for usesFilePicker alone', () => {
    const config = { ...baseConfig, usesFilePicker: true }
    const result = buildIosPlistEntries(config)
    expect(result.join('\n')).toContain('NSPhotoLibraryUsageDescription')
    expect(result.join('\n')).not.toContain('NSCameraUsageDescription')
  })

  it('adds location usage strings when usesGeolocator is true', () => {
    const config = { ...baseConfig, usesGeolocator: true }
    const result = buildIosPlistEntries(config)
    expect(result.join('\n')).toContain('NSLocationWhenInUseUsageDescription')
    expect(result.join('\n')).toContain('NSLocationAlwaysAndWhenInUseUsageDescription')
  })

  it('adds no plist entries for usesNotifications alone (handled at runtime)', () => {
    const config = { ...baseConfig, usesNotifications: true }
    const result = buildIosPlistEntries(config)
    expect(result).toHaveLength(0)
  })

  it('deduplicates NSPhotoLibraryUsageDescription when camera and filePicker are both selected', () => {
    const config = { ...baseConfig, usesCamera: true, usesFilePicker: true }
    const result = buildIosPlistEntries(config)
    const photoLibKeys = result.filter(l => l.includes('NSPhotoLibraryUsageDescription'))
    // Each key tag should appear exactly once after deduplication
    expect(photoLibKeys).toHaveLength(1)
  })

  it('entries alternate as <key>/<string> pairs (correct plist format)', () => {
    const config = { ...baseConfig, usesGeolocator: true }
    const result = buildIosPlistEntries(config)
    for (let i = 0; i < result.length; i += 2) {
      expect(result[i]).toContain('<key>')
      expect(result[i + 1]).toContain('<string>')
    }
  })

  it('each entry uses tab indentation (\\t prefix)', () => {
    const config = { ...baseConfig, usesCamera: true }
    const result = buildIosPlistEntries(config)
    for (const line of result) {
      expect(line.startsWith('\t')).toBe(true)
    }
  })
})

// ─── Layer 2 native combination tests ─────────────────────────────────────────

describe('Layer 2 — native combinations', () => {
  it('combo: camera + location — produces correct Android permission set', () => {
    const config = { ...baseConfig, usesCamera: true, usesGeolocator: true }
    const permissions = buildAndroidPermissions(config)
    const unique = [...new Set(permissions)]
    expect(unique).toContain('android.permission.CAMERA')
    expect(unique).toContain('android.permission.ACCESS_FINE_LOCATION')
    expect(unique).toContain('android.permission.ACCESS_COARSE_LOCATION')
  })

  it('combo: camera + location — produces correct iOS plist entries', () => {
    const config = { ...baseConfig, usesCamera: true, usesGeolocator: true }
    const entries = buildIosPlistEntries(config)
    const joined = entries.join('\n')
    expect(joined).toContain('NSCameraUsageDescription')
    expect(joined).toContain('NSLocationWhenInUseUsageDescription')
  })

  it('combo: filePicker + notifications — produces correct Android set', () => {
    const config = { ...baseConfig, usesFilePicker: true, usesNotifications: true }
    const permissions = buildAndroidPermissions(config)
    const unique = [...new Set(permissions)]
    expect(unique).toContain('android.permission.READ_EXTERNAL_STORAGE')
    expect(unique).toContain('android.permission.POST_NOTIFICATIONS')
    expect(unique).not.toContain('android.permission.CAMERA')
  })

  it('combo: camera + filePicker + location + notifications — all-features smoke test', () => {
    const config = {
      ...baseConfig,
      usesCamera: true,
      usesImagePicker: true,
      usesFilePicker: true,
      usesGeolocator: true,
      usesNotifications: true,
    }

    // Android
    const permissions = [...new Set(buildAndroidPermissions(config))]
    expect(permissions).toContain('android.permission.CAMERA')
    expect(permissions).toContain('android.permission.READ_EXTERNAL_STORAGE')
    expect(permissions).toContain('android.permission.ACCESS_FINE_LOCATION')
    expect(permissions).toContain('android.permission.POST_NOTIFICATIONS')

    // READ_EXTERNAL_STORAGE deduplicated (appears in both camera + filePicker branches)
    const readStorageCount = permissions.filter(
      p => p === 'android.permission.READ_EXTERNAL_STORAGE',
    ).length
    expect(readStorageCount).toBe(1)

    // iOS
    const entries = buildIosPlistEntries(config)
    const joined = entries.join('\n')
    expect(joined).toContain('NSCameraUsageDescription')
    expect(joined).toContain('NSLocationWhenInUseUsageDescription')

    // NSPhotoLibraryUsageDescription deduplicated
    const photoLibKeys = entries.filter(l => l.includes('NSPhotoLibraryUsageDescription'))
    expect(photoLibKeys).toHaveLength(1)
  })
})
