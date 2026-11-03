import type { LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Icon } from './icon';
import { Text } from './text';

/**
 * primary — the one action per screen: a solid ink rectangle (no corners, no stroke)
 * text    — everything else: words only, no box
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  block = false,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'quiet' | 'text';
  icon?: LucideIcon;
  disabled?: boolean;
  block?: boolean;
}) {
  styles.useVariants({ variant, block });
  const tone = variant === 'primary' ? 'onAccent' : 'primary';
  // quiet = the same rectangle after the action is done: tinted, ink text, still tappable (undo).
  return (
    <Pressable
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
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      variant: {
        primary: {
          minHeight: theme.touch.button,
          paddingHorizontal: theme.space.xl + theme.space.xs,
          backgroundColor: theme.colors.accent,
        },
        quiet: {
          minHeight: theme.touch.button,
          paddingHorizontal: theme.space.xl + theme.space.xs,
          // Sunken is too close to the page in dark mode, so night uses the raised surface.
          backgroundColor: theme.isDark ? theme.colors.surfaceRaised : theme.colors.surfaceSunken,
        },
        text: {
          minHeight: theme.touch.min,
          paddingHorizontal: theme.space.sm,
        },
      },
      block: {
        true: { alignSelf: 'stretch' },
        false: { alignSelf: 'flex-start' },
      },
    },
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: theme.space.sm },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.35 },
}));
