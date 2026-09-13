import 'package:permission_handler/permission_handler.dart';
import '../utils/utils.dart';

/// A service to handle device permission requests and status checks.
class PermissionService {
  PermissionService._();
  static final PermissionService instance = PermissionService._();

  /// Check the status of a specific permission.
  FutureEither<PermissionStatus> checkStatus(Permission permission) async {
    return runTask(
      () => permission.status,
      operation: 'permission.checkStatus',
      category: LogCategory.app,
      context: {'permission': permission.toString()},
    );
  }

  /// Request a specific permission.
  FutureEither<PermissionStatus> request(Permission permission) async {
    return runTask(
      () => permission.request(),
      operation: 'permission.request',
      category: LogCategory.app,
      context: {'permission': permission.toString()},
    );
  }

  /// Request multiple permissions at once.
  FutureEither<Map<Permission, PermissionStatus>> requestMultiple(
    List<Permission> permissions,
  ) async {
    return runTask(
      () => permissions.request(),
      operation: 'permission.requestMultiple',
      category: LogCategory.app,
      context: {'count': permissions.length},
    );
  }

  /// Open the app settings.
  FutureEither<bool> openSettings() async {
    return runTask(
      () => openAppSettings(),
      operation: 'permission.openSettings',
      category: LogCategory.app,
    );
  }
}
