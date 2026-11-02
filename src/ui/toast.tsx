import { Check } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import { Icon } from './icon';
import { Text } from './text';

/** Success feedback without interrupting (no Alert). Announced to screen readers via liveRegion. */
export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)} style={styles.wrap}>
      <View accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.toast}>
        <Icon icon={Check} size={18} tone="onInverse" />
        <Text tone="onInverse" variant="label">
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create((theme) => ({
  wrap: {
    position: 'absolute',
    left: theme.space.xl,
    right: theme.space.xl,
    bottom: theme.space.lg,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
    minHeight: theme.touch.min,
    paddingHorizontal: theme.space.xl,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.inverse,
  },
}));
