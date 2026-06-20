import 'package:hive_ce_flutter/hive_ce_flutter.dart';
import '../utils/utils.dart';

/// A robust [Hive] storage service for local NoSQL persistence.
class HiveService {
  HiveService._();
  static final HiveService instance = HiveService._();

  /// Initialize Hive and open a default box.
  FutureEither<void> init() async {
    return runTask(() async {
      await Hive.initFlutter();
      await Hive.openBox<dynamic>('app_box');
      AppLogger.info('Hive initialized');
    });
  }

  /// Get data from the default box.
  T? get<T>(String key, {T? defaultValue}) {
    try {
      final box = Hive.box<dynamic>('app_box');
      return box.get(key, defaultValue: defaultValue) as T?;
    } catch (e) {
      AppLogger.error('Hive get error', e);
      return defaultValue;
    }
  }

  /// Put data into the default box.
  FutureEither<void> put(String key, dynamic value) async {
    return runTask(() async {
      final box = Hive.box<dynamic>('app_box');
      await box.put(key, value);
    });
  }

  /// Delete data from the default box.
  FutureEither<void> delete(String key) async {
    return runTask(() async {
      final box = Hive.box<dynamic>('app_box');
      await box.delete(key);
    });
  }

  /// Clear all data from the default box.
  FutureEither<void> clear() async {
    return runTask(() async {
      final box = Hive.box<dynamic>('app_box');
      await box.clear();
    });
  }

  /// Open a custom box for specialized storage.
  FutureEither<Box<T>> openCustomBox<T>(String name) async {
    return runTask(() async {
      return await Hive.openBox<T>(name);
    });
  }
}
