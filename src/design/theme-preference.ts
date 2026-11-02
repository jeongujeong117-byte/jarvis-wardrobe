/**
 * Persists the user's theme choice. 'system' = follow OS light/dark.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UnistylesRuntime } from 'react-native-unistyles';

import type { AppThemeName } from './themes';

export type ThemePreference = 'system' | AppThemeName;

const KEY = 'jarvis.theme-preference';
const VALID: ThemePreference[] = ['system', 'light', 'dark', 'cream', 'olive'];

export function applyThemePreference(preference: ThemePreference) {
  if (preference === 'system') {
    UnistylesRuntime.setAdaptiveThemes(true);
    return;
  }
  UnistylesRuntime.setAdaptiveThemes(false);
  UnistylesRuntime.setTheme(preference);
}

export async function loadThemePreference(): Promise<ThemePreference> {
  try {
    const stored = await AsyncStorage.getItem(KEY);
    return VALID.includes(stored as ThemePreference) ? (stored as ThemePreference) : 'system';
  } catch {
    return 'system';
  }
}

export async function saveThemePreference(preference: ThemePreference) {
  applyThemePreference(preference);
  try {
    await AsyncStorage.setItem(KEY, preference);
  } catch {
    // Storage unavailable (private browsing, etc.): the choice still applies for this session.
  }
}
