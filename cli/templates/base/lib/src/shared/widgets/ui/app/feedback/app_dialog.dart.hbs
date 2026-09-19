import '../../../../../imports/imports.dart';

/// Content dialog shell with optional title, body, and actions.
///
/// Prefer [showAppContentDialog] for one-shot presentation.
///
/// Usage:
/// ```dart
/// await showAppContentDialog(
///   context,
///   title: 'Confirm',
///   child: Text('Delete this item?'),
///   actions: [
///     TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancel')),
///     TextButton(onPressed: _delete, child: Text('Delete')),
///   ],
/// );
/// ```
class AppDialog extends StatelessWidget {
  const AppDialog({
    super.key,
    this.title,
    required this.child,
    this.actions,
    this.platform,
  });

  final String? title;
  final Widget child;
  final List<Widget>? actions;
  final AppPlatformStyle? platform;

  @override
  Widget build(BuildContext context) {
    final useCupertino = platform != null
        ? platform == AppPlatformStyle.cupertino
        : context.isCupertinoUi;
    final colors = context.colors;

    if (useCupertino) {
      return CupertinoAlertDialog(
        title: title == null
            ? null
            : Text(
                title!,
                style: context.textTheme.titleMedium?.copyWith(
                  color: colors.onSurface,
                ),
              ),
        content: Padding(
          padding: EdgeInsets.only(top: AppSpacing.sm),
          child: child,
        ),
        actions: actions ?? const <Widget>[],
      );
    }

    return AlertDialog(
      backgroundColor: colors.surfaceContainerHigh,
      shape: const RoundedRectangleBorder(borderRadius: AppBorders.dialog),
      title: title == null
          ? null
          : Text(
              title!,
              style: context.textTheme.titleLarge?.copyWith(
                color: colors.onSurface,
              ),
            ),
      content: child,
      actions: actions,
    );
  }
}

/// Shows an [AppDialog] and returns the dialog result.
Future<T?> showAppContentDialog<T>(
  BuildContext context, {
  String? title,
  required Widget child,
  List<Widget>? actions,
  AppPlatformStyle? platform,
  bool barrierDismissible = true,
}) {
  final useCupertino = platform != null
      ? platform == AppPlatformStyle.cupertino
      : context.isCupertinoUi;

  if (useCupertino) {
    return showCupertinoDialog<T>(
      context: context,
      barrierDismissible: barrierDismissible,
      builder: (ctx) => AppDialog(
        title: title,
        actions: actions,
        platform: platform ?? AppPlatformStyle.cupertino,
        child: child,
      ),
    );
  }

  return showDialog<T>(
    context: context,
    barrierDismissible: barrierDismissible,
    builder: (ctx) => AppDialog(
      title: title,
      actions: actions,
      platform: platform ?? AppPlatformStyle.material,
      child: child,
    ),
  );
}
