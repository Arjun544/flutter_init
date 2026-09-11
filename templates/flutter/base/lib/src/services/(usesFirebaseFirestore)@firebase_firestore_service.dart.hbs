import 'package:cloud_firestore/cloud_firestore.dart';
import '../config/app_config.dart';
import '../utils/utils.dart';

class FirebaseFirestoreService {
  FirebaseFirestoreService._();
  static final instance = FirebaseFirestoreService._();

  FirebaseFirestore get _firestore => AppConfig.firestore;

  FutureEither<List<Map<String, dynamic>>> getCollection(String collection) {
    return runTask(
      () async {
        final snapshot = await _firestore.collection(collection).get();
        return snapshot.docs
            .map((document) => {'id': document.id, ...document.data()})
            .toList();
      },
      operation: 'firestore.getCollection',
      category: LogCategory.database,
      context: {'collection': collection},
      requiresNetwork: true,
    );
  }

  FutureEither<String> addDocument(
    String collection,
    Map<String, dynamic> data,
  ) {
    return runTask(
      () async {
        final reference = await _firestore.collection(collection).add(data);
        return reference.id;
      },
      operation: 'firestore.addDocument',
      category: LogCategory.database,
      context: {'collection': collection},
      requiresNetwork: true,
    );
  }
}
