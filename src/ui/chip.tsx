import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from './text';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

/** Selected chips invert (ink pill); unselected chips are outlined at ≥3:1. */
export function Chip({ label, selected, onPress }: Props) {
  styles.useVariants({ selected });
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, pressed && styles.pressed]}>
      <Text tone={selected ? 'onInverse' : 'secondary'} variant="label">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  chip: {
    minHeight: theme.touch.min,
    paddingHorizontal: theme.space.lg,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: theme.stroke.base,
    variants: {
      selected: {
        true: { backgroundColor: theme.colors.inverse, borderColor: theme.colors.inverse },
        false: { backgroundColor: 'transparent', borderColor: theme.colors.borderInteractive },
      },
    },
  },
  pressed: { opacity: 0.8 },
}));
