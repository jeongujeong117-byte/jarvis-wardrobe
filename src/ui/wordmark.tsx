import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from './text';

/**
 * App mark: a tiny Mondrian composition (one accent block, structural lines)
 * next to the name. Replaces the gradient tile with a ◫ glyph.
 */
export function Wordmark() {
  return (
    <View accessibilityLabel="자비스" accessibilityRole="header" style={styles.row}>
      <View style={styles.mark}>
        <View style={styles.markLeft}>
          <View style={styles.accentBlock} />
          <View style={styles.blank} />
        </View>
        <View style={styles.markRight}>
          <View style={styles.blank} />
        </View>
      </View>
      <Text variant="heading">자비스</Text>
    </View>
  );
}

const GAP = 2;

const styles = StyleSheet.create((theme) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.space.sm },
  mark: {
    width: 22,
    height: 22,
    flexDirection: 'row',
    gap: GAP,
    padding: GAP,
    backgroundColor: theme.colors.borderStructural,
  },
  markLeft: { flex: 2, gap: GAP },
  markRight: { flex: 1 },
  accentBlock: { flex: 2, backgroundColor: theme.colors.accent },
  blank: { flex: 1, backgroundColor: theme.colors.surfaceBase },
}));
