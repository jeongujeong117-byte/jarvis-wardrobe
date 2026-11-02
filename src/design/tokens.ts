/**
 * Raw design tokens. Screens never import this file directly —
 * they read values through the unistyles theme (`theme.space`, `theme.type`, ...).
 *
 * Source of every decision: docs/ui/01-brief.md (v2, section 10).
 */
import type { TextStyle } from 'react-native';

/** 4pt grid. Audit found 20 marginTop / 14 paddingHorizontal values; all snap to these. */
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  section: 32,
  hero: 48,
} as const;

/**
 * Four radii by role (audit: 20 distinct values).
 * - none: garment color fields — Mondrian blocks, always square
 * - sm:   thumbnails, small badges
 * - card: summary cards, sheets, inputs (Clutter's soft containers)
 * - pill: buttons, chips, tabs
 */
export const radius = {
  none: 0,
  sm: 8,
  card: 16,
  pill: 999,
} as const;

/** Line weights carry meaning, not decoration. */
export const stroke = {
  hairline: 0.5,
  base: 1,
  structural: 3,
  emphasis: 2,
} as const;

/** Minimum touch target (iOS HIG 44pt / Material 48dp → 44 floor, buttons use 52). */
export const touch = {
  min: 44,
  button: 52,
} as const;

/** Bundled Pretendard weights. Weight is set by family name, never by fontWeight. */
export const fontFamily = {
  regular: 'Pretendard-Regular',
  medium: 'Pretendard-Medium',
  bold: 'Pretendard-Bold',
} as const;

/** Type scale: audit found 30 font sizes, 15 line heights, 6 weights → 7 styles, 3 weights. */
export const type = {
  numeral: { fontFamily: fontFamily.bold, fontSize: 56, lineHeight: 60, letterSpacing: -2 },
  display: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 36, letterSpacing: -0.8 },
  heading: { fontFamily: fontFamily.bold, fontSize: 20, lineHeight: 28, letterSpacing: -0.4 },
  title: { fontFamily: fontFamily.medium, fontSize: 17, lineHeight: 24, letterSpacing: -0.2 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22, letterSpacing: -0.1 },
  label: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20, letterSpacing: -0.1 },
  caption: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16, letterSpacing: 0 },
} as const satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;

/** One easing, three durations (brief 5-2: motion only in three places). */
export const motion = {
  fast: 150,
  base: 200,
  sheet: 250,
} as const;

/** Illustration-only colors (never text, never UI chrome). Mondrian's yellow block. */
export const art = {
  yellow: '#F2C200',
} as const;

/** Readable column widths for wide screens (web / tablet). */
export const layout = {
  readable: 640,
  wide: 1040,
} as const;
