import 'dart:typed_data';
import 'package:appwrite/appwrite.dart';
import '../config/app_config.dart';
import '../utils/utils.dart';

class AppwriteStorageService {
  AppwriteStorageService._();
  static final instance = AppwriteStorageService._();

  Storage get _storage => Storage(AppConfig.appwriteClient);

  FutureEither<Object?> uploadFile(
    Uint8List bytes, {
    required String fileName,
  }) {
    return runTask(
      () {
        _requireBucketId();
        return _storage.createFile(
          bucketId: AppConfig.appwriteBucketId,
          fileId: ID.unique(),
          file: InputFile.fromBytes(bytes: bytes, filename: fileName),
        );
      },
      operation: 'appwrite.uploadFile',
      category: LogCategory.backend,
      context: {'fileName': fileName, 'bytes': bytes.length},
      requiresNetwork: true,
    );
  }

  FutureEither<void> deleteFile(String fileId) {
    return runTask(
      () {
        _requireBucketId();
        return _storage.deleteFile(
          bucketId: AppConfig.appwriteBucketId,
          fileId: fileId,
        );
      },
      operation: 'appwrite.deleteFile',
      category: LogCategory.backend,
      context: {'fileId': fileId},
      requiresNetwork: true,
    );
  }

  void _requireBucketId() {
    if (AppConfig.appwriteBucketId.isEmpty) {
      throw StateError(
        'APPWRITE_BUCKET_ID is required for storage operations.',
      );
    }
  }
}
