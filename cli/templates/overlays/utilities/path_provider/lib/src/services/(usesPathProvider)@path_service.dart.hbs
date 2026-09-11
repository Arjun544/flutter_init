import 'package:path_provider/path_provider.dart';
import '../utils/utils.dart';

/// A service to easily access platform-specific file system locations.
class PathService {
  PathService._();
  static final PathService instance = PathService._();

  /// Get the directory where the application may place data that is user-generated.
  FutureEither<String> getDocumentsDirectory() async => runTask(
    () async => (await getApplicationDocumentsDirectory()).path,
    operation: 'path.getDocumentsDirectory',
    category: LogCategory.app,
    context: {'kind': 'documents'},
  );

  /// Get the directory where the application may place application-specific cache files.
  FutureEither<String> getTempDirectory() async => runTask(
    () async => (await getTemporaryDirectory()).path,
    operation: 'path.getTempDirectory',
    category: LogCategory.app,
    context: {'kind': 'temp'},
  );

  /// Get the directory where the application may place data that is specific to
  /// the application and not meant to be seen by the user.
  FutureEither<String> getAppSupportDirectory() async => runTask(
    () async => (await getApplicationSupportDirectory()).path,
    operation: 'path.getAppSupportDirectory',
    category: LogCategory.app,
    context: {'kind': 'support'},
  );

  /// Get the directory where current application-specific data may be found.
  FutureEither<String> getAppLibraryDirectory() async => runTask(
    () async => (await getLibraryDirectory()).path,
    operation: 'path.getAppLibraryDirectory',
    category: LogCategory.app,
    context: {'kind': 'library'},
  );

  /// Get the path to the external storage directory (Android only).
  FutureEither<String?> getExternalStorageDirectoryPath() async => runTask(
    () async => (await getExternalStorageDirectory())?.path,
    operation: 'path.getExternalStorageDirectoryPath',
    category: LogCategory.app,
    context: {'kind': 'external'},
  );
}
