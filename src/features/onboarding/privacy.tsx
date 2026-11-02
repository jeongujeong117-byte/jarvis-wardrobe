import { Check, ChevronLeft, Mail } from 'lucide-react-native';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Icon } from '@/ui/icon';
import { Screen, ScreenScroll } from '@/ui/screen';
import { Text } from '@/ui/text';
import { BackBar } from '@/ui/top-bar';
import { Wordmark } from '@/ui/wordmark';

const promises = [
  '무신사 주문·취소 메일만 검색해요.',
  '상품명, 옵션, 이미지 정보만 저장해요.',
  '메일 원문은 처리 후 바로 폐기해요.',
  '마이 페이지에서 언제든 연결을 끊을 수 있어요.',
];

export function PrivacyScreen({ onBack, onConnect }: { onBack: () => void; onConnect: () => void }) {
  return (
    <Screen>
      <BackBar backIcon={ChevronLeft} onBack={onBack} title="Gmail 연결" />
      <ScreenScroll>
        <View style={styles.hero}>
          <View style={styles.node}>
            <Icon icon={Mail} size={26} />
          </View>
          <View style={styles.link} />
          <View style={styles.node}>
            <Wordmark />
          </View>
        </View>

        <View style={styles.intro}>
          <Text accessibilityRole="header" variant="display">
            주문메일만 골라서{'\n'}옷장으로 가져올게요
          </Text>
          <Text tone="secondary" variant="body">
            로그인과 메일 연결은 별도예요. 연결하기 전에 어떤 정보를 사용하는지 확인하세요.
          </Text>
        </View>

        <View style={styles.list}>
          <Card>
            <View style={styles.rows}>
              {promises.map((text) => (
                <View key={text} style={styles.row}>
                  <Icon icon={Check} size={20} tone="accent" />
                  <Text style={styles.rowText} variant="body">
                    {text}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={styles.notice}>
          <Text tone="secondary" variant="caption">
            이번 버전에서는 실제 Gmail 권한 대신 샘플 주문메일로 연결 흐름을 시연합니다.
          </Text>
        </View>
      </ScreenScroll>
      <View style={styles.footer}>
        <Button label="Gmail 연결 데모 시작" onPress={onConnect} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.space.section,
  },
  node: {
    minWidth: 64,
    height: 64,
    paddingHorizontal: theme.space.lg,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: { width: 40, height: theme.stroke.emphasis, backgroundColor: theme.colors.borderStructural },
  intro: { gap: theme.space.md },
  list: { marginTop: theme.space.xxl },
  rows: { gap: theme.space.lg },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.space.md },
  rowText: { flex: 1 },
  notice: {
    marginTop: theme.space.lg,
    paddingLeft: theme.space.md,
    borderLeftWidth: theme.stroke.structural,
    borderLeftColor: theme.colors.accent,
  },
  footer: {
    width: '100%',
    maxWidth: theme.layout.readable,
    alignSelf: 'center',
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.md,
    paddingBottom: theme.space.lg,
  },
}));
