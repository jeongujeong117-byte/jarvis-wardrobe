/**
 * Paper and night. Follows the OS light/dark setting.
 * Every text/surface pair is verified by tools/design/theme_check.py (2 × 14 pairs, all WCAG AA).
 * Change a value here → rerun it.
 *
 * The UI itself has almost no color: paper, blue-black ink, and one vermilion seal
 * (the wordmark's stamp, and destructive actions). The garments bring all the color.
 */
import { layout, motion, radius, space, stroke, touch, type } from './tokens';

type Palette = {
  surfaceBase: string;
  /** Pressed rows, input wells */
  surfaceSunken: string;
  /** Sheets */
  surfaceRaised: string;
  /** Ink — text and every pen line */
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  /** Decorative separators only (list rules, tab bar edge) */
  borderDivider: string;
  /** Boundaries of things you can press or type into (≥3:1) */
  borderInteractive: string;
  /** The single primary action per screen */
  accent: string;
  onAccent: string;
  /** Vermilion seal: the wordmark stamp and destructive text (≥4.5:1) */
  seal: string;
  inverse: string;
  onInverse: string;
  scrim: string;
};

const shared = { space, radius, stroke, touch, type, motion, layout } as const;

const makeTheme = <N extends string>(name: N, isDark: boolean, colors: Palette) =>
  ({ name, isDark, colors, ...shared }) as const;

export const lightTheme = makeTheme('light', false, {
  surfaceBase: '#EFEBE5',
  surfaceSunken: '#E2DCD3',
  surfaceRaised: '#FBFAF8',
  textPrimary: '#161514',
  textSecondary: '#5C5852',
  textTertiary: '#6B665F',
  borderDivider: '#E2DCD3',
  borderInteractive: '#8A847B',
  accent: '#161514',
  onAccent: '#F6F3EE',
  seal: '#7A1E2B',
  inverse: '#161514',
  onInverse: '#F6F3EE',
  scrim: 'rgba(22,21,20,0.40)',
});

export const darkTheme = makeTheme('dark', true, {
  surfaceBase: '#12110F',
  surfaceSunken: '#0A0A09',
  surfaceRaised: '#1C1B19',
  textPrimary: '#F3F1EC',
  textSecondary: '#A9A59E',
  textTertiary: '#9A968F',
  borderDivider: '#1C1B19',
  borderInteractive: '#6E6A63',
  accent: '#F3F1EC',
  onAccent: '#12110F',
  seal: '#E8998C',
  inverse: '#F3F1EC',
  onInverse: '#12110F',
  scrim: 'rgba(5,5,4,0.6)',
});

export const appThemes = { light: lightTheme, dark: darkTheme } as const;

export type AppThemes = typeof appThemes;
export type AppThemeName = keyof AppThemes;
export type AppTheme = AppThemes[AppThemeName];

/** Closet grid: 2 / 3 / 4 columns. First must be 0. */
export const breakpoints = { xs: 0, sm: 600, md: 900 } as const;

export type AppBreakpoints = typeof breakpoints;
