import type { LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Icon } from './icon';
import { Text } from './text';

export type TabItem<K extends string> = { key: K; label: string; icon: LucideIcon };

/**
 * Segmented bottom tab (Clutter). Docked to the bottom edge — not floating —
 * so it respects the home indicator instead of hovering above it.
 */
export function TabBar<K extends string>({
  items,
  active,
  onChange,
}: {
  items: TabItem<K>[];
  active: K;
  onChange: (key: K) => void;
}) {
  return (
    <View accessibilityRole="tablist" style={styles.bar}>
      <View style={styles.track}>
        {items.map((item) => {
          const selected = item.key === active;
          return (
            <Pressable
              accessibilityLabel={item.label}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              key={item.key}
              onPress={() => onChange(item.key)}
              style={[styles.tab, selected && styles.tabActive]}>
              <Icon icon={item.icon} size={20} tone={selected ? 'onInverse' : 'secondary'} />
              <Text tone={selected ? 'onInverse' : 'secondary'} variant="label">
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  bar: {
    backgroundColor: theme.colors.surfaceBase,
    borderTopWidth: theme.stroke.hairline,
    borderTopColor: theme.colors.borderInteractive,
    paddingTop: theme.space.sm,
    paddingBottom: Math.max(rt.insets.bottom, theme.space.sm),
    paddingHorizontal: theme.space.xl,
  },
  track: {
    width: '100%',
    maxWidth: theme.layout.readable,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: theme.space.xs,
    padding: theme.space.xs,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceRaised,
  },
  tab: {
    flex: 1,
    minHeight: theme.touch.min,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space.xs,
    borderRadius: theme.radius.pill,
  },
  tabActive: { backgroundColor: theme.colors.inverse },
}));
