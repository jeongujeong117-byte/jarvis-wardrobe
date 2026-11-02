import { Check } from 'lucide-react-native';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import { Icon } from '@/ui/icon';
import { Column, Screen } from '@/ui/screen';
import { Text } from '@/ui/text';

/** Duration matches the shell's 1700ms scanning timer, so the bar fills exactly once. */
const SCAN_MS = 1700;

const steps = [
  { label: 'Gmail 연결 확인', done: true },
  { label: '무신사 메일 필터링', done: true },
  { label: '상품 정보 정리 중', done: false },
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
          <Text tone="secondary" variant="label">
            최근 1년 · 무신사 주문·취소 메일만
          </Text>
          <Text accessibilityLiveRegion="polite" accessibilityRole="header" variant="display">
            주문메일을{'\n'}찾고 있어요
          </Text>
          <View
            accessibilityLabel="주문메일 검색 진행 중"
            accessibilityRole="progressbar"
            style={styles.track}>
            <Animated.View style={[styles.fill, fill]} />
          </View>
          <View style={styles.steps}>
            {steps.map((step) => (
              <View key={step.label} style={styles.step}>
                {step.done ? (
                  <Icon icon={Check} size={18} tone="secondary" />
                ) : (
                  <View style={styles.current} />
                )}
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
    height: theme.space.sm,
    marginTop: theme.space.xxl,
    backgroundColor: theme.colors.surfaceRaised,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: theme.colors.accent },
  steps: { gap: theme.space.md, marginTop: theme.space.lg },
  step: { flexDirection: 'row', alignItems: 'center', gap: theme.space.md, minHeight: 24 },
  current: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: theme.stroke.emphasis,
    borderColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
  },
}));
