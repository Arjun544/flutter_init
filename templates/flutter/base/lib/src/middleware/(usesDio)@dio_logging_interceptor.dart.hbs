import 'package:dio/dio.dart';
import '../utils/logger.dart';

/// Dio middleware: structured request/response/error logs via [AppLogger.network].
class DioLoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    options.extra['loggingStartedAt'] = DateTime.now();
    AppLogger.network(
      'HTTP request started',
      context: {'method': options.method, 'path': options.path},
    );
    handler.next(options);
  }

  @override
  void onResponse(
    Response<dynamic> response,
    ResponseInterceptorHandler handler,
  ) {
    final startedAt = response.requestOptions.extra['loggingStartedAt'];
    final durationMs = startedAt is DateTime
        ? DateTime.now().difference(startedAt).inMilliseconds
        : null;
    final statusCode = response.statusCode ?? 0;
    final context = {
      'method': response.requestOptions.method,
      'path': response.requestOptions.path,
      'statusCode': statusCode,
      'durationMs': ?durationMs,
    };
    if (statusCode >= 200 && statusCode < 300) {
      AppLogger.network('HTTP response received', context: context);
    } else {
      AppLogger.error(
        'HTTP response failed',
        category: LogCategory.network,
        context: context,
      );
    }
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    final startedAt = err.requestOptions.extra['loggingStartedAt'];
    final durationMs = startedAt is DateTime
        ? DateTime.now().difference(startedAt).inMilliseconds
        : null;
    AppLogger.error(
      'HTTP request failed',
      error: err,
      stackTrace: err.stackTrace,
      category: LogCategory.network,
      context: {
        'method': err.requestOptions.method,
        'path': err.requestOptions.path,
        'statusCode': err.response?.statusCode,
        'durationMs': ?durationMs,
      },
    );
    handler.next(err);
  }
}
