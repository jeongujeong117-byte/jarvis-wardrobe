import { ChevronLeft } from 'lucide-react-native';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { ClothingItem } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { GarmentPlate } from '@/ui/pen/garment-plate';
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
            주문 화면을 찍으면{'\n'}옷을 찾아드려요.
          </Text>
          <Text tone="secondary" variant="body">
            상품명과 옵션이 보이게 캡처해주세요.
          </Text>
        </View>

        <View style={styles.preview}>
          <View style={styles.thumb}>
            <GarmentPlate id="capture" item={item} />
          </View>
          <View style={styles.skeleton}>
            <View style={[styles.line, styles.lineLong]} />
            <View style={[styles.line, styles.lineMid]} />
            <View style={[styles.line, styles.lineShort]} />
          </View>
        </View>

        <View style={styles.result}>
          <Text tone="secondary" variant="label">
            찾은 옷 (데모)
          </Text>
          <Text variant="heading">{item.name}</Text>
          <Text tone="secondary" variant="body">
            {item.category}, {item.detail}
          </Text>
        </View>
      </ScreenScroll>
      <View style={styles.footer}>
        <Button block label="이 옷을 옷장에 담기" onPress={onAdd} />
        <Button label="다른 캡처 고르기" onPress={onPickOther} variant="text" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  intro: { gap: theme.space.md },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.xl,
    marginTop: theme.space.section,
  },
  thumb: { width: 120 },
  skeleton: { flex: 1, gap: theme.space.md },
  line: { height: theme.stroke.base, backgroundColor: theme.colors.borderInteractive },
  lineLong: { width: '90%' },
  lineMid: { width: '62%' },
  lineShort: { width: '38%' },
  result: { gap: theme.space.xs, marginTop: theme.space.section },
  footer: {
    width: '100%',
    maxWidth: theme.layout.readable,
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.md,
    paddingBottom: theme.space.sm,
    gap: theme.space.xs,
  },
}));
