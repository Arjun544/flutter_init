import 'package:fpdart/fpdart.dart';

import '../imports/core_imports.dart';

/// Service / backend middleware: wraps async work with structured logging and
/// maps failures to [FutureEither]. Prefer this over calling [AppLogger] in services.
///
/// When adding a new service method, always pass [operation] + [category].
FutureEither<T> runTask<T>(
  Future<T> Function() action, {
  required String operation,
  String category = LogCategory.app,
  Map<String, Object?> context = const {},
  bool requiresNetwork = false,
}) async {
  final startedAt = DateTime.now();
  AppLogger.info('$operation started', category: category, context: context);

  if (requiresNetwork) {
    final hasNetwork = await InternetConnectionService().hasConnection();

    if (!hasNetwork) {
      AppLogger.warning(
        '$operation skipped: network unavailable',
        category: category,
        context: context,
      );
      showGlobalToast(
        message:
            'No internet connection. Please check your connection and try again.',
        status: 'warning',
      );
      return left(
        const NetworkFailure(
          'No internet connection. Please check your connection and try again.',
        ),
      );
    }
  }

  try {
    final result = await action();
    AppLogger.success(
      '$operation succeeded',
      category: category,
      context: {
        ...context,
        'durationMs': DateTime.now().difference(startedAt).inMilliseconds,
      },
    );
    return right(result);
  } catch (error, stackTrace) {
    AppLogger.error(
      '$operation failed',
      error: error,
      stackTrace: stackTrace,
      category: category,
      context: {
        ...context,
        'requiresNetwork': requiresNetwork,
        'durationMs': DateTime.now().difference(startedAt).inMilliseconds,
      },
    );
    return left(Failure.fromException(error, stackTrace));
  }
}

/// Auth-stream middleware: logs signed-in / signed-out transitions once at the edge.
Stream<T?> logAuthStateChanges<T>(
  Stream<T?> source, {
  String Function(T value)? userIdOf,
}) {
  return source.map((value) {
    if (value == null) {
      AppLogger.auth('auth.state changed', context: {'state': 'signed_out'});
      return null;
    }
    AppLogger.auth(
      'auth.state changed',
      context: {
        'state': 'signed_in',
        if (userIdOf != null) 'userId': userIdOf(value),
      },
    );
    return value;
  });
}
