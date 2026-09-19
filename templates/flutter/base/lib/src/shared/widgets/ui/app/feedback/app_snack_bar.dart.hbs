import '../../../../../imports/imports.dart';

/// Shows a themed [SnackBar] (or falls back to toast helpers when preferred).
///
/// Usage:
/// ```dart
/// showAppSnack(context, 'Saved', type: SnackBarType.success);
/// showAppSnack(context, 'Failed', type: SnackBarType.error);
/// ```
void showAppSnack(
  BuildContext context,
  String message, {
  SnackBarType type = SnackBarType.info,
  Duration duration = const Duration(seconds: 3),
  SnackBarAction? action,
  AppPlatformStyle? platform,
}) {
  final useCupertino = platform != null
      ? platform == AppPlatformStyle.cupertino
      : context.isCupertinoUi;
  final colors = context.colors;
  final appColors = context.appColors;

  final background = switch (type) {
    SnackBarType.success => appColors.success,
    SnackBarType.warning => appColors.warning,
    SnackBarType.error => colors.error,
    SnackBarType.info => colors.inverseSurface,
  };
  final foreground = switch (type) {
    SnackBarType.success => appColors.onSuccess,
    SnackBarType.warning => appColors.onWarning,
    SnackBarType.error => colors.onError,
    SnackBarType.info => colors.onInverseSurface,
  };

  if (useCupertino) {
    // Cupertino has no SnackBar — reuse the shared toast pipeline.
    showToast(
      context,
      message: message,
      status: switch (type) {
        SnackBarType.success => 'success',
        SnackBarType.warning => 'warning',
        SnackBarType.error => 'error',
        SnackBarType.info => 'info',
      },
      duration: duration,
    );
    return;
  }

  ScaffoldMessenger.of(context)
    ..clearSnackBars()
    ..showSnackBar(
      SnackBar(
        content: Text(
          message,
          style: context.textTheme.bodyMedium?.copyWith(color: foreground),
        ),
        backgroundColor: background,
        duration: duration,
        action: action,
        behavior: SnackBarBehavior.floating,
        shape: const RoundedRectangleBorder(borderRadius: AppBorders.sm),
        margin: EdgeInsets.all(AppSpacing.md),
      ),
    );
}
