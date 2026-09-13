import 'package:equatable/equatable.dart';

/// Domain user entity. Parsing belongs in factories / data mappers.
class AppUser extends Equatable {
  const AppUser({
    required this.id,
    required this.email,
    this.name,
    this.photoUrl,
  });

  final String id;
  final String email;
  final String? name;
  final String? photoUrl;

  factory AppUser.empty() => const AppUser(id: '', email: '');

  /// Null-safe JSON factory with map pattern matching.
  factory AppUser.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'id': final Object? id,
        'email': final Object? email,
      } =>
        AppUser(
          id: id?.toString() ?? '',
          email: email?.toString() ?? '',
          name: json['name']?.toString(),
          photoUrl: json['photoUrl']?.toString(),
        ),
      _ => AppUser.empty(),
    };
  }

  Map<String, Object?> toJson() => {
        'id': id,
        'email': email,
        'name': name,
        'photoUrl': photoUrl,
      };

  bool get isEmpty => id.isEmpty;
  bool get isNotEmpty => id.isNotEmpty;

  @override
  List<Object?> get props => [id, email, name, photoUrl];
}
