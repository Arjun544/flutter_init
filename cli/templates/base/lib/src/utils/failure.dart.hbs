import 'package:equatable/equatable.dart';

import 'error_handler.dart';

/// Domain-level failure hierarchy. Prefer exhaustive `switch` over `is` checks.
sealed class Failure extends Equatable {
  const Failure(this.message, {this.error});

  final String message;
  final Object? error;

  /// Maps thrown objects into a typed [Failure] for railway-style APIs.
  factory Failure.fromException(Object error, [StackTrace? stackTrace]) {
    if (error is Failure) return error;

    final message = AppErrorHandler.format(error);
    return switch (error) {
      final Exception e when e.toString().contains('SocketException') ||
              e.toString().contains('Network') =>
        NetworkFailure(message, error: error),
      _ => UnknownFailure(message, error: error),
    };
  }

  @override
  List<Object?> get props => [message, error];

  @override
  String toString() => message;
}

final class ServerFailure extends Failure {
  const ServerFailure(super.message, {super.error});
}

final class CacheFailure extends Failure {
  const CacheFailure(super.message, {super.error});
}

final class NetworkFailure extends Failure {
  const NetworkFailure(super.message, {super.error});
}

final class UnknownFailure extends Failure {
  const UnknownFailure(super.message, {super.error});
}
