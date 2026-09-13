import 'dart:async';

/// Reusable subscription bookkeeping without forcing a base class hierarchy.
///
/// ```dart
/// class SessionNotifier extends StateNotifier<SessionState>
///     with StreamSubscriptionsMixin {
///   void listen(Stream<T> stream) {
///     addSubscription(stream.listen(...));
///   }
///
///   @override
///   void dispose() {
///     cancelSubscriptions();
///     super.dispose();
///   }
/// }
/// ```
mixin StreamSubscriptionsMixin {
  final List<StreamSubscription<dynamic>> _subscriptions = [];

  void addSubscription(StreamSubscription<dynamic> subscription) {
    _subscriptions.add(subscription);
  }

  Future<void> cancelSubscriptions() async {
    for (final subscription in _subscriptions) {
      await subscription.cancel();
    }
    _subscriptions.clear();
  }
}
