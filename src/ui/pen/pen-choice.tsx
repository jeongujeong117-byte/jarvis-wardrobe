import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '../text';

/**
 * A choice in the magazine style: the selected one is a solid ink rectangle, the others are
 * words only. No stroke, no rounded corners. (File keeps its old path/name so imports still work.)
 */
export function PenChoice({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  styles.useVariants({ selected });
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.choice, pressed && styles.pressed]}>
      <Text tone={selected ? 'onAccent' : 'secondary'} variant="label">
        {label}
      </Text>
    </Pressable>
  );
}

/** A row of choices. */
export function PenChoiceRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: theme.space.xs,
    columnGap: 0,
  },
  choice: {
    minHeight: theme.touch.min,
    minWidth: theme.touch.min,
    paddingHorizontal: theme.space.md - 2,
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      selected: {
        true: { backgroundColor: theme.colors.accent },
        false: { backgroundColor: 'transparent' },
      },
    },
  },
  pressed: { opacity: 0.6 },
}));
