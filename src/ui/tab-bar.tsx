import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { PenDrawing } from './pen/pen-drawing';
import { Text } from './text';

export type TabItem<K extends string> = { key: K; label: string };

/** Words only; the current tab is underlined with a pen stroke. One hairline separates it from the page. */
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
              style={styles.tab}>
              <Text tone={selected ? 'primary' : 'tertiary'} variant="label">
                {item.label}
              </Text>
              <View style={styles.mark}>
                {selected ? <PenDrawing height="100%" name="swash" stretch viewBox="0 0 100 12" width="100%" /> : null}
              </View>
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
    paddingBottom: Math.max(rt.insets.bottom, theme.space.sm),
  },
  track: {
    width: '100%',
    maxWidth: theme.layout.readable,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  mark: { width: 44, height: 7 },
}));
