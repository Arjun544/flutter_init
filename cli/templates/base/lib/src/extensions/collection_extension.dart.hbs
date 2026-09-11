import 'package:flutter/widgets.dart';

extension IterableExtension<T> on Iterable<T> {
  // Safe accessors
  T? get firstOrNull => isEmpty ? null : first;
  T? get lastOrNull => isEmpty ? null : last;

  // Iteration
  Iterable<E> mapIndexed<E>(E Function(int index, T item) f) {
    var i = 0;
    return map((e) => f(i++, e));
  }

  // Data manipulation
  Map<K, List<T>> groupBy<K>(K Function(T item) keySelector) {
    final groups = <K, List<T>>{};
    for (final item in this) {
      final key = keySelector(item);
      groups.putIfAbsent(key, () => []).add(item);
    }
    return groups;
  }

  Iterable<List<T>> chunk(int size) {
    if (size <= 0) return [toList()];
    final chunks = <List<T>>[];
    final list = toList();
    for (var i = 0; i < list.length; i += size) {
      chunks.add(
        list.sublist(i, i + size > list.length ? list.length : i + size),
      );
    }
    return chunks;
  }

  List<T> get distinct => toSet().toList();

  List<T> distinctBy(Object Function(T item) keySelector) {
    final seen = <Object>{};
    return where((item) => seen.add(keySelector(item))).toList();
  }
}

extension ListWidgetExtension on List<Widget> {
  // UI Helpers
  List<Widget> separatedBy(Widget separator) {
    if (isEmpty) return [];
    final result = <Widget>[];
    for (var i = 0; i < length; i++) {
      result.add(this[i]);
      if (i < length - 1) {
        result.add(separator);
      }
    }
    return result;
  }
}
