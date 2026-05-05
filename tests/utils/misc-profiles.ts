import { MiscConfig, defaultConfig } from "../../app/lib/config/schema"
import { PrimaryCombo } from "./matrix.config"

/**
 * MISC_BARE_MINIMUM: Every flag false except usesDotenv and usesFlutterNativeSplash
 */
export const MISC_BARE_MINIMUM: MiscConfig = {
    usesScreenutil: false,
    usesFlutterNativeSplash: false,
    usesDio: false,
    usesHttp: false,
    usesHive: false,
    usesSharedPreferences: false,
    usesSecureStorage: false,
    usesCachedNetworkImage: false,
    usesFlutterSvg: false,
    usesSkeletonizer: false,
    usesDotenv: true,
    usesLogger: false,
    usesFlutterHooks: false,
    usesImagePicker: false,
    usesFilePicker: false,
    usesUrlLauncher: false,
    usesPathProvider: false,
    usesSharePlus: false,
    usesPermissionHandler: false,
    usesDeviceInfoPlus: false,
    usesAppVersionUpdate: false,
    usesGeolocator: false,
}

/**
 * MISC_DEFAULT: Exactly the values from defaultConfig.misc
 */
export const MISC_DEFAULT: MiscConfig = { ...defaultConfig.misc }

/**
 * MISC_ALL_ON: Every boolean flag set to true
 */
export const MISC_ALL_ON: MiscConfig = {
    usesScreenutil: true,
    usesFlutterNativeSplash: true,
    usesDio: true,
    usesHttp: true,
    usesHive: true,
    usesSharedPreferences: true,
    usesSecureStorage: true,
    usesCachedNetworkImage: true,
    usesFlutterSvg: true,
    usesSkeletonizer: true,
    usesDotenv: true,
    usesLogger: true,
    usesFlutterHooks: true,
    usesImagePicker: true,
    usesFilePicker: true,
    usesUrlLauncher: true,
    usesPathProvider: true,
    usesSharePlus: true,
    usesPermissionHandler: true,
    usesDeviceInfoPlus: true,
    usesAppVersionUpdate: true,
    usesGeolocator: true,
}

/**
 * MISC_HIGH_RISK: Hand-picked flags likely to conflict
 */
export const MISC_HIGH_RISK: MiscConfig = {
    usesScreenutil: true,
    usesFlutterNativeSplash: true,
    usesDio: true,
    usesHttp: true,
    usesHive: true,
    usesSharedPreferences: true,
    usesSecureStorage: true,
    usesCachedNetworkImage: true,
    usesFlutterSvg: true,
    usesSkeletonizer: true,
    usesDotenv: true,
    usesLogger: true,
    usesFlutterHooks: false,
    usesImagePicker: true,
    usesFilePicker: true,
    usesUrlLauncher: false,
    usesPathProvider: false,
    usesSharePlus: false,
    usesPermissionHandler: true,
    usesDeviceInfoPlus: true,
    usesAppVersionUpdate: false,
    usesGeolocator: true,
}

/**
 * Ensures valid combination for custom backend (requires Dio or HTTP)
 */
export function safeProfile(profile: MiscConfig, combo: PrimaryCombo): MiscConfig {
    if (combo.backend === "custom" && !profile.usesDio && !profile.usesHttp) {
        return { ...profile, usesDio: true }
    }
    return profile
}
