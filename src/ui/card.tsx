import type { ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/** Clutter-style soft container. Flat: no shadow, no border — contrast comes from the surface step. */
export function Card({ children, padded = true }: { children: ReactNode; padded?: boolean }) {
  styles.useVariants({ padded });
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surfaceRaised,
    borderRadius: theme.radius.card,
    overflow: 'hidden',
    variants: {
      padded: {
        true: { padding: theme.space.xl },
        false: {},
      },
    },
  },
}));
