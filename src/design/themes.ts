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
  surfaceBase: '#FBFBF9',
  surfaceSunken: '#F1F2F4',
  surfaceRaised: '#FFFFFF',
  textPrimary: '#1F2A44',
  textSecondary: '#5D6577',
  textTertiary: '#666E80',
  borderDivider: '#E3E5EA',
  borderInteractive: '#8A91A1',
  accent: '#1F2A44',
  onAccent: '#FBFBF9',
  seal: '#C2412D',
  inverse: '#1F2A44',
  onInverse: '#FBFBF9',
  scrim: 'rgba(31,42,68,0.35)',
});

export const darkTheme = makeTheme('dark', true, {
  surfaceBase: '#121725',
  surfaceSunken: '#0C101A',
  surfaceRaised: '#1A2030',
  textPrimary: '#ECEEF2',
  textSecondary: '#A6ADBB',
  textTertiary: '#959CAB',
  borderDivider: '#262D3D',
  borderInteractive: '#687083',
  accent: '#ECEEF2',
  onAccent: '#121725',
  seal: '#F08A74',
  inverse: '#ECEEF2',
  onInverse: '#121725',
  scrim: 'rgba(5,8,14,0.6)',
});

export const appThemes = { light: lightTheme, dark: darkTheme } as const;

export type AppThemes = typeof appThemes;
export type AppThemeName = keyof AppThemes;
export type AppTheme = AppThemes[AppThemeName];

/** Closet grid: 2 / 3 / 4 columns. First must be 0. */
export const breakpoints = { xs: 0, sm: 600, md: 900 } as const;

export type AppBreakpoints = typeof breakpoints;
