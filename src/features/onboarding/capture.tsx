import { ChevronLeft, ScanLine } from 'lucide-react-native';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { ClothingItem } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { GarmentField } from '@/ui/garment/garment-field';
import { Icon } from '@/ui/icon';
import { Screen, ScreenScroll } from '@/ui/screen';
import { Text } from '@/ui/text';
import { BackBar } from '@/ui/top-bar';

export function CaptureScreen({
  item,
  onBack,
  onAdd,
  onPickOther,
}: {
  item: ClothingItem;
  onBack: () => void;
  onAdd: () => void;
  onPickOther: () => void;
}) {
  return (
    <Screen>
      <BackBar backIcon={ChevronLeft} onBack={onBack} title="캡처로 가져오기" />
      <ScreenScroll>
        <View style={styles.intro}>
          <Text accessibilityRole="header" variant="display">
            주문내역을 캡처하면{'\n'}옷을 찾아드려요
          </Text>
          <Text tone="secondary" variant="body">
            상품명과 옵션이 보이도록 주문 화면을 캡처해주세요.
          </Text>
        </View>

        <View style={styles.preview}>
          <Card>
            <View style={styles.order}>
              <View style={styles.orderThumb}>
                <GarmentField glyphSize={32} item={item} />
              </View>
              <View style={styles.skeleton}>
                <View style={[styles.line, styles.lineLong]} />
                <View style={[styles.line, styles.lineMid]} />
                <View style={[styles.line, styles.lineShort]} />
              </View>
            </View>
            <View style={styles.scanTag}>
              <Icon icon={ScanLine} size={16} tone="accent" />
              <Text tone="accent" variant="label">
                상품 영역 자동 인식
              </Text>
            </View>
          </Card>
        </View>

        <View style={styles.result}>
          <Text tone="secondary" variant="label">
            인식 결과 (데모)
          </Text>
          <Text variant="heading">{item.name}</Text>
          <Text tone="secondary" variant="body">
            {item.category} · {item.detail}
          </Text>
        </View>
      </ScreenScroll>
      <View style={styles.footer}>
        <Button label="이 상품 옷장에 담기" onPress={onAdd} />
        <Button label="다른 캡처 선택" onPress={onPickOther} variant="ghost" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  intro: { gap: theme.space.md, paddingTop: theme.space.lg },
  preview: { marginTop: theme.space.xxl },
  order: { flexDirection: 'row', gap: theme.space.lg, alignItems: 'center' },
  orderThumb: { width: 88 },
  skeleton: { flex: 1, gap: theme.space.sm },
  line: { height: 10, borderRadius: theme.radius.sm, backgroundColor: theme.colors.borderDivider },
  lineLong: { width: '90%' },
  lineMid: { width: '65%' },
  lineShort: { width: '40%' },
  scanTag: { flexDirection: 'row', alignItems: 'center', gap: theme.space.xs, marginTop: theme.space.lg },
  result: { gap: theme.space.xs, marginTop: theme.space.xxl },
  footer: {
    width: '100%',
    maxWidth: theme.layout.readable,
    alignSelf: 'center',
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.md,
    paddingBottom: theme.space.sm,
    gap: theme.space.xs,
  },
}));
