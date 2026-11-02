import Svg, { Line, Path, Rect } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

import { art } from '@/design/tokens';

/**
 * Original monoline illustration in the spirit of Clutter's line drawings:
 * a clothing rail with three garments. One garment is filled with the theme's
 * signal color, one small block on the floor carries the Mondrian yellow.
 * Decorative only — hidden from screen readers.
 */
export function RailIllustration({ height = 220 }: { height?: number }) {
  const { theme } = useUnistyles();
  const ink = theme.colors.textPrimary;
  const fill = theme.colors.accent;
  const s = { stroke: ink, strokeWidth: 2.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  return (
    <Svg
      accessibilityElementsHidden
      height={height}
      importantForAccessibility="no-hide-descendants"
      viewBox="0 0 320 220"
      width="100%">
      {/* rail + posts + feet */}
      <Line x1="24" x2="296" y1="28" y2="28" {...s} />
      <Line x1="36" x2="36" y1="28" y2="204" {...s} />
      <Line x1="284" x2="284" y1="28" y2="204" {...s} />
      <Line x1="20" x2="52" y1="204" y2="204" {...s} />
      <Line x1="268" x2="300" y1="204" y2="204" {...s} />

      {/* hanger 1 + shirt (filled with signal color) */}
      <Path d="M92 28 C92 20 102 20 102 28 L102 34" fill="none" {...s} />
      <Path d="M102 34 L76 50 H128 Z" fill="none" {...s} />
      <Path
        d="M84 50 L68 60 L74 78 L82 75 V128 H122 V75 L130 78 L136 60 L120 50 C116 58 110 61 102 61 C94 61 88 58 84 50 Z"
        fill={fill}
        {...s}
      />

      {/* hanger 2 + long coat (outline) */}
      <Path d="M160 28 C160 20 170 20 170 28 L170 34" fill="none" {...s} />
      <Path d="M170 34 L144 50 H196 Z" fill="none" {...s} />
      <Path d="M152 50 L140 58 L136 112 L146 112 L148 70 V168 H192 V70 L194 112 L204 112 L200 58 L188 50 L170 78 Z" fill="none" {...s} />
      <Line x1="170" x2="170" y1="78" y2="168" {...s} />

      {/* hanger 3 + trousers (outline) */}
      <Path d="M232 28 C232 20 242 20 242 28 L242 34" fill="none" {...s} />
      <Line x1="220" x2="264" y1="44" y2="44" {...s} />
      <Path d="M220 44 L242 34 L264 44" fill="none" {...s} />
      <Path d="M222 48 H262 L266 150 H248 L242 82 L236 150 H218 Z" fill="none" {...s} />

      {/* floor block — Mondrian yellow, non-text */}
      <Rect fill={art.yellow} height="18" width="34" x="196" y="186" {...s} />
      <Rect fill="none" height="18" width="22" x="236" y="186" {...s} />
    </Svg>
  );
}
