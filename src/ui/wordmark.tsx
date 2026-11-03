import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from './text';

/** Magazine masthead: JARVIS in Bodoni caps with one small burgundy square after it. */
export function Wordmark({ large = false }: { large?: boolean }) {
  styles.useVariants({ large });
  return (
    <View accessibilityLabel="자비스" accessibilityRole="header" accessible style={styles.row}>
      <Text style={styles.name} variant="masthead">
        JARVIS
      </Text>
      <View style={styles.seal} />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.space.sm },
  name: {
    variants: {
      large: {
        true: { fontSize: 48, lineHeight: 58, letterSpacing: 8 },
        false: {},
      },
    },
  },
  seal: {
    backgroundColor: theme.colors.seal,
    variants: {
      large: {
        true: { width: 12, height: 12, marginTop: theme.space.md },
        false: { width: 6, height: 6, marginTop: theme.space.xs },
      },
    },
  },
}));
