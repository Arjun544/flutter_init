import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../utils/utils.dart';

/// A service to securely store sensitive data like JWT tokens or API keys.
/// 
/// Uses [FlutterSecureStorage] which utilizes Keychain (iOS) and Keystore (Android).
class SecureStorageService {
  SecureStorageService._();
  static final SecureStorageService instance = SecureStorageService._();

  final _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions.defaultOptions,
  );

  /// Write a sensitive value to secure storage.
  FutureEither<void> write(String key, String value) async {
    return runTask(() => _storage.write(key: key, value: value));
  }

  /// Read a sensitive value from secure storage.
  FutureEither<String?> read(String key) async {
    return runTask(() => _storage.read(key: key));
  }

  /// Delete a specific key from secure storage.
  FutureEither<void> delete(String key) async {
    return runTask(() => _storage.delete(key: key));
  }

  /// Wipe all data from secure storage.
  FutureEither<void> deleteAll() async {
    return runTask(() => _storage.deleteAll());
  }

  /// Check if a key exists in secure storage.
  FutureEither<bool> containsKey(String key) async {
    return runTask(() => _storage.containsKey(key: key));
  }
}
