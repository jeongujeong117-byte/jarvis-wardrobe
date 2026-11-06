import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';

type Width = 'readable' | 'wide';

/** Safe-area-aware page. Reads insets from Unistyles' runtime — no hand-tuned marginTop. */
export function Screen({
  children,
  bottomInset = true,
}: {
  children: ReactNode;
  /** false when a tab bar below already handles the bottom inset */
  bottomInset?: boolean;
}) {
  styles.useVariants({ bottomInset });
  return <View style={styles.root}>{children}</View>;
}

/** Centered column that caps line length on tablets / web. */
export function Column({ children, width = 'readable' }: { children: ReactNode; width?: Width }) {
  styles.useVariants({ width });
  return <View style={styles.column}>{children}</View>;
}

const UniScrollView = withUnistyles(ScrollView);

/** Vertical scroller with the standard screen gutter. */
export function ScreenScroll({ children, width = 'readable' }: { children: ReactNode; width?: Width }) {
  styles.useVariants({ width });
  return (
    <UniScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.scroll}>
      {children}
    </UniScrollView>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.surfaceBase,
    paddingTop: rt.insets.top,
    variants: {
      bottomInset: {
        true: { paddingBottom: rt.insets.bottom },
        false: {},
      },
    },
  },
  column: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    variants: {
      width: {
        readable: { maxWidth: theme.layout.readable },
        wide: { maxWidth: theme.layout.wide },
      },
    },
  },
  scroll: { flex: 1 },
  scrollContent: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.lg,
    paddingBottom: theme.space.hero,
    variants: {
      width: {
        readable: { maxWidth: theme.layout.readable },
        wide: { maxWidth: theme.layout.wide },
      },
    },
  },
}));
