import 'dart:async';

class Debouncer {
  final Duration delay;
  Timer? _timer;

  Debouncer({this.delay = const Duration(milliseconds: 500)});

  void run(void Function() action) {
    _timer?.cancel();
    _timer = Timer(delay, action);
  }

  void dispose() {
    _timer?.cancel();
  }
}

class Throttler {
  final Duration delay;
  bool _isThrottling = false;

  Throttler({this.delay = const Duration(milliseconds: 500)});

  void run(void Function() action) {
    if (_isThrottling) return;
    action();
    _isThrottling = true;
    Timer(delay, () => _isThrottling = false);
  }
}
