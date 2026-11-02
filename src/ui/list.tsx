import type { LucideIcon } from 'lucide-react-native';
import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Icon } from './icon';
import { Text, type TextTone } from './text';

/** Grouped list: one soft container, hairline dividers between rows — not a card per row. */
export function ListGroup({ title, children }: { title?: string; children: ReactNode }) {
  const rows = Children.toArray(children);
  return (
    <View style={styles.section}>
      {title ? (
        <Text accessibilityRole="header" style={styles.sectionTitle} tone="secondary" variant="label">
          {title}
        </Text>
      ) : null}
      <View style={styles.group}>
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index > 0 ? <View style={styles.divider} /> : null}
            {row}
          </Fragment>
        ))}
      </View>
    </View>
  );
}

export function ListRow({
  icon,
  title,
  description,
  trailing,
  onPress,
  titleTone = 'primary',
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  trailing?: ReactNode;
  onPress?: () => void;
  titleTone?: TextTone;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      {icon ? (
        <View style={styles.iconWell}>
          <Icon icon={icon} size={18} />
        </View>
      ) : null}
      <View style={styles.rowText}>
        <Text tone={titleTone} variant="title">
          {title}
        </Text>
        {description ? (
          <Text tone="secondary" variant="caption">
            {description}
          </Text>
        ) : null}
      </View>
      {trailing}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  section: { gap: theme.space.sm, marginTop: theme.space.section },
  sectionTitle: { paddingHorizontal: theme.space.xs },
  group: {
    backgroundColor: theme.colors.surfaceRaised,
    borderRadius: theme.radius.card,
    overflow: 'hidden',
  },
  divider: {
    height: theme.stroke.hairline,
    backgroundColor: theme.colors.borderInteractive,
    marginLeft: theme.space.lg,
  },
  row: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.md,
  },
  rowPressed: { backgroundColor: theme.colors.surfaceSunken },
  iconWell: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 2 },
}));
