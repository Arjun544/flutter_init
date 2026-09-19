import '../../../../../imports/imports.dart';

/// A single destination in [AppNavigationDrawer].
class AppDrawerDestination {
  const AppDrawerDestination({
    required this.label,
    required this.icon,
    this.selectedIcon,
  });

  final String label;
  final IconData icon;
  final IconData? selectedIcon;
}

/// Material [NavigationDrawer] with a simple Cupertino list fallback.
///
/// Usage:
/// ```dart
/// AppNavigationDrawer(
///   selectedIndex: index,
///   onDestinationSelected: (i) => setState(() => index = i),
///   destinations: const [
///     AppDrawerDestination(label: 'Home', icon: Icons.home_outlined),
///     AppDrawerDestination(label: 'Settings', icon: Icons.settings_outlined),
///   ],
/// )
/// ```
class AppNavigationDrawer extends StatelessWidget {
  const AppNavigationDrawer({
    super.key,
    required this.destinations,
    required this.selectedIndex,
    required this.onDestinationSelected,
    this.header,
    this.platform,
  });

  final List<AppDrawerDestination> destinations;
  final int selectedIndex;
  final ValueChanged<int> onDestinationSelected;
  final Widget? header;
  final AppPlatformStyle? platform;

  @override
  Widget build(BuildContext context) {
    final useCupertino = platform != null
        ? platform == AppPlatformStyle.cupertino
        : context.isCupertinoUi;
    final colors = context.colors;

    if (useCupertino) {
      return Drawer(
        backgroundColor: colors.surfaceContainerLow,
        child: SafeArea(
          child: ListView(
            padding: EdgeInsets.symmetric(vertical: AppSpacing.md),
            children: [
              if (header != null) ...[
                Padding(
                  padding: EdgeInsets.all(AppSpacing.md),
                  child: header!,
                ),
                const AppDivider(),
              ],
              for (var i = 0; i < destinations.length; i++)
                CupertinoListTile(
                  leading: Icon(
                    selectedIndex == i
                        ? (destinations[i].selectedIcon ??
                            destinations[i].icon)
                        : destinations[i].icon,
                    color: selectedIndex == i
                        ? colors.primary
                        : colors.onSurfaceVariant,
                  ),
                  title: Text(
                    destinations[i].label,
                    style: context.textTheme.bodyLarge?.copyWith(
                      color: selectedIndex == i
                          ? colors.primary
                          : colors.onSurface,
                      fontWeight: selectedIndex == i
                          ? FontWeight.w600
                          : FontWeight.w500,
                    ),
                  ),
                  onTap: () => onDestinationSelected(i),
                ),
            ],
          ),
        ),
      );
    }

    return NavigationDrawer(
      selectedIndex: selectedIndex,
      onDestinationSelected: onDestinationSelected,
      backgroundColor: colors.surfaceContainerLow,
      children: [
        if (header != null)
          Padding(
            padding: EdgeInsets.fromLTRB(
              AppSpacing.md,
              AppSpacing.xl,
              AppSpacing.md,
              AppSpacing.md,
            ),
            child: header!,
          ),
        for (final destination in destinations)
          NavigationDrawerDestination(
            icon: Icon(destination.icon),
            selectedIcon: Icon(destination.selectedIcon ?? destination.icon),
            label: Text(destination.label),
          ),
      ],
    );
  }
}
