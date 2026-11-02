import { TextInput, View, type TextInputProps } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Text } from './text';

/** Labeled input. Border uses the ≥3:1 interactive token (audit blocker #3: old border was 1.27:1). */
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
        selectionColor={theme.colors.accent}
        {...input}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  field: { gap: theme.space.sm },
  input: {
    minHeight: theme.touch.button,
    borderRadius: theme.radius.card,
    borderWidth: theme.stroke.base,
    borderColor: theme.colors.borderInteractive,
    backgroundColor: theme.colors.surfaceBase,
    paddingHorizontal: theme.space.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.type.body.fontFamily,
    fontSize: theme.type.body.fontSize,
  },
}));
