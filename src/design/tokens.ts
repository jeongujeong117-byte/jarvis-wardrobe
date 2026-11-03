/**
 * Raw design tokens. Screens read these through the unistyles theme
 * (`theme.space`, `theme.type`, ...), never by importing this file.
 *
 * Direction: docs/ui/06-modernist-analysis.md — "structure by the machine, meaning by the hand".
 * Grid, sans and flat color planes carry every function; the hand (script, fountain-pen
 * drawing) appears only where a person should remember something.
 */
import type { TextStyle } from 'react-native';

/** 4pt grid. Space is the main material of this design, so the top end is generous. */
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  section: 48,
  hero: 64,
} as const;

/**
 * Magazine rule: no rounded corners anywhere. Every plane, button, sheet and photo is a
 * rectangle. The `sheet` and `pill` keys are kept (all 0) so existing components still
 * compile; new code should use `none`.
 */
export const radius = {
  none: 0,
  sheet: 0,
  pill: 0,
} as const;

export const stroke = {
  hairline: 0.5,
  base: 1,
} as const;

/** Minimum touch target 44; the primary button 52. */
export const touch = {
  min: 44,
  button: 52,
} as const;

/** Pretendard in two weights (the hierarchy comes from size and space, not weight),
 *  plus one fountain-pen script reserved for the wordmark and the day's signature. */
export const fontFamily = {
  regular: 'Pretendard-Regular',
  medium: 'Pretendard-Medium',
  script: 'MrsSaintDelafield',
  /** Magazine masthead ("JARVIS") only. */
  masthead: 'BodoniModa-Bold',
} as const;

/**
 * Type roles. Ratio ≈1.2 between UI steps (Operate surface), one display step for headlines.
 * `script` is decorative only — never used for information a person must read to act.
 */
export const type = {
  headline: { fontFamily: fontFamily.medium, fontSize: 26, lineHeight: 34, letterSpacing: -0.6 },
  display: { fontFamily: fontFamily.medium, fontSize: 30, lineHeight: 39, letterSpacing: -0.8 },
  heading: { fontFamily: fontFamily.medium, fontSize: 20, lineHeight: 28, letterSpacing: -0.4 },
  title: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 22, letterSpacing: -0.2 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 24, letterSpacing: -0.1 },
  label: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20, letterSpacing: -0.1 },
  caption: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 17, letterSpacing: 0 },
  script: { fontFamily: fontFamily.script, fontSize: 40, lineHeight: 52, letterSpacing: 0 },
  masthead: { fontFamily: fontFamily.masthead, fontSize: 26, lineHeight: 32, letterSpacing: 4 },
} as const satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;

/** One easing family, three durations. Motion only answers a person's action. */
export const motion = {
  fast: 150,
  base: 200,
  sheet: 250,
} as const;

/** Readable column widths for wide screens (web / tablet). */
export const layout = {
  readable: 600,
  wide: 1000,
} as const;
