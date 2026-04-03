import '../../imports/imports.dart';

/// A themed card widget with consistent padding, radius, and optional header.
///
/// Usage:
/// ```dart
/// AppCard(
///   child: Text('Card content'),
/// )
///
/// // With a header
/// AppCard(
///   title: 'Recent Transactions',
///   trailing: TextButton(onPressed: _seeAll, child: const Text('See all')),
///   child: TransactionList(),
/// )
/// ```
class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.title,
    this.subtitle,
    this.leading,
    this.trailing,
    this.padding,
    this.margin,
    this.onTap,
    this.showShadow = false,
    this.color,
  });

  final Widget child;
  final String? title;
  final String? subtitle;
  final Widget? leading;
  final Widget? trailing;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final VoidCallback? onTap;

  /// When true, uses [AppShadows.card] instead of a border outline.
  final bool showShadow;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final cs = context.theme.colorScheme;
    final tt = context.theme.textTheme;

    final cardColor = color ?? cs.surfaceContainerLow;

    final Widget content = Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null || leading != null || trailing != null)
          Padding(
            padding: EdgeInsets.only(
              left: AppSpacing.md,
              right: AppSpacing.md,
              top: AppSpacing.md,
              bottom: AppSpacing.sm,
            ),
            child: Row(
              children: [
                if (leading != null) ...[leading!, const SizedBox(width: 12)],
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (title != null)
                        Text(
                          title!,
                          style: tt.titleMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      if (subtitle != null)
                        Text(
                          subtitle!,
                          style: tt.bodySmall?.copyWith(
                            color: cs.onSurfaceVariant,
                          ),
                        ),
                    ],
                  ),
                ),
                if (trailing != null) trailing!,
              ],
            ),
          ),
        Padding(
          padding: padding ??
              EdgeInsets.fromLTRB(
                AppSpacing.md,
                title == null ? AppSpacing.md : 0,
                AppSpacing.md,
                AppSpacing.md,
              ),
          child: child,
        ),
      ],
    );

    return Container(
      margin: margin,
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: AppBorders.card,
        border: showShadow
            ? null
            : Border.all(color: cs.outlineVariant, width: 1),
        boxShadow: showShadow ? AppShadows.card : AppShadows.none,
      ),
      clipBehavior: Clip.antiAlias,
      child: onTap != null
          ? InkWell(
              onTap: onTap,
              borderRadius: AppBorders.card,
              child: content,
            )
          : content,
    );
  }
}
