import '../../../../../imports/imports.dart';

/// Pull-to-refresh wrapper — Material [RefreshIndicator] or Cupertino control.
///
/// Usage:
/// ```dart
/// AppRefreshIndicator(
///   onRefresh: _reload,
///   child: ListView(...),
/// )
/// ```
class AppRefreshIndicator extends StatelessWidget {
  const AppRefreshIndicator({
    super.key,
    required this.onRefresh,
    required this.child,
    this.color,
    this.platform,
  });

  final Future<void> Function() onRefresh;
  final Widget child;
  final Color? color;
  final AppPlatformStyle? platform;

  @override
  Widget build(BuildContext context) {
    final useCupertino = platform != null
        ? platform == AppPlatformStyle.cupertino
        : context.isCupertinoUi;
    final colors = context.colors;
    final indicatorColor = color ?? colors.primary;

    if (useCupertino) {
      return CustomScrollView(
        physics: const AlwaysScrollableScrollPhysics(
          parent: BouncingScrollPhysics(),
        ),
        slivers: [
          CupertinoSliverRefreshControl(onRefresh: onRefresh),
          SliverFillRemaining(
            hasScrollBody: false,
            child: child,
          ),
        ],
      );
    }

    return RefreshIndicator(
      onRefresh: onRefresh,
      color: indicatorColor,
      backgroundColor: colors.surfaceContainerHigh,
      child: child,
    );
  }
}
