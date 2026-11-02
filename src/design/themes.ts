/**
 * Four user-selectable themes (Clutter's "꾸미는 재미", brief 10-4).
 * Every text/surface/accent pair is verified by tools/design/theme_check.py
 * (4 themes × 13 pairs = 52 checks, all ≥ WCAG AA). Change a value here → rerun it.
 *
 * Garment colors are NOT part of any theme. A theme only changes the frame around the clothes.
 */
import { motion, radius, space, stroke, touch, type, layout } from './tokens';

type Palette = {
  /** Screen background */
  surfaceBase: string;
  /** Recessed areas (closet grid backdrop) */
  surfaceSunken: string;
  /** Cards, sheets */
  surfaceRaised: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  /** Decorative separators only — never the boundary of an interactive element (non-text ≥3:1 not required) */
  borderDivider: string;
  /** Boundaries of inputs / selectable things (≥3:1) */
  borderInteractive: string;
  /** Mondrian's black line — the structural grid between garment blocks */
  borderStructural: string;
  /** The single signal color: "you can press this now" */
  accent: string;
  onAccent: string;
  /** Accent used as text on surfaceBase (≥4.5:1) */
  accentText: string;
  /** Inverted surface for toasts and the active tab */
  inverse: string;
  onInverse: string;
  /** Scrim behind sheets */
  scrim: string;
};

const shared = { space, radius, stroke, touch, type, motion, layout } as const;

const makeTheme = <N extends string>(name: N, label: string, isDark: boolean, colors: Palette) =>
  ({ name, label, isDark, colors, ...shared }) as const;

export const lightTheme = makeTheme('light', '화이트', false, {
  surfaceBase: '#FFFFFF',
  surfaceSunken: '#F2F2F0',
  surfaceRaised: '#F2F2F0',
  textPrimary: '#111111',
  textSecondary: '#555555',
  textTertiary: '#6B6B6B',
  borderDivider: '#E2E2E0',
  borderInteractive: '#8A8A8A',
  borderStructural: '#111111',
  accent: '#D7141A',
  onAccent: '#FFFFFF',
  accentText: '#C8102E',
  inverse: '#111111',
  onInverse: '#FFFFFF',
  scrim: 'rgba(17,17,17,0.4)',
});

export const darkTheme = makeTheme('dark', '블랙', true, {
  surfaceBase: '#0E0E0E',
  surfaceSunken: '#000000',
  surfaceRaised: '#1C1C1C',
  textPrimary: '#F5F5F5',
  textSecondary: '#ADADAD',
  textTertiary: '#949494',
  borderDivider: '#2A2A2A',
  borderInteractive: '#6E6E6E',
  borderStructural: '#F5F5F5',
  accent: '#FF4D4F',
  onAccent: '#111111',
  accentText: '#FF6B6B',
  inverse: '#F5F5F5',
  onInverse: '#111111',
  scrim: 'rgba(0,0,0,0.6)',
});

export const creamTheme = makeTheme('cream', '크림', false, {
  surfaceBase: '#F5EEDC',
  surfaceSunken: '#EBE1C9',
  surfaceRaised: '#EBE1C9',
  textPrimary: '#1C1814',
  textSecondary: '#5A5145',
  textTertiary: '#6A6052',
  borderDivider: '#DDD2B8',
  borderInteractive: '#857A69',
  borderStructural: '#1C1814',
  accent: '#C8102E',
  onAccent: '#FFFFFF',
  accentText: '#B00E28',
  inverse: '#1C1814',
  onInverse: '#F5EEDC',
  scrim: 'rgba(28,24,20,0.4)',
});

export const oliveTheme = makeTheme('olive', '올리브', true, {
  surfaceBase: '#4A4834',
  surfaceSunken: '#3C3A29',
  surfaceRaised: '#5B5940',
  textPrimary: '#F6F1E1',
  textSecondary: '#DCD6BF',
  textTertiary: '#DAD3BA',
  borderDivider: '#615F47',
  borderInteractive: '#B3AD93',
  borderStructural: '#F6F1E1',
  accent: '#A8DCCB',
  onAccent: '#17241F',
  accentText: '#B8E6D6',
  inverse: '#F6F1E1',
  onInverse: '#2E2C1F',
  scrim: 'rgba(20,19,12,0.55)',
});

export const appThemes = {
  light: lightTheme,
  dark: darkTheme,
  cream: creamTheme,
  olive: oliveTheme,
} as const;

export type AppThemes = typeof appThemes;
export type AppThemeName = keyof AppThemes;
export type AppTheme = AppThemes[AppThemeName];

/** Order shown in the theme picker. */
export const themeOrder: AppThemeName[] = ['light', 'cream', 'olive', 'dark'];

/** Breakpoints for the closet grid (brief 3-3): 2 / 3 / 4 columns. First must be 0. */
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
} as const;

export type AppBreakpoints = typeof breakpoints;
