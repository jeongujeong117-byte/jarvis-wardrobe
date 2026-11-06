import { TextInput, View, type TextInputProps } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Text } from './text';

/** A line to write on — the way a form looks on paper. The rule is ≥3:1. */
export function Field({ label, ...input }: TextInputProps & { label: string }) {
  const { theme } = useUnistyles();
  return (
    <View style={styles.field}>
      <Text tone="secondary" variant="label">
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.colors.textTertiary}
        selectionColor={theme.colors.textPrimary}
        {...input}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  field: { gap: theme.space.xs },
  input: {
    minHeight: 48,
    borderBottomWidth: theme.stroke.base,
    borderBottomColor: theme.colors.borderInteractive,
    color: theme.colors.textPrimary,
    fontFamily: theme.type.body.fontFamily,
    fontSize: 17,
    paddingVertical: theme.space.sm,
  },
}));
