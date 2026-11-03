import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { type PhotoMode, photoModes } from '@/data/photos';
import type { ClothingItem } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { Icon } from '@/ui/icon';
import { Sheet } from '@/ui/sheet';
import { Text } from '@/ui/text';
import { TopBar } from '@/ui/top-bar';
import { Wordmark } from '@/ui/wordmark';

import { ItemInfoSheet } from './item-info-sheet';
import { OutfitStage } from './outfit-stage';

const occasions = ['일상', '출근', '약속', '운동'];

export function TodayScreen({
  items,
  outfitIndex,
  onOtherOutfit,
  tpo,
  setTpo,
  worn,
  onWear,
  onUnwear,
  onImport,
  onOpenCloset,
  onOpenItem,
}: {
  items: ClothingItem[];
  outfitIndex: number;
  onOtherOutfit: () => void;
  tpo: string;
  setTpo: (value: string) => void;
  worn: boolean;
  onWear: () => void;
  onUnwear: () => void;
  onImport: () => void;
  onOpenCloset: () => void;
  onOpenItem: (id: string) => void;
}) {
  const [mode, setMode] = useState<PhotoMode>('flatlay');
  const [showOccasions, setShowOccasions] = useState(false);
  const [pickedItem, setPickedItem] = useState<ClothingItem | null>(null);

  // Selection rules unchanged from the prototype.
  const tops = items.filter((item) => item.category === '상의');
  const bottoms = items.filter((item) => item.category === '하의');
  const outer = items.find((item) => item.category === '아우터');
  const shoes = items.find((item) => item.category === '신발');
  const ready = tops.length > 0 && bottoms.length > 0;
  const top = ready ? tops[outfitIndex % tops.length] : undefined;
  const bottom = ready ? bottoms[(outfitIndex + 1) % bottoms.length] : undefined;

  const modeIndex = photoModes.findIndex((entry) => entry.key === mode);
  const modeLabel = photoModes[modeIndex]?.label ?? '';
  const nextMode = photoModes[(modeIndex + 1) % photoModes.length];

  const pickMyPhoto = () =>
    Alert.alert('데모 안내', '내 사진 고르기는 PLUS 기능이에요. 실제 연결은 다음 단계에서 해요.');

  return (
    <>
      <TopBar
        leading={<Wordmark />}
        trailing={
          <Text accessibilityLabel="서울, 24도, 맑음" tone="secondary" variant="label">
            서울 24°, 맑음
          </Text>
        }
      />

      {ready && top && bottom ? (
        <View style={styles.fill}>
          <View style={styles.controls}>
            <Pressable
              accessibilityLabel={`오늘의 일정 ${tpo}, 바꾸기`}
              accessibilityRole="button"
              onPress={() => setShowOccasions(true)}
              style={styles.control}>
              <Text variant="label">{tpo}</Text>
              <Icon icon={ChevronDown} size={18} />
            </Pressable>
            <Pressable
              accessibilityLabel={`사진 보기 ${modeLabel}, ${nextMode?.label ?? ''}(으)로 넘기기`}
              accessibilityRole="button"
              onPress={() => nextMode && setMode(nextMode.key)}
              style={styles.control}>
              <Text variant="label">
                {modeLabel} · {modeIndex + 1}/{photoModes.length}
              </Text>
              <View style={styles.pips}>
                {photoModes.map((entry) => (
                  <View key={entry.key} style={[styles.pip, entry.key === mode && styles.pipOn]} />
                ))}
              </View>
            </Pressable>
          </View>

          <OutfitStage
            bottom={bottom}
            mode={mode}
            onModeChange={setMode}
            onPickItem={setPickedItem}
            onPickMyPhoto={pickMyPhoto}
            pieces={[top, bottom, outer, shoes].filter((piece): piece is ClothingItem => Boolean(piece))}
            top={top}
          />

          <Text accessibilityRole="header" numberOfLines={1} style={styles.headline} variant="heading">
            오늘은 가볍게.
          </Text>

          <View style={styles.actionBar}>
            <View style={styles.primary}>
              {worn ? (
                <Button block label="오늘 입는 중 · 취소" onPress={onUnwear} variant="quiet" />
              ) : (
                <Button block label="이 코디 입기" onPress={onWear} />
              )}
            </View>
            <Button label="다른 코디" onPress={onOtherOutfit} variant="text" />
          </View>
        </View>
      ) : (
        <View style={styles.empty}>
          <Text accessibilityRole="header" variant="display">
            코디를 만들 옷이{'\n'}아직 부족해요.
          </Text>
          <Text tone="secondary" variant="body">
            상의와 하의를 한 벌씩 더하면 바로 골라드릴게요.
          </Text>
          <View style={styles.emptyActions}>
            <Button label="옷 가져오기" onPress={onImport} />
            <Button label="옷장 보기" onPress={onOpenCloset} variant="text" />
          </View>
        </View>
      )}

      <Sheet onClose={() => setShowOccasions(false)} title="오늘의 일정" visible={showOccasions}>
        <View style={styles.options}>
          {occasions.map((value) => (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: tpo === value }}
              key={value}
              onPress={() => {
                setTpo(value);
                setShowOccasions(false);
              }}
              style={[styles.option, tpo === value && styles.optionOn]}>
              <Text tone={tpo === value ? 'onAccent' : 'primary'} variant="title">
                {value}
              </Text>
            </Pressable>
          ))}
        </View>
      </Sheet>

      <ItemInfoSheet
        item={pickedItem}
        onClose={() => setPickedItem(null)}
        onOpenDetail={(id) => {
          setPickedItem(null);
          onOpenItem(id);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  fill: { flex: 1 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space.lg,
  },
  control: {
    minHeight: theme.touch.min,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
    paddingHorizontal: theme.space.sm,
  },
  pips: { flexDirection: 'row', gap: theme.space.xs },
  pip: { width: 6, height: 6, backgroundColor: theme.colors.borderInteractive },
  pipOn: { backgroundColor: theme.colors.accent },
  headline: { paddingHorizontal: theme.space.xl, paddingTop: theme.space.md },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.md,
    paddingBottom: theme.space.md,
  },
  primary: { flex: 1 },
  empty: { flex: 1, paddingHorizontal: theme.space.xl, paddingTop: theme.space.section, gap: theme.space.md },
  emptyActions: { flexDirection: 'row', alignItems: 'center', gap: theme.space.md, marginTop: theme.space.xl },
  options: { gap: theme.space.xs },
  option: { minHeight: theme.touch.button, justifyContent: 'center', paddingHorizontal: theme.space.lg },
  optionOn: { backgroundColor: theme.colors.accent },
}));
