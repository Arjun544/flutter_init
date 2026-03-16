import { z } from "zod"

export const themePresetSchema = z.enum(["material3", "cupertino", "custom"])
export type ThemePreset = z.infer<typeof themePresetSchema>

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
    "customRest",
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

const customRestSchema = z.object({
    baseUrl: z.string().optional(),
})

const backendSchema = z.discriminatedUnion("provider", [
    z.object({ provider: z.literal("none") }),
    z.object({ provider: z.literal("firebase"), options: firebaseSchema }),
    z.object({ provider: z.literal("supabase"), options: supabaseSchema }),
    z.object({ provider: z.literal("appwrite"), options: appwriteSchema }),
    z.object({ provider: z.literal("customRest"), options: customRestSchema }),
])
export type BackendConfig = z.infer<typeof backendSchema>

const miscSchema = z.object({
    usesScreenutil: z.boolean(),
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
    if (data.backend.provider === "customRest") {
        return data.misc.usesDio || data.misc.usesHttp
    }
    return true
}, {
    message: "Either Dio or HTTP client must be enabled when using Custom REST backend",
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
        case "customRest":
            return { provider: "customRest", options: { baseUrl: "" } }
        case "none":
        default:
            return { provider: "none" }
    }
}

export const backendOptions = [
    { value: "none", label: "None" },
    { value: "firebase", label: "Firebase" },
    { value: "supabase", label: "Supabase" },
    { value: "appwrite", label: "Appwrite" },
    { value: "customRest", label: "Custom REST" },
] as const satisfies Array<{ value: BackendProvider; label: string }>

export const stateManagementOptions = [
    { value: "provider", label: "Provider", description: "Simple and easy to use. Recommended by Google." },
    { value: "riverpod", label: "Riverpod", description: "Compile-safe, no context dependency. A better Provider." },
    { value: "bloc", label: "Bloc", description: "Predictable business logic separation. Widely used in enterprise." },
    { value: "getx", label: "GetX", description: "All-in-one solution: State, Dependency Injection, and Routing." },
    { value: "mobx", label: "MobX", description: "Reactive state management based on observables and actions." },
    { value: "none", label: "None (setState)", description: "Vanilla Flutter state management using setState." },
] as const satisfies Array<{ value: StateManagement; label: string; description: string }>

export const architectureOptions = [
    { value: "mvc", label: "MVC" },
    { value: "mvvm", label: "MVVM" },
    { value: "clean", label: "Clean Architecture" },
    { value: "feature-first", label: "Feature-first" },
    { value: "layer-first", label: "Layer-first" },
] as const satisfies Array<{ value: ArchitectureStyle; label: string }>

export const navigationOptions = [
    { value: "imperative", label: "Imperative (Navigator 1.0)", description: "Standard Flutter navigation. Simple for small apps." },
    { value: "go_router", label: "go_router", description: "Declarative routing. Supports deep linking and redirection. Recommended." },
    { value: "getx", label: "GetX Routing", description: "Simple and powerful routing without context." },
    { value: "auto_route", label: "auto_route", description: "Code generation based routing. Strong typing and guards." },
] as const satisfies Array<{ value: NavigationStyle; label: string; description: string }>

export const localizationOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ru", label: "Russian" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "ar", label: "Arabic" },
] as const satisfies Array<{ value: string; label: string }>
