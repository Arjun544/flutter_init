import '../../../../../imports/imports.dart';

/// A multi-line text area with Material and Cupertino styling.
///
/// Usage:
/// ```dart
/// AppTextArea(
///   label: 'Bio',
///   controller: _bioController,
///   minLines: 3,
///   maxLines: 6,
/// )
/// ```
class AppTextArea extends StatelessWidget {
  const AppTextArea({
    super.key,
    this.label,
    this.hint,
    this.controller,
    this.validator,
    this.onChanged,
    this.focusNode,
    this.enabled = true,
    this.minLines = 3,
    this.maxLines = 6,
    this.maxLength,
    this.platform,
  });

  final String? label;
  final String? hint;
  final TextEditingController? controller;
  final FormFieldValidator<String>? validator;
  final ValueChanged<String>? onChanged;
  final FocusNode? focusNode;
  final bool enabled;
  final int minLines;
  final int maxLines;
  final int? maxLength;
  final AppPlatformStyle? platform;

  @override
  Widget build(BuildContext context) {
    final useCupertino = platform != null
        ? platform == AppPlatformStyle.cupertino
        : context.isCupertinoUi;
    final cs = context.colors;
    final tt = context.textTheme;

    if (useCupertino) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (label != null)
            Padding(
              padding: EdgeInsets.only(bottom: AppSpacing.xs),
              child: Text(
                label!,
                style: tt.labelLarge?.copyWith(color: cs.onSurfaceVariant),
              ),
            ),
          FormField<String>(
            validator: validator,
            initialValue: controller?.text,
            builder: (field) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CupertinoTextField(
                    controller: controller,
                    focusNode: focusNode,
                    enabled: enabled,
                    minLines: minLines,
                    maxLines: maxLines,
                    maxLength: maxLength,
                    onChanged: (v) {
                      field.didChange(v);
                      onChanged?.call(v);
                    },
                    placeholder: hint,
                    padding: EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: cs.surfaceContainerHighest,
                      borderRadius: AppBorders.input,
                      border: Border.all(
                        color: field.hasError ? cs.error : cs.outlineVariant,
                      ),
                    ),
                    style: tt.bodyLarge?.copyWith(color: cs.onSurface),
                    cursorColor: cs.primary,
                  ),
                  if (field.hasError)
                    Padding(
                      padding: EdgeInsets.only(top: AppSpacing.xs),
                      child: Text(
                        field.errorText!,
                        style: tt.bodySmall?.copyWith(color: cs.error),
                      ),
                    ),
                ],
              );
            },
          ),
        ],
      );
    }

    return TextFormField(
      controller: controller,
      validator: validator,
      onChanged: onChanged,
      focusNode: focusNode,
      enabled: enabled,
      minLines: minLines,
      maxLines: maxLines,
      maxLength: maxLength,
      keyboardType: TextInputType.multiline,
      style: tt.bodyLarge?.copyWith(color: cs.onSurface),
      cursorColor: cs.primary,
      decoration: InputDecoration(
        isDense: true,
        labelText: label,
        hintText: hint,
        alignLabelWithHint: true,
      ),
    );
  }
}
