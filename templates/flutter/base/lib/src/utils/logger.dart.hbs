import 'dart:developer' as developer;
import 'package:flutter/foundation.dart';

/// Canonical log categories for middleware and [AppLogger].
abstract final class LogCategory {
  static const app = 'APP';
  static const auth = 'AUTH';
  static const backend = 'BACKEND';
  static const database = 'DATABASE';
  static const network = 'NETWORK';
  static const provider = 'PROVIDER';
  static const token = 'TOKEN';
}

/// Thin debug-only adapter over Dart's system developer log.
/// Prefer middleware ([runTask], interceptors, observers) over calling this from services.
class AppLogger {
  static void log(
    String message, {
    String category = 'APP',
    Map<String, Object?> context = const {},
    Object? error,
    StackTrace? stackTrace,
  }) {
    if (!kDebugMode) return;
    final contextText = context.isEmpty
        ? ''
        : ' | ${context.entries.map((entry) => '${entry.key}=${_redactMessage(entry.value.toString())}').join(' ')}';
    developer.log(
      _redactMessage('$message$contextText'),
      name: 'FlutterInit.$category',
      error: error,
      stackTrace: stackTrace,
    );
  }

  static void debug(
    String message, {
    String category = 'DEBUG',
    Map<String, Object?> context = const {},
    Object? error,
    StackTrace? stackTrace,
  }) {
    log(
      message,
      category: category,
      context: context,
      error: error,
      stackTrace: stackTrace,
    );
  }

  static void info(
    String message, {
    String category = 'INFO',
    Map<String, Object?> context = const {},
    Object? error,
    StackTrace? stackTrace,
  }) {
    log(
      message,
      category: category,
      context: context,
      error: error,
      stackTrace: stackTrace,
    );
  }

  static void success(
    String message, {
    String category = 'SUCCESS',
    Map<String, Object?> context = const {},
  }) {
    log(message, category: category, context: context);
  }

  static void warning(
    String message, {
    String category = 'WARNING',
    Map<String, Object?> context = const {},
    Object? error,
    StackTrace? stackTrace,
  }) {
    log(
      message,
      category: category,
      context: context,
      error: error,
      stackTrace: stackTrace,
    );
  }

  static void error(
    String message, {
    Object? error,
    StackTrace? stackTrace,
    String category = 'ERROR',
    Map<String, Object?> context = const {},
  }) {
    log(
      message,
      category: category,
      context: context,
      error: error,
      stackTrace: stackTrace,
    );
  }

  static void auth(
    String message, {
    Map<String, Object?> context = const {},
    Object? error,
    StackTrace? stackTrace,
  }) {
    log(
      message,
      category: LogCategory.auth,
      context: context,
      error: error,
      stackTrace: stackTrace,
    );
  }

  static void backend(
    String message, {
    Map<String, Object?> context = const {},
    Object? error,
    StackTrace? stackTrace,
  }) {
    log(
      message,
      category: LogCategory.backend,
      context: context,
      error: error,
      stackTrace: stackTrace,
    );
  }

  static void database(
    String message, {
    Map<String, Object?> context = const {},
    Object? error,
    StackTrace? stackTrace,
  }) {
    log(
      message,
      category: LogCategory.database,
      context: context,
      error: error,
      stackTrace: stackTrace,
    );
  }

  static void network(
    String message, {
    Map<String, Object?> context = const {},
    Object? error,
    StackTrace? stackTrace,
  }) {
    log(
      message,
      category: LogCategory.network,
      context: context,
      error: error,
      stackTrace: stackTrace,
    );
  }

  static void provider(
    String message, {
    Map<String, Object?> context = const {},
    Object? error,
    StackTrace? stackTrace,
  }) {
    log(
      message,
      category: LogCategory.provider,
      context: context,
      error: error,
      stackTrace: stackTrace,
    );
  }

  static void token(
    String message, {
    Map<String, Object?> context = const {},
    Object? error,
    StackTrace? stackTrace,
  }) {
    log(
      message,
      category: LogCategory.token,
      context: context,
      error: error,
      stackTrace: stackTrace,
    );
  }

  static String _redactMessage(String message) {
    return message
        .replaceAll(
          RegExp(r'(bearer\s+)[^\s]+', caseSensitive: false),
          r'$1[REDACTED]',
        )
        .replaceAll(
          RegExp(
            r'((?:token|password|secret|api[_-]?key)=)[^&\s]+',
            caseSensitive: false,
          ),
          r'$1[REDACTED]',
        );
  }
}

void logInfo(String msg) => AppLogger.info(msg);
void logSuccess(String msg) => AppLogger.success(msg);
void logWarning(String msg) => AppLogger.warning(msg);
void logError(String msg, [Object? error, StackTrace? stackTrace]) =>
    AppLogger.error(msg, error: error, stackTrace: stackTrace);
