import '../../../../../imports/imports.dart';

/// An adaptive slider with optional label and value display.
///
/// Usage:
/// ```dart
/// AppSlider(
///   value: volume,
///   min: 0,
///   max: 100,
///   divisions: 10,
///   label: 'Volume',
///   onChanged: (v) => setState(() => volume = v),
/// )
/// ```
class AppSlider extends StatelessWidget {
  const AppSlider({
    super.key,
    required this.value,
    required this.onChanged,
    this.onChangeEnd,
    this.min = 0,
    this.max = 1,
    this.divisions,
    this.label,
    this.showValue = false,
    this.enabled = true,
    this.platform,
  });

  final double value;
  final ValueChanged<double>? onChanged;
  final ValueChanged<double>? onChangeEnd;
  final double min;
  final double max;
  final int? divisions;
  final String? label;
  final bool showValue;
  final bool enabled;
  final AppPlatformStyle? platform;

  @override
  Widget build(BuildContext context) {
    final useCupertino = platform != null
        ? platform == AppPlatformStyle.cupertino
        : context.isCupertinoUi;
    final cs = context.colors;
    final tt = context.textTheme;

    final slider = useCupertino
        ? CupertinoSlider(
            value: value.clamp(min, max),
            min: min,
            max: max,
            divisions: divisions,
            onChanged: enabled ? onChanged : null,
            onChangeEnd: onChangeEnd,
            activeColor: cs.primary,
          )
        : Slider(
            value: value.clamp(min, max),
            min: min,
            max: max,
            divisions: divisions,
            label: showValue ? value.toStringAsFixed(divisions == null ? 1 : 0) : null,
            onChanged: enabled ? onChanged : null,
            onChangeEnd: onChangeEnd,
            activeColor: cs.primary,
            inactiveColor: cs.surfaceContainerHighest,
          );

    if (label == null && !showValue) return slider;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label != null || showValue)
          Padding(
            padding: EdgeInsets.only(bottom: AppSpacing.xs),
            child: Row(
              children: [
                if (label != null)
                  Expanded(
                    child: Text(
                      label!,
                      style: tt.labelLarge?.copyWith(color: cs.onSurface),
                    ),
                  ),
                if (showValue)
                  Text(
                    value.toStringAsFixed(divisions == null ? 1 : 0),
                    style: tt.labelLarge?.copyWith(
                      color: cs.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
              ],
            ),
          ),
        slider,
      ],
    );
  }
}
