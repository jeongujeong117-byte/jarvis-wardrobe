import type { LucideIcon } from 'lucide-react-native';
import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Icon } from './icon';
import { Text, type TextTone } from './text';

/** Rows on the page itself, separated by rules. No boxes. */
export function ListGroup({ title, children }: { title?: string; children: ReactNode }) {
  const rows = Children.toArray(children);
  return (
    <View style={styles.section}>
      {title ? (
        <Text accessibilityRole="header" style={styles.title} variant="heading">
          {title}
        </Text>
      ) : null}
      <View style={styles.rule} />
      {rows.map((row, index) => (
        <Fragment key={index}>
          {row}
          <View style={styles.rule} />
        </Fragment>
      ))}
    </View>
  );
}

export function ListRow({
  title,
  description,
  trailing,
  onPress,
  titleTone = 'primary',
  icon,
}: {
  title: string;
  description?: string;
  trailing?: ReactNode;
  onPress?: () => void;
  titleTone?: TextTone;
  icon?: LucideIcon;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      {icon ? <Icon icon={icon} size={20} tone="secondary" /> : null}
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
  section: { marginTop: theme.space.section },
  title: { marginBottom: theme.space.md },
  rule: { height: theme.space.xs },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.lg,
    paddingVertical: theme.space.md,
  },
  rowPressed: { backgroundColor: theme.colors.surfaceSunken },
  rowText: { flex: 1, gap: 2 },
}));
