import '../../../../../imports/imports.dart';

/// Adaptive list row — Material [ListTile] or Cupertino [CupertinoListTile].
///
/// Usage:
/// ```dart
/// AppListTile(
///   title: 'Settings',
///   subtitle: 'Notifications, privacy',
///   leading: Icon(Icons.settings_outlined),
///   trailing: Icon(Icons.chevron_right),
///   onTap: () {},
/// )
/// ```
class AppListTile extends StatelessWidget {
  const AppListTile({
    super.key,
    required this.title,
    this.subtitle,
    this.leading,
    this.trailing,
    this.onTap,
    this.dense = false,
    this.platform,
  });

  final String title;
  final String? subtitle;
  final Widget? leading;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool dense;
  final AppPlatformStyle? platform;

  @override
  Widget build(BuildContext context) {
    final useCupertino = platform != null
        ? platform == AppPlatformStyle.cupertino
        : context.isCupertinoUi;
    final colors = context.colors;
    final textTheme = context.textTheme;

    if (useCupertino) {
      return CupertinoListTile(
        leading: leading,
        title: Text(
          title,
          style: textTheme.bodyLarge?.copyWith(color: colors.onSurface),
        ),
        subtitle: subtitle == null
            ? null
            : Text(
                subtitle!,
                style: textTheme.bodySmall?.copyWith(
                  color: colors.onSurfaceVariant,
                ),
              ),
        trailing: trailing,
        onTap: onTap,
        padding: EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: dense ? AppSpacing.xs : AppSpacing.sm,
        ),
      );
    }

    return ListTile(
      leading: leading,
      title: Text(
        title,
        style: textTheme.bodyLarge?.copyWith(color: colors.onSurface),
      ),
      subtitle: subtitle == null
          ? null
          : Text(
              subtitle!,
              style: textTheme.bodySmall?.copyWith(
                color: colors.onSurfaceVariant,
              ),
            ),
      trailing: trailing,
      onTap: onTap,
      dense: dense,
      contentPadding: EdgeInsets.symmetric(horizontal: AppSpacing.md),
      shape: const RoundedRectangleBorder(borderRadius: AppBorders.md),
    );
  }
}
