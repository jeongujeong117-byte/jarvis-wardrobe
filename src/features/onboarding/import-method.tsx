import { ChevronLeft, ChevronRight } from 'lucide-react-native';
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
          <Text accessibilityRole="header" variant="display">
            옷장을 어떻게{'\n'}채울까요?
          </Text>
          <Text tone="secondary" variant="body">
            편한 방법으로 시작하세요. 다른 방법은 나중에 더해도 돼요.
          </Text>
        </View>
        <ListGroup>
          <ListRow
            description="무신사 주문메일에서 산 옷을 찾아 가져와요. 가장 빨라요."
            onPress={onGmail}
            title="Gmail에서 가져오기"
            trailing={chevron}
          />
          <ListRow
            description="주문 내역 화면을 캡처해 등록해요."
            onPress={onCapture}
            title="주문 캡처로 가져오기"
            trailing={chevron}
          />
          <ListRow
            description="이름과 종류, 색만 적으면 돼요."
            onPress={onManual}
            title="직접 적기"
            trailing={chevron}
          />
        </ListGroup>
        <Text style={styles.note} tone="tertiary" variant="caption">
          Gmail을 연결하지 않아도 모든 기능을 쓸 수 있어요.
        </Text>
      </ScreenScroll>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  intro: { gap: theme.space.md },
  note: { marginTop: theme.space.xl },
}));
