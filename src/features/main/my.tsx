import { Check, ChevronRight, Database, Mail, MapPin, MonitorSmartphone } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  loadThemePreference,
  saveThemePreference,
  type ThemePreference,
} from '@/design/theme-preference';
import { appThemes, themeOrder } from '@/design/themes';
import { Card } from '@/ui/card';
import { Icon } from '@/ui/icon';
import { ListGroup, ListRow } from '@/ui/list';
import { ScreenScroll } from '@/ui/screen';
import { Text } from '@/ui/text';
import { TopBar } from '@/ui/top-bar';
import { Wordmark } from '@/ui/wordmark';

import type { DataStatus } from '../types';

export function MyScreen({
  dataStatus,
  itemCount,
  onAuthPress,
  onSignOut,
  wearCount,
}: {
  dataStatus: DataStatus;
  itemCount: number;
  onAuthPress: () => void;
  onSignOut: () => void;
  wearCount: number;
}) {
  const dataStatusText = {
    demo: '환경 변수 설정 필요',
    'auth-needed': '연결됨 · 로그인 필요',
    connected: '로그인됨 · 실제 DB 사용 중',
  }[dataStatus];

  const chevron = <Icon icon={ChevronRight} size={20} tone="tertiary" />;
  const privacyRows = [
    '메일 처리 방식 보기',
    '내 데이터 내려받기',
    dataStatus === 'connected' ? '로그아웃' : 'Gmail 연결 해제',
  ];

  return (
    <>
      <TopBar leading={<Wordmark />} />
      <ScreenScroll>
        <Text accessibilityRole="header" style={styles.title} variant="display">
          나의 옷장
        </Text>

        <View style={styles.stats}>
          <Card>
            <View style={styles.statRow}>
              <Stat label="옷" unit="벌" value={itemCount} />
              <View style={styles.statDivider} />
              <Stat label="착용 기록" unit="회" value={wearCount} />
            </View>
          </Card>
        </View>

        <ThemePicker />

        <ListGroup title="연결">
          <ListRow
            description={dataStatusText}
            icon={Database}
            onPress={onAuthPress}
            title="Supabase 데이터"
            trailing={
              dataStatus === 'connected' ? <Icon icon={Check} size={20} tone="accent" /> : chevron
            }
          />
          <ListRow
            description={itemCount > 0 ? '연결됨 · 데모 모드' : '연결되지 않음'}
            icon={Mail}
            title="Gmail 주문메일"
          />
          <ListRow description="서울 · 샘플 날씨" icon={MapPin} title="날씨 지역" />
        </ListGroup>

        <ListGroup title="데이터와 개인정보">
          {privacyRows.map((label) => {
            const danger = label.includes('해제') || label === '로그아웃';
            return (
              <ListRow
                key={label}
                onPress={() => {
                  if (label === '로그아웃') {
                    onSignOut();
                    return;
                  }
                  Alert.alert('프로토타입', `${label} 기능은 실제 백엔드 연결 단계에서 구현합니다.`);
                }}
                title={label}
                titleTone={danger ? 'accent' : 'primary'}
                trailing={chevron}
              />
            );
          })}
        </ListGroup>

        <Text style={styles.build} tone="tertiary" variant="caption">
          현재 개발 상태 · DB 스키마 · 보안 정책 · 이메일 로그인 · 실제 저장 코드 완료
        </Text>
      </ScreenScroll>
    </>
  );
}

function Stat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <View accessibilityLabel={`${label} ${value}${unit}`} accessible style={styles.stat}>
      <Text tone="secondary" variant="label">
        {label}
      </Text>
      <View style={styles.countRow}>
        <Text variant="numeral">{value}</Text>
        <Text variant="heading">{unit}</Text>
      </View>
    </View>
  );
}

/** Clutter's "꾸미는 재미": pick the frame color. Each swatch is a tiny Mondrian of that theme. */
function ThemePicker() {
  const [preference, setPreference] = useState<ThemePreference>('system');
  useEffect(() => {
    loadThemePreference().then(setPreference);
  }, []);

  const choose = (next: ThemePreference) => {
    setPreference(next);
    saveThemePreference(next);
  };

  return (
    <View style={styles.themeSection}>
      <Text accessibilityRole="header" style={styles.themeTitle} tone="secondary" variant="label">
        테마
      </Text>
      <View accessibilityRole="radiogroup" style={styles.themeRow}>
        <Pressable
          accessibilityLabel="시스템 설정 따르기"
          accessibilityRole="radio"
          accessibilityState={{ checked: preference === 'system' }}
          onPress={() => choose('system')}
          style={styles.themeOption}>
          <View style={[styles.swatch, styles.swatchSystem, preference === 'system' && styles.swatchSelected]}>
            <Icon icon={MonitorSmartphone} size={22} />
          </View>
          <Text tone={preference === 'system' ? 'primary' : 'secondary'} variant="caption">
            자동
          </Text>
        </Pressable>
        {themeOrder.map((name) => {
          const t = appThemes[name];
          const selected = preference === name;
          return (
            <Pressable
              accessibilityLabel={`${t.label} 테마`}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              key={name}
              onPress={() => choose(name)}
              style={styles.themeOption}>
              <View
                style={[
                  styles.swatch,
                  { backgroundColor: t.colors.borderStructural },
                  selected && styles.swatchSelected,
                ]}>
                <View style={[styles.swatchMain, { backgroundColor: t.colors.surfaceBase }]} />
                <View style={styles.swatchSide}>
                  <View style={[styles.swatchCell, { backgroundColor: t.colors.accent }]} />
                  <View style={[styles.swatchCell, { backgroundColor: t.colors.surfaceRaised }]} />
                </View>
              </View>
              <Text tone={selected ? 'primary' : 'secondary'} variant="caption">
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const SWATCH = 52;

const styles = StyleSheet.create((theme) => ({
  title: { paddingTop: theme.space.md },
  stats: { marginTop: theme.space.xl },
  statRow: { flexDirection: 'row', alignItems: 'stretch' },
  stat: { flex: 1, gap: theme.space.xs },
  statDivider: {
    width: theme.stroke.emphasis,
    backgroundColor: theme.colors.borderStructural,
    marginHorizontal: theme.space.xl,
  },
  countRow: { flexDirection: 'row', alignItems: 'baseline', gap: theme.space.xs },
  themeSection: { marginTop: theme.space.section, gap: theme.space.md },
  themeTitle: { paddingHorizontal: theme.space.xs },
  themeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.lg },
  themeOption: { alignItems: 'center', gap: theme.space.xs, minWidth: theme.touch.min },
  swatch: {
    width: SWATCH,
    height: SWATCH,
    flexDirection: 'row',
    gap: 2,
    padding: 2,
    borderRadius: theme.radius.none,
  },
  swatchSystem: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: theme.stroke.base,
    borderColor: theme.colors.borderInteractive,
  },
  swatchSelected: {
    outlineWidth: theme.stroke.emphasis,
    outlineColor: theme.colors.accent,
    outlineOffset: 3,
    outlineStyle: 'solid',
  },
  swatchMain: { flex: 2 },
  swatchSide: { flex: 1, gap: 2 },
  swatchCell: { flex: 1 },
  build: { marginTop: theme.space.section, paddingHorizontal: theme.space.xs },
}));
