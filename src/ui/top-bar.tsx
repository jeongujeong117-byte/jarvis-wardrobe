import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { IconButton } from './icon-button';
import { Text } from './text';

/** Clutter layout: identity on the left, at most one action on the right. */
export function TopBar({
  leading,
  trailing,
  width = 'readable',
}: {
  leading: ReactNode;
  trailing?: ReactNode;
  /** Must match the ScreenScroll width below it so edges line up on wide screens. */
  width?: 'readable' | 'wide';
}) {
  styles.useVariants({ width });
  return (
    <View style={styles.bar}>
      {leading}
      <View style={styles.trailing}>{trailing}</View>
    </View>
  );
}

/** Sub-screen bar: back on the left, title centered. */
export function BackBar({
  title,
  onBack,
  backIcon,
}: {
  title: string;
  onBack: () => void;
  backIcon: LucideIcon;
}) {
  return (
    <View style={styles.backBar}>
      <IconButton icon={backIcon} label="뒤로 가기" onPress={onBack} />
      <Text accessibilityRole="header" variant="title">
        {title}
      </Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  bar: {
    width: '100%',
    alignSelf: 'center',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space.xl,
    variants: {
      width: {
        readable: { maxWidth: theme.layout.readable },
        wide: { maxWidth: theme.layout.wide },
      },
    },
  },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: theme.space.xs },
  backBar: {
    width: '100%',
    maxWidth: theme.layout.readable,
    alignSelf: 'center',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space.sm,
  },
  spacer: { width: theme.touch.min },
}));
