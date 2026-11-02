import type { LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Icon } from './icon';
import { Text } from './text';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: LucideIcon;
  disabled?: boolean;
  /** Stretch to the parent's width (default) or hug the label. */
  block?: boolean;
  accessibilityHint?: string;
};

/**
 * primary   — the one action you can take now (accent; ≥5.2:1 in every theme)
 * secondary — an alternative (outlined with the ≥3:1 interactive border)
 * ghost     — a quiet escape hatch
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  block = true,
  accessibilityHint,
}: Props) {
  styles.useVariants({ variant, block });
  const tone = variant === 'primary' ? 'onAccent' : 'primary';
  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, disabled && styles.disabled, pressed && styles.pressed]}>
      <View style={styles.content}>
        {icon ? <Icon icon={icon} size={18} tone={tone} /> : null}
        <Text tone={tone} variant="label">
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    minHeight: theme.touch.button,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.space.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      variant: {
        primary: { backgroundColor: theme.colors.accent },
        secondary: {
          backgroundColor: 'transparent',
          borderWidth: theme.stroke.base,
          borderColor: theme.colors.borderInteractive,
        },
        ghost: { backgroundColor: 'transparent' },
      },
      block: {
        true: { alignSelf: 'stretch' },
        false: { alignSelf: 'flex-start' },
      },
    },
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.4 },
}));
