/**
 * Unistyles bootstrap. Imported once from the app entry (index.ts) and from
 * src/app/+html.tsx for static web rendering — before any StyleSheet.create runs.
 */
import { StyleSheet } from 'react-native-unistyles';

import { appThemes, breakpoints, type AppBreakpoints, type AppThemes } from './themes';

declare module 'react-native-unistyles' {
  // Module augmentation must use empty interfaces that extend our types.
  /* eslint-disable @typescript-eslint/no-empty-object-type */
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  /* eslint-enable @typescript-eslint/no-empty-object-type */
}

StyleSheet.configure({
  themes: appThemes,
  breakpoints,
  settings: {
    // Paper by day, night by night — follows the OS setting.
    adaptiveThemes: true,
  },
});
