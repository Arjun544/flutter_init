import '../../../../imports/imports.dart';

/// Controls whether [App]* widgets render Material or Cupertino UI.
///
/// Resolution order (highest wins):
/// 1. Per-widget `platform:` parameter
/// 2. Nearest [AppPlatformScope]
/// 3. [ThemeData.platform] when scope style is [AppPlatformStyle.adaptive]
enum AppPlatformStyle {
  /// Material on Android, Cupertino on iOS/macOS.
  adaptive,

  /// Always Material.
  material,

  /// Always Cupertino.
  cupertino,
}

/// Seeds the default platform style for the widget subtree.
///
/// ```dart
/// AppPlatformScope(
///   style: AppPlatformStyle.adaptive,
///   child: child,
/// )
/// ```
class AppPlatformScope extends InheritedWidget {
  const AppPlatformScope({
    super.key,
    required this.style,
    required super.child,
  });

  final AppPlatformStyle style;

  static AppPlatformStyle of(BuildContext context) {
    final scope =
        context.dependOnInheritedWidgetOfExactType<AppPlatformScope>();
    return scope?.style ?? AppPlatformStyle.adaptive;
  }

  static AppPlatformStyle? maybeOf(BuildContext context) {
    return context
        .dependOnInheritedWidgetOfExactType<AppPlatformScope>()
        ?.style;
  }

  @override
  bool updateShouldNotify(AppPlatformScope oldWidget) =>
      style != oldWidget.style;
}

extension AppPlatformX on BuildContext {
  /// True when App widgets should render Cupertino for this context.
  bool get isCupertinoUi {
    final style = AppPlatformScope.of(this);
    return switch (style) {
      AppPlatformStyle.material => false,
      AppPlatformStyle.cupertino => true,
      AppPlatformStyle.adaptive =>
        Theme.of(this).platform == TargetPlatform.iOS ||
            Theme.of(this).platform == TargetPlatform.macOS,
    };
  }

  /// Resolves Cupertino vs Material for a widget-level override.
  bool resolveCupertinoUi([AppPlatformStyle? platform]) {
    if (platform == AppPlatformStyle.cupertino) return true;
    if (platform == AppPlatformStyle.material) return false;
    return isCupertinoUi;
  }
}
