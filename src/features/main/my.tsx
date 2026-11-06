import { ChevronRight } from 'lucide-react-native';
import { Alert, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Icon } from '@/ui/icon';
import { ListGroup, ListRow } from '@/ui/list';
import { PenDrawing } from '@/ui/pen/pen-drawing';
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
    demo: '환경 변수를 설정해야 해요',
    'auth-needed': '연결됨, 로그인이 필요해요',
    connected: '로그인됨, 실제 데이터를 쓰는 중',
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
        <Text accessibilityRole="header" variant="display">
          나의 옷장
        </Text>
        <Text style={styles.summary} tone="secondary" variant="body">
          옷 {itemCount}벌을 보관하고 있고, 이번 주에 {wearCount}번 입었어요.
        </Text>

        <ListGroup title="연결">
          <ListRow
            description={dataStatusText}
            onPress={onAuthPress}
            title="Supabase 데이터"
            trailing={dataStatus === 'connected' ? <PenDrawing name="tick" size={22} /> : chevron}
          />
          <ListRow
            description={itemCount > 0 ? '데모로 연결됨' : '연결되지 않음'}
            title="Gmail 주문메일"
          />
          <ListRow description="서울, 샘플 날씨" title="날씨 지역" />
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
                titleTone={danger ? 'seal' : 'primary'}
                trailing={chevron}
              />
            );
          })}
        </ListGroup>

        <View style={styles.build}>
          <Text tone="tertiary" variant="caption">
            지금까지 만든 것: DB 스키마, 보안 정책, 이메일 로그인, 실제 저장 코드.
          </Text>
        </View>
      </ScreenScroll>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  summary: { marginTop: theme.space.md },
  build: { marginTop: theme.space.section },
}));
