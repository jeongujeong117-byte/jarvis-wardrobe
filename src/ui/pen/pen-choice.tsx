import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '../text';
import { PenDrawing } from './pen-drawing';

/**
 * A choice marked the way you would on paper: the selected word is circled in pen.
 * No pill, no fill — the hand does the selecting.
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
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.choice, pressed && styles.pressed]}>
      {selected ? (
        <View pointerEvents="none" style={styles.circle}>
          <PenDrawing height="100%" name="circle" stretch width="100%" />
        </View>
      ) : null}
      <Text tone={selected ? 'primary' : 'tertiary'} variant="label">
        {label}
      </Text>
    </Pressable>
  );
}

/** A row of choices, aligned so the first word sits on the text column. */
export function PenChoiceRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.space.md,
    rowGap: theme.space.xs,
  },
  choice: {
    minHeight: theme.touch.min,
    minWidth: theme.touch.min,
    paddingHorizontal: theme.space.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 2,
    right: 2,
  },
  pressed: { opacity: 0.6 },
}));
