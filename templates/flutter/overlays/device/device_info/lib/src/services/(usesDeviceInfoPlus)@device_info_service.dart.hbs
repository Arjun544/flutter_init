import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';
import '../utils/utils.dart';

/// A service to retrieve detailed information about the current device.
class DeviceInfoService {
  DeviceInfoService._();
  static final DeviceInfoService instance = DeviceInfoService._();

  final DeviceInfoPlugin _deviceInfo = DeviceInfoPlugin();

  /// Retrieve full device information as a Map.
  FutureEither<Map<String, dynamic>> getFullDeviceInfo() async {
    return runTask(() async {
      if (Platform.isAndroid) {
        final androidInfo = await _deviceInfo.androidInfo;
        return {
          'model': androidInfo.model,
          'manufacturer': androidInfo.manufacturer,
          'version': androidInfo.version.release,
          'sdkInt': androidInfo.version.sdkInt,
          'id': androidInfo.id,
          'isPhysicalDevice': androidInfo.isPhysicalDevice,
        };
      } else if (Platform.isIOS) {
        final iosInfo = await _deviceInfo.iosInfo;
        return {
          'name': iosInfo.name,
          'model': iosInfo.model,
          'systemName': iosInfo.systemName,
          'systemVersion': iosInfo.systemVersion,
          'identifierForVendor': iosInfo.identifierForVendor,
          'isPhysicalDevice': iosInfo.isPhysicalDevice,
        };
      } else if (Platform.isMacOS) {
        final macInfo = await _deviceInfo.macOsInfo;
        return {
          'computerName': macInfo.computerName,
          'hostName': macInfo.hostName,
          'model': macInfo.model,
          'osRelease': macInfo.osRelease,
        };
      } else if (Platform.isWindows) {
        final winInfo = await _deviceInfo.windowsInfo;
        return {
          'computerName': winInfo.computerName,
          'numberOfCores': winInfo.numberOfCores,
          'systemMemoryInMegabytes': winInfo.systemMemoryInMegabytes,
        };
      }
      return {'platform': 'unknown'};
    });
  }
}
