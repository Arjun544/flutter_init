import '../../../../../imports/imports.dart';

/// Adaptive tab bar. Pair with [AppTabBarView] or a [TabBarView].
///
/// Usage:
/// ```dart
/// DefaultTabController(
///   length: 2,
///   child: Column(
///     children: [
///       AppTabBar(tabs: const [Tab(text: 'All'), Tab(text: 'Mine')]),
///       Expanded(child: AppTabBarView(children: [AllTab(), MineTab()])),
///     ],
///   ),
/// )
/// ```
class AppTabBar extends StatelessWidget implements PreferredSizeWidget {
  const AppTabBar({
    super.key,
    required this.tabs,
    this.controller,
    this.isScrollable = false,
    this.platform,
  });

  final List<Widget> tabs;
  final TabController? controller;
  final bool isScrollable;
  final AppPlatformStyle? platform;

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    final useCupertino = platform != null
        ? platform == AppPlatformStyle.cupertino
        : context.isCupertinoUi;
    final colors = context.colors;

    if (useCupertino) {
      // CupertinoSegmentedControl needs typed values — map tab labels.
      final labels = tabs.map((tab) {
        if (tab is Tab) return tab.text ?? '';
        return '';
      }).toList();

      if (controller == null || labels.every((l) => l.isEmpty)) {
        return TabBar(
          controller: controller,
          tabs: tabs,
          isScrollable: isScrollable,
          labelColor: colors.primary,
          unselectedLabelColor: colors.onSurfaceVariant,
          indicatorColor: colors.primary,
        );
      }

      return Padding(
        padding: EdgeInsets.all(AppSpacing.sm),
        child: CupertinoSlidingSegmentedControl<int>(
          groupValue: controller!.index,
          onValueChanged: (value) {
            if (value != null) controller!.animateTo(value);
          },
          children: {
            for (var i = 0; i < labels.length; i++)
              i: Padding(
                padding: EdgeInsets.symmetric(
                  horizontal: AppSpacing.sm,
                  vertical: AppSpacing.xs,
                ),
                child: Text(
                  labels[i],
                  style: context.textTheme.labelLarge?.copyWith(
                    color: colors.onSurface,
                  ),
                ),
              ),
          },
        ),
      );
    }

    return TabBar(
      controller: controller,
      tabs: tabs,
      isScrollable: isScrollable,
      labelColor: colors.primary,
      unselectedLabelColor: colors.onSurfaceVariant,
      indicatorColor: colors.primary,
      indicatorSize: TabBarIndicatorSize.label,
    );
  }
}

/// Thin wrapper around [TabBarView] for consistent naming with [AppTabBar].
class AppTabBarView extends StatelessWidget {
  const AppTabBarView({
    super.key,
    required this.children,
    this.controller,
    this.physics,
  });

  final List<Widget> children;
  final TabController? controller;
  final ScrollPhysics? physics;

  @override
  Widget build(BuildContext context) {
    return TabBarView(
      controller: controller,
      physics: physics,
      children: children,
    );
  }
}
