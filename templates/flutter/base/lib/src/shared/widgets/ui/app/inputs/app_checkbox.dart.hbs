import '../../../../../imports/imports.dart';

/// An adaptive checkbox with optional label.
///
/// Usage:
/// ```dart
/// AppCheckbox(
///   value: accepted,
///   label: 'I agree to the terms',
///   onChanged: (v) => setState(() => accepted = v ?? false),
/// )
/// ```
class AppCheckbox extends StatelessWidget {
  const AppCheckbox({
    super.key,
    required this.value,
    required this.onChanged,
    this.label,
    this.tristate = false,
    this.enabled = true,
    this.platform,
  });

  final bool? value;
  final ValueChanged<bool?>? onChanged;
  final String? label;
  final bool tristate;
  final bool enabled;
  final AppPlatformStyle? platform;

  @override
  Widget build(BuildContext context) {
    final useCupertino = platform != null
        ? platform == AppPlatformStyle.cupertino
        : context.isCupertinoUi;
    final cs = context.colors;
    final tt = context.textTheme;

    final checkbox = useCupertino
        ? CupertinoCheckbox(
            value: value,
            tristate: tristate,
            onChanged: enabled ? onChanged : null,
            activeColor: cs.primary,
            checkColor: cs.onPrimary,
          )
        : Checkbox(
            value: value,
            tristate: tristate,
            onChanged: enabled ? onChanged : null,
            activeColor: cs.primary,
            checkColor: cs.onPrimary,
            side: BorderSide(color: cs.outline, width: 1.5),
            shape: const RoundedRectangleBorder(borderRadius: AppBorders.xs),
          );

    if (label == null) return checkbox;

    return InkWell(
      onTap: !enabled || onChanged == null
          ? null
          : () {
              if (tristate) {
                final next = switch (value) {
                  false => true,
                  true => null,
                  null => false,
                };
                onChanged!(next);
              } else {
                onChanged!(!(value ?? false));
              }
            },
      borderRadius: AppBorders.sm,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          checkbox,
          SizedBox(width: AppSpacing.xs),
          Flexible(
            child: Text(
              label!,
              style: tt.bodyMedium?.copyWith(
                color: enabled ? cs.onSurface : cs.onSurface.withValues(alpha: 0.5),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
