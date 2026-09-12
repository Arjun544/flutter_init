import { describe, expect, it } from "vitest"

import { defaultBackendConfig } from "@/app/lib/config/schema"
import { buildConfig } from "../utils/config-builder"
import { generateToMap, getFile, getPubspecContent } from "../utils/generate"
import { MISC_DEFAULT } from "../utils/misc-profiles"

const base = {
    architecture: "feature-first" as const,
    stateManagement: "riverpod" as const,
    navigation: "go_router" as const,
}

describe("release blocker regressions", { timeout: 180_000 }, () => {
    it("removes every dotenv import and load when dotenv is disabled", async () => {
        const config = buildConfig({ ...base, backend: "none" }, {
            ...MISC_DEFAULT,
            usesDotenv: false,
        })
        const files = await generateToMap(config)
        const main = getFile(files, "lib/main.dart") ?? ""
        const packages = getFile(files, "lib/src/imports/packages_imports.dart") ?? ""
        const pubspec = getPubspecContent(files)

        expect(main).not.toContain("dotenv.load")
        expect(packages).not.toContain("flutter_dotenv")
        expect(pubspec).not.toContain("flutter_dotenv")
        expect(getFile(files, "lib/src/services/firebase_firestore_service.dart")).toBeUndefined()
        expect(getFile(files, "lib/src/services/appwrite_database_service.dart")).toBeUndefined()
    })

    it("keeps HTTP logging compile-safe via LoggingHttpClient middleware", async () => {
        const config = buildConfig({ ...base, backend: "custom" }, {
            ...MISC_DEFAULT,
            usesDio: false,
            usesHttp: true,
        })
        const files = await generateToMap(config)
        const http = getFile(files, "lib/src/services/http_service.dart") ?? ""
        const loggingClient = getFile(files, "lib/src/middleware/logging_http_client.dart") ?? ""
        const logger = getFile(files, "lib/src/utils/logger.dart") ?? ""
        const taskRunner = getFile(files, "lib/src/utils/task_runner.dart") ?? ""
        const appConfig = getFile(files, "lib/src/config/app_config.dart") ?? ""

        expect(http).not.toContain("AppLogger.network")
        expect(http).toContain("operation: 'http.get'")
        expect(loggingClient).toContain("AppLogger.network")
        expect(appConfig).toContain("LoggingHttpClient")
        expect(logger).toContain("static void debug")
        expect(logger).toContain("abstract final class LogCategory")
        expect(taskRunner).toContain("required String operation")
    })

    it("uses middleware logging: runTask, Dio interceptor, route observer, Riverpod", async () => {
        const config = buildConfig({ ...base, backend: "none" }, {
            ...MISC_DEFAULT,
            usesDio: true,
            usesHttp: false,
        })
        const files = await generateToMap(config)
        const logger = getFile(files, "lib/src/utils/logger.dart") ?? ""
        const taskRunner = getFile(files, "lib/src/utils/task_runner.dart") ?? ""
        const main = getFile(files, "lib/main.dart") ?? ""
        const stateWrapper = getFile(
            files,
            "lib/src/shared/wrappers/state_wrapper.dart",
        ) ?? ""
        const sessionListener = getFile(
            files,
            "lib/src/shared/wrappers/session_listener_wrapper.dart",
        ) ?? ""
        const dioService = getFile(files, "lib/src/services/dio_service.dart") ?? ""
        const dioInterceptor = getFile(
            files,
            "lib/src/middleware/dio_logging_interceptor.dart",
        ) ?? ""
        const routeObserver = getFile(
            files,
            "lib/src/middleware/app_route_observer.dart",
        ) ?? ""
        const appRouter = getFile(files, "lib/src/routing/app_router.dart") ?? ""
        const appConfig = getFile(files, "lib/src/config/app_config.dart") ?? ""

        expect(logger).toContain("dart:developer")
        expect(logger).toContain("developer.log")
        expect(logger).toContain("kDebugMode")
        expect(logger).toContain("[REDACTED]")
        expect(logger).toContain("LogCategory")
        expect(taskRunner).toContain("required String operation")
        expect(taskRunner).toContain("logAuthStateChanges")
        expect(main).toContain("runZonedGuarded")
        expect(main).toContain("Application bootstrap started")
        expect(main).toContain("Application started")
        expect(main).toContain("Flutter framework error")
        expect(stateWrapper).toContain("ProviderObserver")
        expect(stateWrapper).toContain("observers: [AppProviderObserver()]")
        expect(sessionListener).toContain("AppLogger.provider")
        expect(sessionListener).toContain("Session state changed")
        expect(dioService).not.toContain("AppLogger.network")
        expect(dioService).toContain("operation: 'dio.get'")
        expect(dioInterceptor).toContain("class DioLoggingInterceptor")
        expect(dioInterceptor).toContain("AppLogger.network")
        expect(dioInterceptor).not.toContain("'durationMs': ?durationMs")
        expect(dioInterceptor).toContain("if (durationMs != null) 'durationMs': durationMs")
        expect(appConfig).toContain("DioLoggingInterceptor()")
        expect(appConfig).not.toContain("LogInterceptor")
        expect(appConfig).not.toContain("core_imports.dart")
        expect(routeObserver).toContain("class AppRouteObserver")
        expect(appRouter).toContain("AppRouteObserver()")
    })

    it("exposes Appwrite database and bucket ids on AppConfig", async () => {
        const config = buildConfig({ ...base, backend: "appwrite" }, MISC_DEFAULT)
        const files = await generateToMap(config)
        const appConfig = getFile(files, "lib/src/config/app_config.dart") ?? ""
        const pubspec = getPubspecContent(files)
        const widgetTest = getFile(files, "test/widget_test.dart") ?? ""

        expect(appConfig).toContain("appwriteDatabaseId")
        expect(appConfig).toContain("appwriteBucketId")
        expect(appConfig).toContain("APPWRITE_DATABASE_ID")
        expect(appConfig).toContain("APPWRITE_BUCKET_ID")
        expect(pubspec).toContain("shared_preferences")
        expect(widgetTest).toContain("SharedPreferences.setMockInitialValues")
        expect(widgetTest).toContain("saveLocale: false")
    })

    it("keeps auth services free of inline AppLogger started calls", async () => {
        const backend = defaultBackendConfig("firebase")
        if (backend.provider !== "firebase") throw new Error("Firebase fixture failed")
        backend.options = {
            ...backend.options,
            authEmail: true,
            authGoogle: false,
            authPhone: false,
            firestore: false,
            storage: false,
            analytics: false,
            crashlytics: false,
        }
        const config = buildConfig({ ...base, backend: "firebase" }, MISC_DEFAULT)
        config.backend = backend
        const files = await generateToMap(config)
        const authService = getFile(files, "lib/src/services/auth_service.dart") ?? ""

        expect(authService).toContain("logAuthStateChanges")
        expect(authService).toContain("operation: 'auth.login'")
        expect(authService).not.toMatch(/AppLogger\.auth\(\s*'Firebase email sign-in started'/)
        expect(authService).not.toContain("AppLogger.auth(\n")
    })

    it.each(["authGoogle", "authPhone"] as const)(
        "gates Firebase auth dependency for %s-only configurations",
        async (authOption) => {
            const backend = defaultBackendConfig("firebase")
            if (backend.provider !== "firebase") throw new Error("Firebase fixture failed")
            backend.options = {
                ...backend.options,
                authEmail: false,
                authGoogle: authOption === "authGoogle",
                authPhone: authOption === "authPhone",
                firestore: false,
                storage: false,
                analytics: false,
                crashlytics: false,
            }
            const config = buildConfig({ ...base, backend: "firebase" }, MISC_DEFAULT)
            config.backend = backend
            const files = await generateToMap(config)
            const pubspec = getPubspecContent(files)
            const appConfig = getFile(files, "lib/src/config/app_config.dart") ?? ""
            const authService = getFile(files, "lib/src/services/auth_service.dart") ?? ""

            expect(pubspec).toContain("firebase_auth")
            expect(appConfig).toContain("FirebaseAuth")
            expect(authService).toContain("FutureEither")
        },
    )
})
