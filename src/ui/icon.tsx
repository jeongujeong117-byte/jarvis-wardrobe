import type { LucideIcon } from 'lucide-react-native';
import { useUnistyles } from 'react-native-unistyles';

import type { TextTone } from './text';

/** Utility icons only (add, close, back, chevron). Thin stroke so they sit quietly beside the pen lines. */
export function Icon({
  icon: Glyph,
  tone = 'primary',
  size = 22,
}: {
  icon: LucideIcon;
  tone?: TextTone;
  size?: number;
}) {
  const { theme } = useUnistyles();
  const color = {
    primary: theme.colors.textPrimary,
    secondary: theme.colors.textSecondary,
    tertiary: theme.colors.textTertiary,
    onAccent: theme.colors.onAccent,
    onInverse: theme.colors.onInverse,
    seal: theme.colors.seal,
  }[tone];
  return (
    <Glyph
      accessibilityElementsHidden
      color={color}
      importantForAccessibility="no"
      size={size}
      strokeWidth={1.5}
    />
  );
}
