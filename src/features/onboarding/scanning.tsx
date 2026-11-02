import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import { PenDrawing } from '@/ui/pen/pen-drawing';
import { Column, Screen } from '@/ui/screen';
import { Text } from '@/ui/text';

/** Matches the shell's 1700ms scanning timer, so the line is drawn exactly once. */
const SCAN_MS = 1700;

const steps = [
  { label: 'Gmail 연결 확인', done: true },
  { label: '무신사 메일 고르기', done: true },
  { label: '상품 정보 정리하는 중', done: false },
];

export function ScanningScreen() {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: SCAN_MS, easing: Easing.out(Easing.cubic) });
  }, [progress]);
  const fill = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <Screen>
      <Column>
        <View style={styles.center}>
          <Text accessibilityLiveRegion="polite" accessibilityRole="header" variant="display">
            주문메일을{'\n'}찾고 있어요.
          </Text>
          <Text tone="secondary" variant="body">
            최근 1년의 무신사 주문·취소 메일만 확인해요.
          </Text>
          <View accessibilityLabel="주문메일 찾는 중" accessibilityRole="progressbar" style={styles.track}>
            <Animated.View style={[styles.fill, fill]} />
          </View>
          <View style={styles.steps}>
            {steps.map((step) => (
              <View key={step.label} style={styles.step}>
                <View style={styles.mark}>{step.done ? <PenDrawing name="tick" size={20} /> : null}</View>
                <Text tone={step.done ? 'secondary' : 'primary'} variant={step.done ? 'body' : 'title'}>
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Column>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: theme.space.xl, gap: theme.space.md },
  track: {
    height: 2,
    marginTop: theme.space.xxl,
    backgroundColor: theme.colors.borderDivider,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: theme.colors.textPrimary },
  steps: { gap: theme.space.md, marginTop: theme.space.lg },
  step: { flexDirection: 'row', alignItems: 'center', gap: theme.space.md, minHeight: 28 },
  mark: { width: 20, height: 20 },
}));
