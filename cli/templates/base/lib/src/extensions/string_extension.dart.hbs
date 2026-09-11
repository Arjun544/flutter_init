extension StringExtension on String {
  // Validators
  bool get isValidEmail {
    return RegExp(
      r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+\.[a-zA-Z]+",
    ).hasMatch(this);
  }

  bool get isValidPhoneNumber {
    if (length > 16 || length < 9) return false;
    return RegExp(
      r'^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$',
    ).hasMatch(this);
  }

  bool get isValidUrl {
    return RegExp(
      r"^((((H|h)(T|t)|(F|f))(T|t)(P|p)((S|s)?))\://)?(www.|[a-zA-Z0-9].)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,6}(\:[0-9]{1,5})*(/($|[a-zA-Z0-9\.\,\;\?\'\\\+&amp;%\$#\=~_\-]+))*$",
    ).hasMatch(this);
  }

  // Formatters
  String get capitalizeFirst {
    if (isEmpty) return this;
    return this[0].toUpperCase() + substring(1).toLowerCase();
  }

  String get toTitleCase {
    if (isEmpty) return this;
    return split(' ').map((str) => str.capitalizeFirst).join(' ');
  }

  String toK() {
    final value = double.tryParse(this);
    if (value == null) return this;
    if (value >= 1000000) {
      return '${(value / 1000000).toStringAsFixed(value % 1000000 == 0 ? 0 : 1)}M';
    } else if (value >= 1000) {
      return '${(value / 1000).toStringAsFixed(value % 1000 == 0 ? 0 : 1)}k';
    }
    return this;
  }

  // Safe Parsers
  int? get toIntOrNull => int.tryParse(this);
  double? get toDoubleOrNull => double.tryParse(this);

  // Localization markers
  String get hardcoded => this;

  // Aliases for validation
  bool get isPhoneNumber => isValidPhoneNumber;
  bool get isURL => isValidUrl;
  bool get isEmail => isValidEmail;

  // Privacy helpers
  String get maskEmail {
    if (!isEmail) return this;
    final parts = split('@');
    final name = parts[0];
    final domain = parts[1];
    if (name.length <= 2) return this;
    return '${name.substring(0, 2)}****@$domain';
  }

  String maskCenter([int visibleChars = 4]) {
    if (length <= visibleChars) return this;
    final maskedLength = length - visibleChars;
    final start = (length - maskedLength) ~/ 2;
    return replaceRange(start, start + maskedLength, '*' * maskedLength);
  }

  // UI Helpers
  /// Converts hex string to Color object
  /// Supports: #RRGGBB, RRGGBB, #AARRGGBB, AARRGGBB
  dynamic toColor() {
    // Note: dynamic return to avoid importing Material in this logic-only file
    // The user can cast it to Color or we can import material here
    var hexColor = replaceAll('#', '');
    if (hexColor.length == 6) {
      hexColor = 'FF$hexColor';
    }
    if (hexColor.length == 8) {
      return int.parse('0x$hexColor');
    }
    return null;
  }
}

extension StringOptionalExtension on String? {
  bool get isNullOrEmpty => this == null || this!.trim().isEmpty;
  bool get isNotNullOrEmpty => !isNullOrEmpty;
}
