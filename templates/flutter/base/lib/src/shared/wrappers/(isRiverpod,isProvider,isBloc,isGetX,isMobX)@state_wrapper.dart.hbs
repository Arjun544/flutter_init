import '../../imports/imports.dart';

/// State middleware: logs meaningful Riverpod updates (skips noisy init spam).
base class AppProviderObserver extends ProviderObserver {
  @override
  void didUpdateProvider(
    ProviderObserverContext context,
    Object? previousValue,
    Object? newValue,
  ) {
    AppLogger.provider(
      'Riverpod provider updated',
      context: {
        'provider': context.provider.toString(),
        'previousType': previousValue.runtimeType.toString(),
        'newType': newValue.runtimeType.toString(),
      },
    );
  }

  @override
  void providerDidFail(
    ProviderObserverContext context,
    Object error,
    StackTrace stackTrace,
  ) {
    AppLogger.provider(
      'Riverpod provider failed',
      context: {'provider': context.provider.toString()},
      error: error,
      stackTrace: stackTrace,
    );
  }
}

/// A wrapper to initialize the chosen State Management library.
class StateWrapper extends StatelessWidget {
  final Widget child;

  const StateWrapper({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return ProviderScope(observers: [AppProviderObserver()], child: child);
  }
}
