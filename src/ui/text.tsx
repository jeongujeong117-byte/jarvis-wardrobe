import type { ReactNode } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { TypeVariant } from '@/design/tokens';

export type TextTone = 'primary' | 'secondary' | 'tertiary' | 'onAccent' | 'onInverse' | 'seal';

type Props = RNTextProps & {
  variant?: TypeVariant;
  tone?: TextTone;
  align?: 'left' | 'center' | 'right';
  children?: ReactNode;
};

/** The only way screens render text. No screen sets fontSize, fontFamily or color itself. */
export function Text({ variant = 'body', tone = 'primary', align = 'left', style, ...rest }: Props) {
  styles.useVariants({ variant, tone, align });
  return <RNText {...rest} style={[styles.text, style]} />;
}

const styles = StyleSheet.create((theme) => ({
  text: {
    variants: {
      variant: {
        display: theme.type.display,
        heading: theme.type.heading,
        title: theme.type.title,
        body: theme.type.body,
        label: theme.type.label,
        caption: theme.type.caption,
        script: theme.type.script,
        masthead: theme.type.masthead,
      },
      tone: {
        primary: { color: theme.colors.textPrimary },
        secondary: { color: theme.colors.textSecondary },
        tertiary: { color: theme.colors.textTertiary },
        onAccent: { color: theme.colors.onAccent },
        onInverse: { color: theme.colors.onInverse },
        seal: { color: theme.colors.seal },
      },
      align: {
        left: { textAlign: 'left' },
        center: { textAlign: 'center' },
        right: { textAlign: 'right' },
      },
    },
  },
}));
