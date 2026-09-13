/**
 * Values shared by the web and CLI generators.
 *
 * The public configuration objects are intentionally different at their
 * boundaries (the web wizard uses nested objects while the CLI uses prompts),
 * but template decisions must be made from the same normalized capabilities.
 */

export type NormalizedBackendProvider =
    | "none"
    | "firebase"
    | "supabase"
    | "appwrite"
    | "custom"

export interface BackendCapabilityInput {
    provider: NormalizedBackendProvider
    options?: Record<string, boolean | string | undefined>
}

export interface GeneratorCapabilityInput {
    stateManagement: string
    navigation: string
    backend: BackendCapabilityInput
    localizationEnabled: boolean
    usesDotenv: boolean
    usesHive: boolean
}

export interface GeneratorCapabilities {
    usesFirebase: boolean
    usesFirebaseAuth: boolean
    usesFirebaseFirestore: boolean
    usesFirebaseRealtimeDb: boolean
    usesFirebaseStorage: boolean
    usesFirebaseAnalytics: boolean
    usesFirebaseCrashlytics: boolean
    usesSupabase: boolean
    usesSupabaseAuth: boolean
    usesSupabaseDatabase: boolean
    usesSupabaseEdgeFunctions: boolean
    usesAppwrite: boolean
    usesAppwriteAuth: boolean
    usesAppwriteDatabase: boolean
    usesAppwriteStorage: boolean
    usesCustomBackend: boolean
    supportsLocalization: boolean
    usesDotenv: boolean
    requiresCodeGeneration: boolean
}

export interface OverlaySelection {
    architecture: string
    state: string
    backend: string
    routing?: string
    networking?: "dio" | "http"
    cachedImage: boolean
    localization: boolean
    storage: string[]
    utilities: string[]
    media: boolean
    device: string[]
    flavors: boolean
    dotenv: boolean
}

function enabled(options: Record<string, boolean | string | undefined> | undefined, key: string) {
    return options?.[key] === true
}

export function deriveGeneratorCapabilities(
    input: GeneratorCapabilityInput,
): GeneratorCapabilities {
    const { backend } = input
    const options = backend.options
    const usesFirebase = backend.provider === "firebase"
    const usesSupabase = backend.provider === "supabase"
    const usesAppwrite = backend.provider === "appwrite"

    return {
        usesFirebase,
        usesFirebaseAuth: usesFirebase && (
            enabled(options, "authEmail")
            || enabled(options, "authGoogle")
            || enabled(options, "authPhone")
        ),
        usesFirebaseFirestore: usesFirebase && enabled(options, "firestore"),
        usesFirebaseRealtimeDb: usesFirebase && enabled(options, "realtimeDb"),
        usesFirebaseStorage: usesFirebase && enabled(options, "storage"),
        usesFirebaseAnalytics: usesFirebase && enabled(options, "analytics"),
        usesFirebaseCrashlytics: usesFirebase && enabled(options, "crashlytics"),
        usesSupabase,
        usesSupabaseAuth: usesSupabase && enabled(options, "auth"),
        usesSupabaseDatabase: usesSupabase && enabled(options, "database"),
        usesSupabaseEdgeFunctions: usesSupabase && enabled(options, "edgeFunctions"),
        usesAppwrite,
        usesAppwriteAuth: usesAppwrite && enabled(options, "auth"),
        usesAppwriteDatabase: usesAppwrite && enabled(options, "database"),
        usesAppwriteStorage: usesAppwrite && enabled(options, "storage"),
        usesCustomBackend: backend.provider === "custom",
        supportsLocalization: input.localizationEnabled,
        usesDotenv: input.usesDotenv,
        requiresCodeGeneration:
            input.navigation === "auto_route"
            || input.navigation === "autoroute"
            || input.stateManagement === "mobx"
            || input.usesHive,
    }
}

export function selectOverlayKeys(
    config: GeneratorCapabilityInput & {
        architecture: string
        usesDio: boolean
        usesHttp: boolean
        usesCachedNetworkImage: boolean
        usesSecureStorage: boolean
        usesHive: boolean
        usesSharedPreferences: boolean
        usesPathProvider: boolean
        usesSharePlus: boolean
        usesPermissionHandler: boolean
        usesUrlLauncher: boolean
        usesGeolocator: boolean
        usesImagePicker: boolean
        usesFilePicker: boolean
        usesDeviceInfoPlus: boolean
        usesAppVersionUpdate: boolean
    },
): OverlaySelection {
    const networking = config.usesDio
        ? "dio"
        : config.usesHttp
            ? "http"
            : undefined

    return {
        architecture: config.architecture,
        state: config.stateManagement,
        backend: config.backend.provider,
        routing: config.navigation === "go_router" || config.navigation === "gorouter"
            ? "go_router"
            : config.navigation === "auto_route" || config.navigation === "autoroute"
                ? "auto_route"
                : undefined,
        networking,
        cachedImage: config.usesCachedNetworkImage,
        localization: config.localizationEnabled,
        storage: [
            ...(config.usesSecureStorage ? ["secure_storage"] : []),
            ...(config.usesHive ? ["hive"] : []),
            ...(config.usesSharedPreferences ? ["shared_preferences"] : []),
        ],
        utilities: [
            ...(config.usesPathProvider ? ["path_provider"] : []),
            ...(config.usesSharePlus ? ["share_plus"] : []),
            ...(config.usesPermissionHandler ? ["permission_handler"] : []),
            ...(config.usesUrlLauncher ? ["url_launcher"] : []),
            ...(config.usesGeolocator ? ["geolocator"] : []),
        ],
        media: config.usesImagePicker || config.usesFilePicker,
        device: [
            ...(config.usesDeviceInfoPlus ? ["device_info"] : []),
            ...(config.usesAppVersionUpdate ? ["app_version_update"] : []),
        ],
        flavors: true,
        dotenv: config.usesDotenv,
    }
}
