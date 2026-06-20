import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import type { FlutterInitConfig } from '../src/config'
import { trackCliGeneration, type TrackPayload } from '../src/utils/analytics'

const BASE_CONFIG: FlutterInitConfig = {
  projectName: 'test_app',
  orgName: 'com.example',
  description: 'Test project description',
  architecture: 'clean',
  stateManager: 'riverpod',
  backend: 'firebase',
  navigation: 'gorouter',
  themeMode: 'both',
  primaryColor: '#027DFD',
  outputDir: '/mock/output/dir',

  usesIconsaxPlus: false,
  usesFlutterRemix: false,
  usesHugeicons: false,

  usesDio: true,
  usesHttp: false,
  usesCachedNetworkImage: false,

  usesHive: false,
  usesSharedPreferences: false,
  usesSecureStorage: false,

  usesFlutterSvg: false,
  usesImagePicker: false,
  usesFilePicker: false,
  usesCamera: false,
  usesFlutterNativeSplash: false,

  usesUrlLauncher: false,
  usesPathProvider: false,
  usesSharePlus: false,
  usesPermissionHandler: false,
  usesGeolocator: false,
  useLocalization: false,
  usesNotifications: false,

  usesDeviceInfoPlus: false,
  usesAppVersionUpdate: false,

  usesFlutterHooks: false,
  usesSkeletonizer: false,
  usesScreenutil: false,
  usesDotenv: false,
  usesLogger: false,
  useMaterial3: false,
}

describe('Telemetry Analytics Utility', () => {
  let originalFetch: typeof fetch
  let fetchCalls: { url: string; options: RequestInit }[]
  let fetchErrorToThrow: Error | null = null

  beforeEach(() => {
    originalFetch = globalThis.fetch
    fetchCalls = []
    fetchErrorToThrow = null

    // Mock fetch globally
    globalThis.fetch = (async (url: string | URL | Request, options?: RequestInit) => {
      if (fetchErrorToThrow) {
        throw fetchErrorToThrow
      }
      fetchCalls.push({ url: String(url), options: options || {} })
      return {
        ok: true,
        status: 202,
        json: async () => ({ ok: true }),
      } as Response
    }) as typeof fetch

    // Clean env variables
    delete process.env.FLUTTERINIT_API_URL
    delete process.env.NEXT_PUBLIC_APP_URL
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    delete process.env.FLUTTERINIT_API_URL
    delete process.env.NEXT_PUBLIC_APP_URL
  })

  it('correctly maps configuration fields to TrackPayload', async () => {
    const config: FlutterInitConfig = {
      ...BASE_CONFIG,
      architecture: 'mvvm',
      stateManager: 'bloc',
      backend: 'supabase',
      navigation: 'autoroute',
      themeMode: 'dark',
      usesDio: false,
      usesHttp: true,
      useLocalization: true,
      usesPermissionHandler: true,
      usesGeolocator: true,
      usesFilePicker: true,
      usesLogger: true,
      usesImagePicker: true,
      usesSharePlus: true,
    }

    await trackCliGeneration(config)

    expect(fetchCalls.length).toBe(1)
    expect(fetchCalls[0].url).toBe('https://flutterinit.com/api/track')

    const body: TrackPayload = JSON.parse(fetchCalls[0].options.body as string)
    expect(body.session_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    expect(body.architecture).toBe('mvvm')
    expect(body.state_mgmt).toBe('bloc')
    expect(body.backend_provider).toBe('supabase')
    expect(body.navigation).toBe('auto_route')
    expect(body.networking).toBe('http')
    expect(body.dark_mode).toBe(true)
    expect(body.features).toContain('localization')
    expect(body.features).toContain('permissions')
    expect(body.features).toContain('geolocation')
    expect(body.features).toContain('file_picker')
    expect(body.features).toContain('logger')
    expect(body.features).toContain('image_picker')
    expect(body.features).toContain('share_plus')
  })

  it('correctly defaults navigation, networking, and dark mode features', async () => {
    const config: FlutterInitConfig = {
      ...BASE_CONFIG,
      navigation: 'none',
      usesDio: false,
      usesHttp: false,
      themeMode: 'light',
    }

    await trackCliGeneration(config)

    expect(fetchCalls.length).toBe(1)
    const body: TrackPayload = JSON.parse(fetchCalls[0].options.body as string)
    expect(body.navigation).toBe('imperative')
    expect(body.networking).toBe('none')
    expect(body.dark_mode).toBe(false)
    expect(body.features.length).toBe(0)
  })

  it('respects FLUTTERINIT_API_URL and NEXT_PUBLIC_APP_URL environment overrides', async () => {
    process.env.FLUTTERINIT_API_URL = 'http://localhost:3000/'
    await trackCliGeneration(BASE_CONFIG)
    expect(fetchCalls[0].url).toBe('http://localhost:3000/api/track')

    fetchCalls = []
    delete process.env.FLUTTERINIT_API_URL
    process.env.NEXT_PUBLIC_APP_URL = 'https://dev.flutterinit.com'
    await trackCliGeneration(BASE_CONFIG)
    expect(fetchCalls[0].url).toBe('https://dev.flutterinit.com/api/track')
  })

  it('fails gracefully when fetch rejects (offline or server error)', async () => {
    fetchErrorToThrow = new Error('Network error')

    // Should not throw or crash the CLI
    await expect(trackCliGeneration(BASE_CONFIG)).resolves.toBeUndefined()
  })

  it('supplements an AbortSignal to prevent hanging', async () => {
    await trackCliGeneration(BASE_CONFIG)
    expect(fetchCalls[0].options.signal).toBeDefined()
    expect(fetchCalls[0].options.signal instanceof AbortSignal).toBe(true)
  })
})
