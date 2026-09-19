import '../../../../../imports/imports.dart';

/// Themed tooltip wrapping [message] around [child].
///
/// Usage:
/// ```dart
/// AppTooltip(
///   message: 'Copy link',
///   child: IconButton(onPressed: _copy, icon: Icon(Icons.link)),
/// )
/// ```
class AppTooltip extends StatelessWidget {
  const AppTooltip({
    super.key,
    required this.message,
    required this.child,
    this.waitDuration,
    this.platform,
  });

  final String message;
  final Widget child;
  final Duration? waitDuration;
  final AppPlatformStyle? platform;

  @override
  Widget build(BuildContext context) {
    final useCupertino = platform != null
        ? platform == AppPlatformStyle.cupertino
        : context.isCupertinoUi;
    final colors = context.colors;

    return Tooltip(
      message: message,
      waitDuration: waitDuration ?? AppDurations.normal,
      decoration: BoxDecoration(
        color: colors.inverseSurface,
        borderRadius: useCupertino ? AppBorders.md : AppBorders.sm,
        boxShadow: AppShadows.elevated,
      ),
      textStyle: context.textTheme.bodySmall?.copyWith(
        color: colors.onInverseSurface,
      ),
      padding: EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      child: child,
    );
  }
}
