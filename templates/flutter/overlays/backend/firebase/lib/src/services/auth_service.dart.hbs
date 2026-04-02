import '../utils/utils.dart';
import '../config/app_config.dart';
import 'package:firebase_auth/firebase_auth.dart';

class AuthService {
  AuthService._();
  static final AuthService instance = AuthService._();

  FirebaseAuth get _firebaseAuth => AppConfig.firebaseAuth;

  /// Stream of auth state changes. Emits the current user map or null.
  Stream<Map<String, dynamic>?> get authStateChanges {
    return _firebaseAuth.authStateChanges().map((User? user) {
      if (user == null) return null;
      return {
        'id': user.uid,
        'email': user.email ?? '',
        'name': user.displayName ?? '',
        'photoUrl': user.photoURL,
      };
    });
  }

  FutureEither<Map<String, dynamic>?> login({
    required String email,
    required String password,
  }) async {
    return runTask(() async {
      final credentials = await _firebaseAuth.signInWithEmailAndPassword(
        email: email, 
        password: password
      );
      final user = credentials.user;
      if (user == null) return null;
      return {
        'id': user.uid,
        'email': user.email ?? '',
        'name': user.displayName ?? '',
        'photoUrl': user.photoURL,
      };
    }, requiresNetwork: true);
  }

  FutureEither<Map<String, dynamic>?> signUp({
    required String name,
    required String email,
    required String password,
  }) async {
    return runTask(() async {
      final credentials = await _firebaseAuth.createUserWithEmailAndPassword(
        email: email, 
        password: password
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
    }, requiresNetwork: true);
  }

  FutureEither<void> forgotPassword({required String email}) async {
    return runTask(() async {
      await _firebaseAuth.sendPasswordResetEmail(email: email);
    }, requiresNetwork: true);
  }

  FutureEither<void> logout() async {
    return runTask(() async {
      await _firebaseAuth.signOut();
    }, requiresNetwork: true);
  }

  FutureEither<Map<String, dynamic>?> getCurrentUser() async {
    return runTask(() async {
      final user = _firebaseAuth.currentUser;
      if (user == null) return null;
      return {
        'id': user.uid,
        'email': user.email ?? '',
        'name': user.displayName ?? '',
        'photoUrl': user.photoURL,
      };
    });
  }

  void dispose() {
    // Firebase manages its own streams
  }
}
