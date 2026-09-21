import '../../../../../imports/imports.dart';

/// An adaptive radio button with optional label.
///
/// Usage:
/// ```dart
/// AppRadio<ThemeMode>(
///   value: ThemeMode.dark,
///   groupValue: selected,
///   label: 'Dark',
///   onChanged: (v) => setState(() => selected = v),
/// )
/// ```
class AppRadio<T> extends StatelessWidget {
  const AppRadio({
    super.key,
    required this.value,
    required this.groupValue,
    required this.onChanged,
    this.label,
    this.enabled = true,
    this.platform,
  });

  final T value;
  final T? groupValue;
  final ValueChanged<T?>? onChanged;
  final String? label;
  final bool enabled;
  final AppPlatformStyle? platform;

  @override
  Widget build(BuildContext context) {
    final useCupertino = platform != null
        ? platform == AppPlatformStyle.cupertino
        : context.isCupertinoUi;
    final cs = context.colors;
    final tt = context.textTheme;
    final selected = value == groupValue;
    final isInteractive = enabled && onChanged != null;

    final radio = RadioGroup<T>(
      groupValue: groupValue,
      onChanged: onChanged ?? (_) {},
      child: useCupertino
          ? CupertinoRadio<T>(
              value: value,
              enabled: isInteractive,
              activeColor: cs.primary,
              fillColor: cs.surface,
            )
          : Radio<T>(
              value: value,
              enabled: isInteractive,
              activeColor: cs.primary,
              fillColor: WidgetStateProperty.resolveWith((states) {
                if (states.contains(WidgetState.selected)) return cs.primary;
                return cs.outline;
              }),
            ),
    );

    if (label == null) return radio;

    return InkWell(
      onTap: !isInteractive ? null : () => onChanged!(value),
      borderRadius: AppBorders.sm,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          radio,
          SizedBox(width: AppSpacing.xs),
          Flexible(
            child: Text(
              label!,
              style: tt.bodyMedium?.copyWith(
                color: enabled ? cs.onSurface : cs.onSurface.withValues(alpha: 0.5),
                fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
