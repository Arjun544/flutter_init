import { z } from "zod"

export const themePresetSchema = z.enum(["material3", "cupertino", "custom"])
export type ThemePreset = z.infer<typeof themePresetSchema>

export const themePresetOptions = [
    { value: "material3", label: "Material 3", description: "Google's modern design system." },
    { value: "cupertino", label: "Cupertino", description: "Native iOS-style widgets." },
    { value: "custom", label: "Custom", description: "Generic base for unique designs." },
] as const satisfies Array<{ value: ThemePreset; label: string; description: string }>

export const stateManagementSchema = z.enum([
    "provider",
    "riverpod",
    "bloc",
    "getx",
    "mobx",
    "none",
])
export type StateManagement = z.infer<typeof stateManagementSchema>

export const backendProviderSchema = z.enum([
    "none",
    "firebase",
    "supabase",
    "appwrite",
    "custom",
])
export type BackendProvider = z.infer<typeof backendProviderSchema>

export const navigationSchema = z.enum([
    "imperative",
    "go_router",
    "getx",
    "auto_route",
])
export type NavigationStyle = z.infer<typeof navigationSchema>

export const architectureSchema = z.enum([
    "mvc",
    "mvvm",
    "clean",
    "feature-first",
    "layer-first",
])
export type ArchitectureStyle = z.infer<typeof architectureSchema>

const iconPackSchema = z.object({
    default: z.literal(true),
    iconsax_plus: z.boolean(),
    flutter_remix: z.boolean(),
    hugeicons: z.boolean(),
})
export type IconPackConfig = z.infer<typeof iconPackSchema>

export type StepId =
    | "basics"
    | "theme"
    | "icons"
    | "architecture"
    | "state"
    | "navigation"
    | "backend"
    | "localization"
    | "misc"
    | "generate"

export const stepOrder: StepId[] = [
    "basics",
    "theme",
    "icons",
    "architecture",
    "state",
    "navigation",
    "backend",
    "localization",
    "misc",
    "generate",
]


const darkModeSchema = z.object({
    enabled: z.boolean(),
    system: z.boolean(),
})

const themeSchema = z.object({
    preset: themePresetSchema,
    primaryColor: z.string().optional(),
    darkMode: darkModeSchema,
})
export type ThemeConfig = z.infer<typeof themeSchema>

const firebaseSchema = z.object({
    authEmail: z.boolean(),
    authGoogle: z.boolean(),
    authPhone: z.boolean(),
    firestore: z.boolean(),
    realtimeDb: z.boolean(),
    storage: z.boolean(),
    analytics: z.boolean(),
    crashlytics: z.boolean(),
})

const supabaseSchema = z.object({
    auth: z.boolean(),
    database: z.boolean(),
    edgeFunctions: z.boolean(),
})

const appwriteSchema = z.object({
    auth: z.boolean(),
    database: z.boolean(),
    storage: z.boolean(),
})

const customSchema = z.object({
    baseUrl: z.string().optional(),
})

const backendSchema = z.discriminatedUnion("provider", [
    z.object({ provider: z.literal("none") }),
    z.object({ provider: z.literal("firebase"), options: firebaseSchema }),
    z.object({ provider: z.literal("supabase"), options: supabaseSchema }),
    z.object({ provider: z.literal("appwrite"), options: appwriteSchema }),
    z.object({ provider: z.literal("custom"), options: customSchema }),
])
export type BackendConfig = z.infer<typeof backendSchema>

const miscSchema = z.object({
    usesScreenutil: z.boolean(),
    usesFlutterNativeSplash: z.boolean().default(true),
    usesDio: z.boolean(),
    usesHttp: z.boolean(),
    usesHive: z.boolean(),
    usesSharedPreferences: z.boolean(),
    usesSecureStorage: z.boolean(),
    usesCachedNetworkImage: z.boolean(),
    usesFlutterSvg: z.boolean(),
    usesSkeletonizer: z.boolean(),
    usesDotenv: z.boolean(),
    usesLogger: z.boolean(),
    // Hooks
    usesFlutterHooks: z.boolean(),
    // Media
    usesImagePicker: z.boolean(),
    usesFilePicker: z.boolean(),
    // Utilities
    usesUrlLauncher: z.boolean(),
    usesPathProvider: z.boolean(),
    usesSharePlus: z.boolean(),
    usesPermissionHandler: z.boolean(),
    // Device
    usesDeviceInfoPlus: z.boolean(),
    usesAppVersionUpdate: z.boolean(),
    usesGeolocator: z.boolean(),
})
export type MiscConfig = z.infer<typeof miscSchema>

const localizationSchema = z.object({
    enabled: z.boolean(),
    supportedLocales: z.array(z.string()).min(1),
})
export type LocalizationConfig = z.infer<typeof localizationSchema>

export const scaffoldConfigSchema = z.object({
    appName: z.string().min(1, "App name is required"),
    packageId: z.string().min(1, "Package id is required"),
    description: z.string().optional(),
    theme: themeSchema,
    stateManagement: stateManagementSchema,
    backend: backendSchema,
    localization: localizationSchema,
    navigation: navigationSchema,
    architecture: architectureSchema,
    icons: iconPackSchema.default({
        default: true,
        iconsax_plus: false,
        flutter_remix: false,
        hugeicons: false,
    }),
    misc: miscSchema.default({
        usesScreenutil: true,
        usesFlutterNativeSplash: true,
        usesDio: false,
        usesHttp: false,
        usesHive: false,
        usesSharedPreferences: true,
        usesSecureStorage: true,
        usesCachedNetworkImage: true,
        usesFlutterSvg: true,
        usesSkeletonizer: true,
        usesDotenv: true,
        usesLogger: true,
        usesFlutterHooks: false,
        usesImagePicker: false,
        usesFilePicker: false,
        usesUrlLauncher: true,
        usesPathProvider: true,
        usesSharePlus: false,
        usesPermissionHandler: true,
        usesDeviceInfoPlus: true,
        usesAppVersionUpdate: true,
        usesGeolocator: false,

    }),
}).refine((data) => {
    if (data.backend.provider === "custom") {
        return data.misc.usesDio || data.misc.usesHttp
    }
    return true
}, {
    message: "Either Dio or HTTP client must be enabled when using Custom Backend",
    path: ["misc"],
})

export type ScaffoldConfig = z.infer<typeof scaffoldConfigSchema>

export function derivePackageId(appName: string) {
    const cleaned = appName
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/^_+|_+$/g, "")

    if (!cleaned) {
        return "com.example.app"
    }

    return `com.example.${cleaned}`
}

export const defaultConfig: ScaffoldConfig = {
    appName: "Flutter Starter",
    packageId: derivePackageId("Flutter Starter"),
    description: "Production-ready Flutter scaffold generated by the wizard.",
    theme: {
        preset: "material3",
        primaryColor: "#6750A4",
        darkMode: { enabled: true, system: true },
    },
    icons: {
        default: true,
        iconsax_plus: false,
        flutter_remix: false,
        hugeicons: false,
    },
    stateManagement: "riverpod",
    backend: { provider: "none" },
    localization: { enabled: true, supportedLocales: ["en", "es"] },
    navigation: "go_router",
    architecture: "feature-first",
    misc: {
        usesScreenutil: true,
        usesFlutterNativeSplash: true,
        usesDio: false,
        usesHttp: false,
        usesHive: false,
        usesSharedPreferences: true,
        usesSecureStorage: true,
        usesCachedNetworkImage: true,
        usesFlutterSvg: true,
        usesSkeletonizer: true,
        usesDotenv: true,
        usesLogger: true,
        usesFlutterHooks: false,
        usesImagePicker: false,
        usesFilePicker: false,
        usesUrlLauncher: true,
        usesPathProvider: true,
        usesSharePlus: false,
        usesPermissionHandler: true,
        usesDeviceInfoPlus: true,
        usesAppVersionUpdate: true,
        usesGeolocator: false,

    },
}

export function defaultBackendConfig(
    provider: BackendProvider = "none"
): BackendConfig {
    switch (provider) {
        case "firebase":
            return {
                provider: "firebase",
                options: {
                    authEmail: true,
                    authGoogle: true,
                    authPhone: false,
                    firestore: true,
                    realtimeDb: false,
                    storage: true,
                    analytics: true,
                    crashlytics: true,
                },
            }
        case "supabase":
            return {
                provider: "supabase",
                options: { auth: true, database: true, edgeFunctions: true },
            }
        case "appwrite":
            return {
                provider: "appwrite",
                options: { auth: true, database: true, storage: true },
            }
        case "custom":
            return { provider: "custom", options: { baseUrl: "" } }
        case "none":
        default:
            return { provider: "none" }
    }
}

export const backendOptions = [
    { value: "none", label: "None", description: "Offline-only or manual setup." },
    { value: "firebase", label: "Firebase", description: "Google's cloud backend (Auth, Firestore)." },
    { value: "supabase", label: "Supabase", description: "Open-source Postgres alternative." },
    { value: "appwrite", label: "Appwrite", description: "Unified platform for Auth & Database." },
    { value: "custom", label: "Custom Backend", description: "Connect to your own API or service." },
] as const satisfies Array<{ value: BackendProvider; label: string; description: string }>

export const stateManagementOptions = [
    { value: "provider", label: "Provider", description: "Simple, Google-recommended state management." },
    { value: "riverpod", label: "Riverpod", description: "Compile-safe improvement over Provider." },
    { value: "bloc", label: "Bloc", description: "Predictable, enterprise-ready state management." },
    { value: "getx", label: "GetX", description: "All-in-one state, DI, and routing solution." },
    { value: "mobx", label: "MobX", description: "Reactive state via observables and actions." },
    { value: "none", label: "None (setState)", description: "Vanilla state management using setState." },
] as const satisfies Array<{ value: StateManagement; label: string; description: string }>

export const architectureOptions = [
    { value: "mvc", label: "MVC", description: "Standard Model-View-Controller for small projects." },
    { value: "mvvm", label: "MVVM", description: "Reactive data binding with testable logic." },
    { value: "clean", label: "Clean Architecture", description: "Strict separation of concerns for large apps." },
    { value: "feature-first", label: "Feature-first", description: "Groups code by feature for high scalability." },
    { value: "layer-first", label: "Layer-first", description: "Groups code by technical layers." },
] as const satisfies Array<{ value: ArchitectureStyle; label: string; description: string }>

export const navigationOptions = [
    { value: "imperative", label: "Imperative (Navigator 1.0)", description: "Standard Navigator 1.0; simple for small apps." },
    { value: "go_router", label: "go_router", description: "Declarative routing with deep linking support." },
    { value: "getx", label: "GetX Routing", description: "Context-free routing and navigation." },
    { value: "auto_route", label: "auto_route", description: "Type-safe, code-generated routing." },
] as const satisfies Array<{ value: NavigationStyle; label: string; description: string }>

export const localizationOptions = [
    { value: "en", label: "English", description: "Standard US/UK support." },
    { value: "es", label: "Spanish", description: "Modern Spanish (ES/LATAM) support." },
    { value: "fr", label: "French", description: "Modern French localization." },
    { value: "de", label: "German", description: "Standard German support." },
    { value: "it", label: "Italian", description: "Modern Italian localization." },
    { value: "pt", label: "Portuguese", description: "Standard EU/BR Portuguese support." },
    { value: "ru", label: "Russian", description: "Standard Russian localization." },
    { value: "zh", label: "Chinese", description: "Simplified/Traditional Chinese support." },
    { value: "ja", label: "Japanese", description: "Modern Japanese localization." },
    { value: "ar", label: "Arabic", description: "RTL Arabic support." },
] as const satisfies Array<{ value: string; label: string; description: string }>
