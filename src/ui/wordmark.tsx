import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from './text';

/** The name signed in pen, stamped with a small vermilion seal — the only UI color besides ink. */
export function Wordmark({ large = false }: { large?: boolean }) {
  styles.useVariants({ large });
  return (
    <View accessibilityLabel="자비스" accessibilityRole="header" accessible style={styles.row}>
      <Text style={styles.name} variant="script">
        Jarvis
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
        true: { fontSize: 72, lineHeight: 92 },
        false: { fontSize: 38, lineHeight: 50 },
      },
    },
  },
  seal: {
    backgroundColor: theme.colors.seal,
    variants: {
      large: {
        true: { width: 14, height: 14, marginTop: theme.space.lg },
        false: { width: 8, height: 8, marginTop: theme.space.sm },
      },
    },
  },
}));
