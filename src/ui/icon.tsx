import type { LucideIcon } from 'lucide-react-native';
import { useUnistyles } from 'react-native-unistyles';

import type { TextTone } from './text';

type Props = {
  icon: LucideIcon;
  tone?: TextTone;
  /** Explicit color wins over tone — used on garment color fields. */
  color?: string;
  size?: number;
};

/** One icon family (lucide), one stroke weight (2). Replaces the text glyphs ◫ ‹ › ↻ ✦ ＋ ☀. */
export function Icon({ icon: Glyph, tone = 'primary', color, size = 22 }: Props) {
  const { theme } = useUnistyles();
  const toneColor = {
    primary: theme.colors.textPrimary,
    secondary: theme.colors.textSecondary,
    tertiary: theme.colors.textTertiary,
    accent: theme.colors.accentText,
    onAccent: theme.colors.onAccent,
    onInverse: theme.colors.onInverse,
  }[tone];
  return (
    <Glyph
      accessibilityElementsHidden
      color={color ?? toneColor}
      importantForAccessibility="no"
      size={size}
      strokeWidth={2}
    />
  );
}
