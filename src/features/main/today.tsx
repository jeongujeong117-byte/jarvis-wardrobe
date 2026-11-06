import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import type { ClothingItem } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { OutfitSketch } from '@/ui/pen/outfit-sketch';
import { PenChoice, PenChoiceRow } from '@/ui/pen/pen-choice';
import { PenDrawing } from '@/ui/pen/pen-drawing';
import { ScreenScroll } from '@/ui/screen';
import { Text } from '@/ui/text';
import { TopBar } from '@/ui/top-bar';
import { Wordmark } from '@/ui/wordmark';

const occasions = ['일상', '출근', '약속', '운동'];
const weekdays = ['월', '화', '수', '목', '금'];

export function TodayScreen({
  items,
  outfitIndex,
  setOutfitIndex,
  tpo,
  setTpo,
  wearCount,
  onWear,
  onImport,
  onOpenCloset,
}: {
  items: ClothingItem[];
  outfitIndex: number;
  setOutfitIndex: (value: number) => void;
  tpo: string;
  setTpo: (value: string) => void;
  wearCount: number;
  onWear: () => void;
  onImport: () => void;
  onOpenCloset: () => void;
}) {
  // Selection rules unchanged from the prototype.
  const tops = items.filter((item) => item.category === '상의');
  const bottoms = items.filter((item) => item.category === '하의');
  const outer = items.find((item) => item.category === '아우터');
  const shoes = items.find((item) => item.category === '신발');
  const ready = tops.length > 0 && bottoms.length > 0;
  const top = ready ? tops[outfitIndex % tops.length] : undefined;
  const bottom = ready ? bottoms[(outfitIndex + 1) % bottoms.length] : undefined;

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
      <ScreenScroll>
        <Text accessibilityRole="header" variant="display">
          오늘은 가볍게,{'\n'}저녁엔 한 겹 더.
        </Text>

        <View accessibilityLabel="오늘의 일정" style={styles.choices}>
          <PenChoiceRow>
            {occasions.map((value) => (
              <PenChoice key={value} label={value} onPress={() => setTpo(value)} selected={tpo === value} />
            ))}
          </PenChoiceRow>
        </View>

        {ready && top && bottom ? (
          <View style={styles.outfit}>
            <Animated.View entering={FadeIn.duration(200)} key={`${top.id}-${bottom.id}`}>
              <OutfitSketch bottom={bottom} outer={outer} shoes={shoes} signature="Thursday" top={top} />
            </Animated.View>
            <View style={styles.caption}>
              <Text variant="title">
                {top.name}에 {bottom.name}
              </Text>
              <Text tone="secondary" variant="body">
                낮에는 가볍고, 저녁 일교차에는 {outer ? `${outer.name}을 더하기` : '얇은 아우터 더하기'} 좋은 조합이에요.
              </Text>
            </View>
            <View style={styles.actions}>
              <Button label="이 코디 입기" onPress={onWear} />
              <Button label="다른 코디" onPress={() => setOutfitIndex(outfitIndex + 1)} variant="text" />
            </View>
          </View>
        ) : (
          <View style={styles.empty}>
            <PenDrawing name="hanger" size={160} />
            <Text variant="heading">코디를 만들 옷이 아직 부족해요.</Text>
            <Text tone="secondary" variant="body">
              상의와 하의를 한 벌씩 더하면 바로 골라드릴게요.
            </Text>
            <View style={styles.actions}>
              <Button label="옷 가져오기" onPress={onImport} />
              <Button label="옷장 보기" onPress={onOpenCloset} variant="text" />
            </View>
          </View>
        )}

        {wearCount > 0 ? (
          <View accessibilityLabel={`이번 주 ${wearCount}번 입었어요`} accessible style={styles.week}>
            <Text variant="title">이번 주 {wearCount}번 입었어요.</Text>
            <View style={styles.days}>
              {weekdays.map((day, index) => (
                <View key={day} style={styles.day}>
                  <View style={[styles.dayPlane, index < wearCount && styles.dayPlaneOn]} />
                  <Text tone="tertiary" variant="caption">
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </ScreenScroll>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  choices: { marginTop: theme.space.lg },
  outfit: { marginTop: theme.space.xl },
  caption: { gap: theme.space.xs, marginTop: theme.space.md, maxWidth: 420 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
    marginTop: theme.space.xl,
  },
  empty: { marginTop: theme.space.section, gap: theme.space.md },
  week: {
    marginTop: theme.space.section,
    paddingTop: theme.space.xl,
    borderTopWidth: theme.stroke.hairline,
    borderTopColor: theme.colors.borderInteractive,
    gap: theme.space.lg,
  },
  days: { flexDirection: 'row', gap: theme.space.lg },
  day: { alignItems: 'center', gap: theme.space.xs },
  dayPlane: {
    width: 16,
    height: 16,
    borderWidth: theme.stroke.base,
    borderColor: theme.colors.borderInteractive,
  },
  dayPlaneOn: { backgroundColor: theme.colors.textPrimary, borderColor: theme.colors.textPrimary },
}));
