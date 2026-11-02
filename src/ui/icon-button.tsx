import type { LucideIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Icon } from './icon';

type Props = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  variant?: 'plain' | 'filled';
};

/** 44×44 minimum. `label` is required — icon-only controls must be named for screen readers. */
export function IconButton({ icon, label, onPress, variant = 'plain' }: Props) {
  styles.useVariants({ variant });
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Icon icon={icon} tone={variant === 'filled' ? 'onInverse' : 'primary'} />
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    width: theme.touch.min,
    height: theme.touch.min,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      variant: {
        plain: { backgroundColor: 'transparent' },
        filled: { backgroundColor: theme.colors.inverse },
      },
    },
  },
  pressed: { opacity: 0.7 },
}));
