import '../../../../../imports/imports.dart';

/// An adaptive on/off switch with optional label.
///
/// Usage:
/// ```dart
/// AppSwitch(
///   value: notificationsEnabled,
///   label: 'Push notifications',
///   onChanged: (v) => setState(() => notificationsEnabled = v),
/// )
/// ```
class AppSwitch extends StatelessWidget {
  const AppSwitch({
    super.key,
    required this.value,
    required this.onChanged,
    this.label,
    this.enabled = true,
    this.platform,
  });

  final bool value;
  final ValueChanged<bool>? onChanged;
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

    final toggle = useCupertino
        ? CupertinoSwitch(
            value: value,
            onChanged: enabled ? onChanged : null,
            activeTrackColor: cs.primary,
            inactiveTrackColor: cs.surfaceContainerHighest,
          )
        : Switch(
            value: value,
            onChanged: enabled ? onChanged : null,
            activeThumbColor: cs.onPrimary,
            activeTrackColor: cs.primary,
            inactiveThumbColor: cs.outline,
            inactiveTrackColor: cs.surfaceContainerHighest,
          );

    if (label == null) return toggle;

    return Row(
      children: [
        Expanded(
          child: Text(
            label!,
            style: tt.bodyLarge?.copyWith(
              color: enabled ? cs.onSurface : cs.onSurface.withValues(alpha: 0.5),
            ),
          ),
        ),
        toggle,
      ],
    );
  }
}
