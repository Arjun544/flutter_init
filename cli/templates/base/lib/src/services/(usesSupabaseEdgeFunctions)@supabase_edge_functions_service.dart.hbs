import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/app_config.dart';
import '../utils/utils.dart';

class SupabaseEdgeFunctionsService {
  SupabaseEdgeFunctionsService._();
  static final instance = SupabaseEdgeFunctionsService._();

  FunctionsClient get _functions => AppConfig.supabase.functions;

  FutureEither<FunctionResponse> invoke(
    String functionName, {
    Map<String, dynamic>? body,
  }) {
    return runTask(
      () => _functions.invoke(functionName, body: body),
      operation: 'supabase.invoke',
      category: LogCategory.backend,
      context: {'function': functionName},
      requiresNetwork: true,
    );
  }
}
