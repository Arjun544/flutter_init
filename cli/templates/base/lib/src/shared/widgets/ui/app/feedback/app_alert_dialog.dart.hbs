import '../../../../../imports/imports.dart';

/// Opinionated alert dialog with confirm / cancel actions.
///
/// Usage:
/// ```dart
/// final ok = await showAppAlertDialog(
///   context,
///   title: 'Discard changes?',
///   message: 'You will lose unsaved edits.',
///   confirmLabel: 'Discard',
///   isDestructive: true,
/// );
/// ```
class AppAlertDialog extends StatelessWidget {
  const AppAlertDialog({
    super.key,
    required this.title,
    this.message,
    this.confirmLabel = 'OK',
    this.cancelLabel = 'Cancel',
    this.isDestructive = false,
    this.platform,
  });

  final String title;
  final String? message;
  final String confirmLabel;
  final String cancelLabel;
  final bool isDestructive;
  final AppPlatformStyle? platform;

  @override
  Widget build(BuildContext context) {
    final useCupertino = platform != null
        ? platform == AppPlatformStyle.cupertino
        : context.isCupertinoUi;
    final colors = context.colors;
    final confirmColor = isDestructive ? colors.error : colors.primary;

    if (useCupertino) {
      return CupertinoAlertDialog(
        title: Text(title),
        content: message == null
            ? null
            : Padding(
                padding: EdgeInsets.only(top: AppSpacing.sm),
                child: Text(message!),
              ),
        actions: [
          CupertinoDialogAction(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text(cancelLabel),
          ),
          CupertinoDialogAction(
            isDestructiveAction: isDestructive,
            onPressed: () => Navigator.of(context).pop(true),
            child: Text(
              confirmLabel,
              style: TextStyle(color: confirmColor),
            ),
          ),
        ],
      );
    }

    return AlertDialog(
      backgroundColor: colors.surfaceContainerHigh,
      shape: const RoundedRectangleBorder(borderRadius: AppBorders.dialog),
      title: Text(
        title,
        style: context.textTheme.titleLarge?.copyWith(color: colors.onSurface),
      ),
      content: message == null
          ? null
          : Text(
              message!,
              style: context.textTheme.bodyMedium?.copyWith(
                color: colors.onSurfaceVariant,
              ),
            ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(false),
          child: Text(cancelLabel),
        ),
        TextButton(
          onPressed: () => Navigator.of(context).pop(true),
          style: TextButton.styleFrom(foregroundColor: confirmColor),
          child: Text(confirmLabel),
        ),
      ],
    );
  }
}

/// Presents [AppAlertDialog] and returns `true` if confirmed.
Future<bool?> showAppAlertDialog(
  BuildContext context, {
  required String title,
  String? message,
  String confirmLabel = 'OK',
  String cancelLabel = 'Cancel',
  bool isDestructive = false,
  AppPlatformStyle? platform,
}) {
  final useCupertino = platform != null
      ? platform == AppPlatformStyle.cupertino
      : context.isCupertinoUi;

  final dialog = AppAlertDialog(
    title: title,
    message: message,
    confirmLabel: confirmLabel,
    cancelLabel: cancelLabel,
    isDestructive: isDestructive,
    platform: platform,
  );

  if (useCupertino) {
    return showCupertinoDialog<bool>(
      context: context,
      builder: (_) => dialog,
    );
  }

  return showDialog<bool>(
    context: context,
    builder: (_) => dialog,
  );
}
