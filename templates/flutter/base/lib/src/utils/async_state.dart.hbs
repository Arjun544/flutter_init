import 'failure.dart';

/// Generic async UI/domain state. Prefer this over boolean loading flags.
///
/// Named [RequestState] (not AsyncState) to avoid clashing with Riverpod's
/// `AsyncValue` helpers (`AsyncData`, `AsyncLoading`, `AsyncError`).
///
/// ```dart
/// switch (state) {
///   RequestInitial() => const SizedBox.shrink(),
///   RequestLoading() => const CircularProgressIndicator(),
///   RequestSuccess(:final data) => Content(data: data),
///   RequestFailure(:final failure) => ErrorText(failure.message),
/// }
/// ```
sealed class RequestState<T> {
  const RequestState();

  bool get isInitial => this is RequestInitial<T>;
  bool get isLoading => this is RequestLoading<T>;
  bool get isSuccess => this is RequestSuccess<T>;
  bool get isFailure => this is RequestFailure<T>;
}

final class RequestInitial<T> extends RequestState<T> {
  const RequestInitial();
}

final class RequestLoading<T> extends RequestState<T> {
  const RequestLoading();
}

final class RequestSuccess<T> extends RequestState<T> {
  const RequestSuccess(this.data);

  final T data;
}

final class RequestFailure<T> extends RequestState<T> {
  const RequestFailure(this.failure);

  final Failure failure;
}
