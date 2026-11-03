import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from './text';

export type TabItem<K extends string> = { key: K; label: string };

/** Words only. The current tab is a solid ink rectangle; no line, no stroke, no rounding. */
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
              style={[styles.tab, selected && styles.tabOn]}>
              <Text tone={selected ? 'onAccent' : 'secondary'} variant="label">
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
    paddingBottom: Math.max(rt.insets.bottom, theme.space.sm),
    paddingTop: theme.space.sm,
  },
  track: {
    width: '100%',
    maxWidth: theme.layout.readable,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: theme.space.xl,
    gap: theme.space.xs,
  },
  tab: {
    flex: 1,
    minHeight: theme.touch.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabOn: { backgroundColor: theme.colors.accent },
}));
