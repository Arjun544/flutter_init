import '../../../../../imports/imports.dart';

/// A single action in [showAppActionSheet].
class AppActionSheetItem {
  const AppActionSheetItem({
    required this.label,
    this.onPressed,
    this.isDestructive = false,
    this.isDefault = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool isDestructive;
  final bool isDefault;
}

/// Shows a platform-adaptive action sheet / modal popup.
///
/// Usage:
/// ```dart
/// await showAppActionSheet(
///   context,
///   title: 'Photo',
///   actions: [
///     AppActionSheetItem(label: 'Camera', onPressed: _camera),
///     AppActionSheetItem(label: 'Gallery', onPressed: _gallery),
///     AppActionSheetItem(label: 'Delete', isDestructive: true, onPressed: _delete),
///   ],
/// );
/// ```
Future<void> showAppActionSheet(
  BuildContext context, {
  String? title,
  String? message,
  required List<AppActionSheetItem> actions,
  String cancelLabel = 'Cancel',
  AppPlatformStyle? platform,
}) async {
  final useCupertino = platform != null
      ? platform == AppPlatformStyle.cupertino
      : context.isCupertinoUi;
  final colors = context.colors;

  if (useCupertino) {
    await showCupertinoModalPopup<void>(
      context: context,
      builder: (ctx) => CupertinoActionSheet(
        title: title == null ? null : Text(title),
        message: message == null ? null : Text(message),
        actions: [
          for (final action in actions)
            CupertinoActionSheetAction(
              isDestructiveAction: action.isDestructive,
              isDefaultAction: action.isDefault,
              onPressed: () {
                Navigator.of(ctx).pop();
                action.onPressed?.call();
              },
              child: Text(action.label),
            ),
        ],
        cancelButton: CupertinoActionSheetAction(
          onPressed: () => Navigator.of(ctx).pop(),
          child: Text(cancelLabel),
        ),
      ),
    );
    return;
  }

  await showModalBottomSheet<void>(
    context: context,
    backgroundColor: colors.surfaceContainerHigh,
    shape: const RoundedRectangleBorder(borderRadius: AppBorders.bottomSheet),
    builder: (ctx) {
      return SafeArea(
        child: Padding(
          padding: EdgeInsets.fromLTRB(
            AppSpacing.md,
            AppSpacing.md,
            AppSpacing.md,
            AppSpacing.lg,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (title != null)
                Text(
                  title,
                  style: context.textTheme.titleMedium?.copyWith(
                    color: colors.onSurface,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              if (message != null) ...[
                SizedBox(height: AppSpacing.xs),
                Text(
                  message,
                  style: context.textTheme.bodySmall?.copyWith(
                    color: colors.onSurfaceVariant,
                  ),
                ),
              ],
              if (title != null || message != null)
                SizedBox(height: AppSpacing.sm),
              for (final action in actions)
                ListTile(
                  title: Text(
                    action.label,
                    style: context.textTheme.bodyLarge?.copyWith(
                      color: action.isDestructive
                          ? colors.error
                          : colors.onSurface,
                      fontWeight:
                          action.isDefault ? FontWeight.w600 : FontWeight.w500,
                    ),
                  ),
                  onTap: () {
                    Navigator.of(ctx).pop();
                    action.onPressed?.call();
                  },
                  shape: const RoundedRectangleBorder(
                    borderRadius: AppBorders.md,
                  ),
                ),
              SizedBox(height: AppSpacing.xs),
              TextButton(
                onPressed: () => Navigator.of(ctx).pop(),
                child: Text(cancelLabel),
              ),
            ],
          ),
        ),
      );
    },
  );
}
