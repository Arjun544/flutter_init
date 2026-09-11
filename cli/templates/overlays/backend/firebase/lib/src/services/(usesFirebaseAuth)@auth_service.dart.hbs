import 'dart:async';
import '../utils/utils.dart';
import '../config/app_config.dart';
import 'package:firebase_auth/firebase_auth.dart';

class AuthService {
  AuthService._();
  static final AuthService instance = AuthService._();

  FirebaseAuth get _firebaseAuth => AppConfig.firebaseAuth;

  /// Stream of auth state changes. Emits the current user map or null.
  Stream<Map<String, dynamic>?> get authStateChanges {
    return logAuthStateChanges(
      _firebaseAuth.authStateChanges().map((User? user) {
        if (user == null) return null;
        return {
          'id': user.uid,
          'email': user.email ?? '',
          'name': user.displayName ?? '',
          'photoUrl': user.photoURL,
        };
      }),
      userIdOf: (user) => user['id'] as String? ?? '',
    );
  }

  FutureEither<Map<String, dynamic>?> login({
    required String email,
    required String password,
  }) async {
    return runTask(
      () async {
        final credentials = await _firebaseAuth.signInWithEmailAndPassword(
          email: email,
          password: password,
        );
        final user = credentials.user;
        if (user == null) return null;
        return {
          'id': user.uid,
          'email': user.email ?? '',
          'name': user.displayName ?? '',
          'photoUrl': user.photoURL,
        };
      },
      operation: 'auth.login',
      category: LogCategory.auth,
      context: {'method': 'email'},
      requiresNetwork: true,
    );
  }

  FutureEither<Map<String, dynamic>?> signUp({
    required String name,
    required String email,
    required String password,
  }) async {
    return runTask(
      () async {
        final credentials = await _firebaseAuth.createUserWithEmailAndPassword(
          email: email,
          password: password,
        );
        final user = credentials.user;
        if (user == null) return null;
        await user.updateDisplayName(name);
        return {
          'id': user.uid,
          'email': user.email ?? '',
          'name': name,
          'photoUrl': user.photoURL,
        };
      },
      operation: 'auth.signUp',
      category: LogCategory.auth,
      context: {'method': 'email'},
      requiresNetwork: true,
    );
  }

  FutureEither<void> forgotPassword({required String email}) async {
    return runTask(
      () async {
        await _firebaseAuth.sendPasswordResetEmail(email: email);
      },
      operation: 'auth.forgotPassword',
      category: LogCategory.auth,
      requiresNetwork: true,
    );
  }

  FutureEither<Map<String, dynamic>?> loginWithGoogle() async {
    return runTask(
      () async {
        final credentials = await _firebaseAuth.signInWithProvider(
          GoogleAuthProvider(),
        );
        return _userMap(credentials.user);
      },
      operation: 'auth.loginWithGoogle',
      category: LogCategory.auth,
      context: {'method': 'google'},
      requiresNetwork: true,
    );
  }

  Map<String, dynamic>? _userMap(User? user) {
    if (user == null) return null;
    return {
      'id': user.uid,
      'email': user.email ?? '',
      'name': user.displayName ?? '',
      'photoUrl': user.photoURL,
    };
  }

  FutureEither<void> logout() async {
    return runTask(
      () async {
        await _firebaseAuth.signOut();
      },
      operation: 'auth.logout',
      category: LogCategory.auth,
      requiresNetwork: true,
    );
  }

  FutureEither<Map<String, dynamic>?> getCurrentUser() async {
    return runTask(
      () async {
        final user = _firebaseAuth.currentUser;
        if (user == null) return null;
        return {
          'id': user.uid,
          'email': user.email ?? '',
          'name': user.displayName ?? '',
          'photoUrl': user.photoURL,
        };
      },
      operation: 'auth.getCurrentUser',
      category: LogCategory.auth,
    );
  }

  void dispose() {
    // Firebase manages its own streams
  }
}
