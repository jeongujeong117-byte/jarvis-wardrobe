import { Camera, ChevronLeft, ChevronRight, Info, Mail, PenLine } from 'lucide-react-native';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Icon } from '@/ui/icon';
import { ListGroup, ListRow } from '@/ui/list';
import { Screen, ScreenScroll } from '@/ui/screen';
import { Text } from '@/ui/text';
import { BackBar } from '@/ui/top-bar';

export function ImportScreen({
  onBack,
  onGmail,
  onCapture,
  onManual,
}: {
  onBack: () => void;
  onGmail: () => void;
  onCapture: () => void;
  onManual: () => void;
}) {
  const chevron = <Icon icon={ChevronRight} size={20} tone="tertiary" />;
  return (
    <Screen>
      <BackBar backIcon={ChevronLeft} onBack={onBack} title="옷 가져오기" />
      <ScreenScroll>
        <View style={styles.intro}>
          <Text tone="secondary" variant="label">
            1단계 · 옷장 채우기
          </Text>
          <Text accessibilityRole="header" variant="display">
            내 옷장을{'\n'}어떻게 채울까요?
          </Text>
          <Text tone="secondary" variant="body">
            가장 편한 방법을 고르세요. 나중에 다른 방법으로 더할 수 있어요.
          </Text>
        </View>

        <ListGroup>
          <ListRow
            description="무신사 주문메일을 찾아 자동으로 가져와요 · 추천"
            icon={Mail}
            onPress={onGmail}
            title="Gmail 연결하기"
            trailing={chevron}
          />
          <ListRow
            description="주문 화면을 캡처해서 빠르게 등록해요"
            icon={Camera}
            onPress={onCapture}
            title="주문내역 캡처하기"
            trailing={chevron}
          />
          <ListRow
            description="상품명과 카테고리만 간단히 입력해요"
            icon={PenLine}
            onPress={onManual}
            title="직접 등록하기"
            trailing={chevron}
          />
        </ListGroup>

        <View style={styles.note}>
          <Icon icon={Info} size={18} tone="secondary" />
          <Text style={styles.noteText} tone="secondary" variant="caption">
            Gmail 연결을 건너뛰어도 앱의 모든 기능을 이용할 수 있어요.
          </Text>
        </View>
      </ScreenScroll>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  intro: { gap: theme.space.md, paddingTop: theme.space.lg },
  note: { flexDirection: 'row', gap: theme.space.sm, marginTop: theme.space.xxl, paddingHorizontal: theme.space.xs },
  noteText: { flex: 1 },
}));
