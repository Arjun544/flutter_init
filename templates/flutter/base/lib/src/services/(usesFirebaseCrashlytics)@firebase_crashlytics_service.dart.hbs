import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import '../utils/utils.dart';

class FirebaseCrashlyticsService {
  FirebaseCrashlyticsService._();
  static final instance = FirebaseCrashlyticsService._();

  final FirebaseCrashlytics _crashlytics = FirebaseCrashlytics.instance;

  FutureEither<void> recordError(
    Object error,
    StackTrace stackTrace, {
    String? reason,
  }) {
    return runTask(
      () => _crashlytics.recordError(error, stackTrace, reason: reason),
      operation: 'crashlytics.recordError',
      category: LogCategory.backend,
      context: {'reason': reason ?? 'none'},
    );
  }

  FutureEither<void> setUserIdentifier(String identifier) {
    return runTask(
      () => _crashlytics.setUserIdentifier(identifier),
      operation: 'crashlytics.setUserIdentifier',
      category: LogCategory.backend,
      context: {'hasIdentifier': identifier.isNotEmpty},
    );
  }
}
