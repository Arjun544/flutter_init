import 'package:flutter/widgets.dart';

import '../utils/logger.dart';

/// Navigation middleware: logs route push/pop/replace via [AppLogger].
class AppRouteObserver extends NavigatorObserver {
  String _nameOf(Route<dynamic>? route) {
    final name = route?.settings.name;
    if (name != null && name.isNotEmpty) return name;
    return route?.settings.toString() ?? 'unknown';
  }

  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    AppLogger.info(
      'Route pushed',
      category: LogCategory.app,
      context: {'route': _nameOf(route), 'previous': _nameOf(previousRoute)},
    );
  }

  @override
  void didPop(Route<dynamic> route, Route<dynamic>? previousRoute) {
    AppLogger.info(
      'Route popped',
      category: LogCategory.app,
      context: {'route': _nameOf(route), 'previous': _nameOf(previousRoute)},
    );
  }

  @override
  void didReplace({Route<dynamic>? newRoute, Route<dynamic>? oldRoute}) {
    AppLogger.info(
      'Route replaced',
      category: LogCategory.app,
      context: {'route': _nameOf(newRoute), 'previous': _nameOf(oldRoute)},
    );
  }

  @override
  void didRemove(Route<dynamic> route, Route<dynamic>? previousRoute) {
    AppLogger.info(
      'Route removed',
      category: LogCategory.app,
      context: {'route': _nameOf(route), 'previous': _nameOf(previousRoute)},
    );
  }
}
