import '../../../../../imports/imports.dart';

/// A single destination in [AppBottomNavBar].
class AppBottomNavItem {
  const AppBottomNavItem({
    required this.label,
    required this.icon,
    this.activeIcon,
  });

  final String label;
  final IconData icon;
  final IconData? activeIcon;
}

/// Adaptive bottom navigation bar.
///
/// Usage:
/// ```dart
/// AppBottomNavBar(
///   currentIndex: index,
///   onTap: (i) => setState(() => index = i),
///   items: const [
///     AppBottomNavItem(label: 'Home', icon: Icons.home_outlined),
///     AppBottomNavItem(label: 'Profile', icon: Icons.person_outline),
///   ],
/// )
/// ```
class AppBottomNavBar extends StatelessWidget {
  const AppBottomNavBar({
    super.key,
    required this.items,
    required this.currentIndex,
    required this.onTap,
    this.platform,
  });

  final List<AppBottomNavItem> items;
  final int currentIndex;
  final ValueChanged<int> onTap;
  final AppPlatformStyle? platform;

  @override
  Widget build(BuildContext context) {
    final useCupertino = platform != null
        ? platform == AppPlatformStyle.cupertino
        : context.isCupertinoUi;
    final colors = context.colors;

    if (useCupertino) {
      return CupertinoTabBar(
        currentIndex: currentIndex,
        onTap: onTap,
        backgroundColor: colors.surfaceContainer,
        activeColor: colors.primary,
        inactiveColor: colors.onSurfaceVariant,
        items: [
          for (final item in items)
            BottomNavigationBarItem(
              icon: Icon(item.icon),
              activeIcon: Icon(item.activeIcon ?? item.icon),
              label: item.label,
            ),
        ],
      );
    }

    return NavigationBar(
      selectedIndex: currentIndex,
      onDestinationSelected: onTap,
      backgroundColor: colors.surfaceContainer,
      indicatorColor: colors.secondaryContainer,
      destinations: [
        for (final item in items)
          NavigationDestination(
            icon: Icon(item.icon),
            selectedIcon: Icon(item.activeIcon ?? item.icon),
            label: item.label,
          ),
      ],
    );
  }
}
