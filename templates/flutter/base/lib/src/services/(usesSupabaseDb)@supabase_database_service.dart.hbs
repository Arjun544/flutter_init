import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/app_config.dart';
import '../utils/utils.dart';

class SupabaseDatabaseService {
  SupabaseDatabaseService._();
  static final instance = SupabaseDatabaseService._();

  SupabaseClient get _client => AppConfig.supabase;

  FutureEither<List<Map<String, dynamic>>> select(
    String table, {
    String columns = '*',
  }) {
    return runTask(
      () async {
        final rows = await _client.from(table).select(columns);
        return List<Map<String, dynamic>>.from(rows);
      },
      operation: 'supabase.select',
      category: LogCategory.database,
      context: {'table': table, 'columns': columns},
      requiresNetwork: true,
    );
  }

  FutureEither<Map<String, dynamic>> insert(
    String table,
    Map<String, dynamic> values,
  ) {
    return runTask(
      () async {
        final rows = await _client.from(table).insert(values).select();
        return Map<String, dynamic>.from(rows.first);
      },
      operation: 'supabase.insert',
      category: LogCategory.database,
      context: {'table': table},
      requiresNetwork: true,
    );
  }
}
