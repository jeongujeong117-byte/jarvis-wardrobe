import { BlurView } from 'expo-blur';
import { BookOpen, type LucideIcon, Shirt, User } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from './icon';
import { Text } from './text';

export type BarSlot = {
  key: string;
  label: string;
  icon: LucideIcon;
  onPress: () => void;
  /** Spoken label when the visible word is not enough ("오늘 입는 중, 취소하려면 누르세요"). */
  a11yLabel?: string;
  /** Current tab, or an action already done (worn). Shown as a filled dot behind the icon. */
  active?: boolean;
  /** Quieter: a destination you are not on. */
  dim?: boolean;
};

/** expo-blur is a third-party view: Unistyles styles are not passed to it, so this stays a plain object. */
const fill = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const;

/**
 * The only rounded thing in the app: a translucent bar floating over the page, like the
 * navigation of a social app. Groups are separated by space, not by a line.
 */
export function FloatingBar({ groups }: { groups: BarSlot[][] }) {
  const { theme } = useUnistyles();
  return (
    <View pointerEvents="box-none" style={styles.wrap}>
      <View accessibilityRole="tablist" style={styles.pill}>
        <BlurView intensity={40} style={fill} tint={theme.isDark ? 'dark' : 'light'} />
        <View pointerEvents="none" style={[fill, { backgroundColor: theme.colors.barTint }]} />
        {groups.map((group, index) => (
          <View key={index} style={[styles.group, index > 0 && styles.groupGap]}>
            {group.map((slot) => (
              <Pressable
                accessibilityLabel={slot.a11yLabel ?? slot.label}
                accessibilityRole="button"
                accessibilityState={{ selected: slot.active }}
                key={slot.key}
                onPress={slot.onPress}
                style={({ pressed }) => [styles.slot, pressed && styles.pressed]}>
                <View style={[styles.iconWrap, slot.active && styles.iconOn]}>
                  <Icon icon={slot.icon} size={22} tone={slot.active ? 'onAccent' : slot.dim ? 'tertiary' : 'primary'} />
                </View>
                <Text tone={slot.dim ? 'tertiary' : 'primary'} variant="caption">
                  {slot.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

export type Tab = 'today' | 'closet' | 'my';

/** Today / closet / my as bar slots. */
export function tabSlots(active: Tab, onChange: (tab: Tab) => void): BarSlot[] {
  return [
    { key: 'today', label: '오늘', icon: BookOpen, active: active === 'today', dim: active !== 'today', onPress: () => onChange('today') },
    { key: 'closet', label: '옷장', icon: Shirt, active: active === 'closet', dim: active !== 'closet', onPress: () => onChange('closet') },
    { key: 'my', label: '마이', icon: User, active: active === 'my', dim: active !== 'my', onPress: () => onChange('my') },
  ];
}

const styles = StyleSheet.create((theme, rt) => ({
  wrap: {
    position: 'absolute',
    left: theme.space.lg,
    right: theme.space.lg,
    bottom: rt.insets.bottom + theme.space.md,
    alignItems: 'center',
  },
  pill: {
    width: '100%',
    maxWidth: theme.layout.readable,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: theme.space.sm,
    borderRadius: theme.space.xxl,
    overflow: 'hidden',
    boxShadow: '0 8px 28px rgba(22,21,20,0.18)',
  },
  group: { flexDirection: 'row', alignItems: 'center' },
  groupGap: { marginLeft: theme.space.sm },
  slot: { minWidth: 56, minHeight: theme.touch.min + 8, alignItems: 'center', justifyContent: 'center', gap: 2, paddingHorizontal: theme.space.xs },
  iconWrap: { width: 32, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  iconOn: { backgroundColor: theme.colors.accent },
  pressed: { opacity: 0.6 },
}));
