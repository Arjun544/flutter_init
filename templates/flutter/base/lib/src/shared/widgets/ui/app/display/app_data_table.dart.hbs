import '../../../../../imports/imports.dart';

/// Adaptive data table — Material [DataTable] or a simple Cupertino list fallback.
///
/// Usage:
/// ```dart
/// AppDataTable(
///   columns: const ['Name', 'Role'],
///   rows: const [
///     ['Ada', 'Admin'],
///     ['Lin', 'Editor'],
///   ],
/// )
/// ```
class AppDataTable extends StatelessWidget {
  const AppDataTable({
    super.key,
    required this.columns,
    required this.rows,
    this.platform,
  });

  final List<String> columns;
  final List<List<String>> rows;
  final AppPlatformStyle? platform;

  @override
  Widget build(BuildContext context) {
    final useCupertino = platform != null
        ? platform == AppPlatformStyle.cupertino
        : context.isCupertinoUi;
    final colors = context.colors;
    final textTheme = context.textTheme;

    if (useCupertino) {
      return DecoratedBox(
        decoration: BoxDecoration(
          color: colors.surfaceContainerLow,
          borderRadius: AppBorders.md,
          border: Border.all(color: colors.outlineVariant),
        ),
        child: Column(
          children: [
            for (final row in rows) ...[
              Padding(
                padding: EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    for (var i = 0; i < columns.length; i++) ...[
                      if (i > 0) SizedBox(height: AppSpacing.xs),
                      Text(
                        columns[i],
                        style: textTheme.labelSmall?.copyWith(
                          color: colors.onSurfaceVariant,
                        ),
                      ),
                      Text(
                        i < row.length ? row[i] : '',
                        style: textTheme.bodyMedium?.copyWith(
                          color: colors.onSurface,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              if (row != rows.last) const AppDivider(),
            ],
          ],
        ),
      );
    }

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        headingRowColor: WidgetStatePropertyAll(colors.surfaceContainerLow),
        border: TableBorder.all(color: colors.outlineVariant, width: 1),
        columns: [
          for (final column in columns)
            DataColumn(
              label: Text(
                column,
                style: textTheme.titleSmall?.copyWith(
                  color: colors.onSurface,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
        ],
        rows: [
          for (final row in rows)
            DataRow(
              cells: [
                for (var i = 0; i < columns.length; i++)
                  DataCell(
                    Text(
                      i < row.length ? row[i] : '',
                      style: textTheme.bodyMedium?.copyWith(
                        color: colors.onSurface,
                      ),
                    ),
                  ),
              ],
            ),
        ],
      ),
    );
  }
}
