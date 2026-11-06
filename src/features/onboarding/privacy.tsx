import { ChevronLeft } from 'lucide-react-native';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/ui/button';
import { PenDrawing } from '@/ui/pen/pen-drawing';
import { Screen, ScreenScroll } from '@/ui/screen';
import { Text } from '@/ui/text';
import { BackBar } from '@/ui/top-bar';

const promises = [
  '무신사 주문·취소 메일만 찾아요.',
  '상품명, 옵션, 이미지만 저장해요.',
  '메일 원문은 처리한 뒤 바로 지워요.',
  '마이 탭에서 언제든 연결을 끊을 수 있어요.',
];

export function PrivacyScreen({ onBack, onConnect }: { onBack: () => void; onConnect: () => void }) {
  return (
    <Screen>
      <BackBar backIcon={ChevronLeft} onBack={onBack} title="Gmail 연결" />
      <ScreenScroll>
        <View style={styles.intro}>
          <Text accessibilityRole="header" variant="display">
            주문메일만 골라서{'\n'}옷장으로 가져올게요.
          </Text>
          <Text tone="secondary" variant="body">
            로그인과 메일 연결은 따로예요. 연결하기 전에 무엇을 쓰는지 확인하세요.
          </Text>
        </View>

        <View style={styles.list}>
          {promises.map((text) => (
            <View key={text} style={styles.row}>
              <PenDrawing name="tick" size={22} />
              <Text style={styles.rowText} variant="body">
                {text}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.notice} tone="tertiary" variant="caption">
          지금 버전은 실제 Gmail 권한 대신 샘플 주문메일로 흐름을 보여드려요.
        </Text>
      </ScreenScroll>
      <View style={styles.footer}>
        <Button block label="Gmail 연결 데모 시작" onPress={onConnect} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  intro: { gap: theme.space.md },
  list: { marginTop: theme.space.section, gap: theme.space.lg },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.space.md },
  rowText: { flex: 1 },
  notice: { marginTop: theme.space.xxl },
  footer: {
    width: '100%',
    maxWidth: theme.layout.readable,
    alignSelf: 'center',
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.md,
    paddingBottom: theme.space.lg,
  },
}));
