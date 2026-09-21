import '../../../../../imports/imports.dart';

/// Breakpoint labels used by [AppResponsiveBuilder].
enum AppBreakpoint {
  mobile,
  tablet,
  desktop,
}

/// Builds different layouts from viewport width breakpoints.
///
/// Defaults: mobile < 600, tablet < 1024, else desktop.
///
/// Usage:
/// ```dart
/// AppResponsiveBuilder(
///   mobile: (_) => MobileHome(),
///   tablet: (_) => TabletHome(),
///   desktop: (_) => DesktopHome(),
/// )
/// ```
class AppResponsiveBuilder extends StatelessWidget {
  const AppResponsiveBuilder({
    super.key,
    required this.mobile,
    this.tablet,
    this.desktop,
    this.tabletBreakpoint = 600,
    this.desktopBreakpoint = 1024,
  });

  final WidgetBuilder mobile;
  final WidgetBuilder? tablet;
  final WidgetBuilder? desktop;
  final double tabletBreakpoint;
  final double desktopBreakpoint;

  static AppBreakpoint breakpointOf(
    BuildContext context, {
    double tabletBreakpoint = 600,
    double desktopBreakpoint = 1024,
  }) {
    final width = MediaQuery.sizeOf(context).width;
    if (width >= desktopBreakpoint) return AppBreakpoint.desktop;
    if (width >= tabletBreakpoint) return AppBreakpoint.tablet;
    return AppBreakpoint.mobile;
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final width = constraints.maxWidth;
        if (width >= desktopBreakpoint) {
          return (desktop ?? tablet ?? mobile)(context);
        }
        if (width >= tabletBreakpoint) {
          return (tablet ?? mobile)(context);
        }
        return mobile(context);
      },
    );
  }
}
