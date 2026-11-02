import type { ReactNode } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { TypeVariant } from '@/design/tokens';

export type TextTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'onAccent'
  | 'onInverse';

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
        numeral: theme.type.numeral,
        display: theme.type.display,
        heading: theme.type.heading,
        title: theme.type.title,
        body: theme.type.body,
        label: theme.type.label,
        caption: theme.type.caption,
      },
      tone: {
        primary: { color: theme.colors.textPrimary },
        secondary: { color: theme.colors.textSecondary },
        tertiary: { color: theme.colors.textTertiary },
        accent: { color: theme.colors.accentText },
        onAccent: { color: theme.colors.onAccent },
        onInverse: { color: theme.colors.onInverse },
      },
      align: {
        left: { textAlign: 'left' },
        center: { textAlign: 'center' },
        right: { textAlign: 'right' },
      },
    },
  },
}));
