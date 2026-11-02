import { RefreshCw, Sparkles, Sun } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import type { ClothingItem } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Chip } from '@/ui/chip';
import { OutfitComposition } from '@/ui/garment/outfit-composition';
import { Icon } from '@/ui/icon';
import { RailIllustration } from '@/ui/line-art';
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
          <View accessibilityLabel="서울 24도 맑음" style={styles.weather}>
            <Icon icon={Sun} size={18} />
            <Text variant="label">24° 서울</Text>
          </View>
        }
      />
      <ScreenScroll>
        <View style={styles.intro}>
          <Text tone="secondary" variant="label">
            8월 27일 목요일
          </Text>
          <Text accessibilityRole="header" variant="display">
            오늘은 {tpo},{'\n'}
            <Text tone="accent" variant="display">
              이렇게 입어요
            </Text>
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.chips}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}>
          {occasions.map((value) => (
            <Chip key={value} label={value} onPress={() => setTpo(value)} selected={tpo === value} />
          ))}
        </ScrollView>

        {ready && top && bottom ? (
          <View style={styles.outfit}>
            <Animated.View entering={FadeIn.duration(200)} key={`${top.id}-${bottom.id}`}>
              <OutfitComposition bottom={bottom} outer={outer} shoes={shoes} top={top} />
            </Animated.View>
            <View style={styles.meta}>
              <Text tone="secondary" variant="caption">
                추천 {(outfitIndex % 3) + 1}/3 · 날씨 적합
              </Text>
            </View>
            <View style={styles.reason}>
              <Icon icon={Sparkles} size={18} tone="accent" />
              <Text style={styles.reasonText} variant="body">
                낮에는 가볍고, 저녁 일교차에는 {outer ? `${outer.name}을 더하기` : '얇은 아우터 더하기'} 좋은 조합이에요.
              </Text>
            </View>
            <View style={styles.actions}>
              <View style={styles.action}>
                <Button
                  icon={RefreshCw}
                  label="다른 코디"
                  onPress={() => setOutfitIndex(outfitIndex + 1)}
                  variant="secondary"
                />
              </View>
              <View style={styles.action}>
                <Button label="이 코디 입기" onPress={onWear} />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.outfit}>
            <Card>
              <View style={styles.empty}>
                <RailIllustration height={140} />
                <Text align="center" variant="heading">
                  첫 코디를 만들 옷이 부족해요
                </Text>
                <Text align="center" tone="secondary" variant="body">
                  상의와 하의를 한 벌씩 추가하면 바로 추천해드릴게요.
                </Text>
                <View style={styles.emptyActions}>
                  <Button label="옷 가져오기" onPress={onImport} />
                  <Button label="옷장 보기" onPress={onOpenCloset} variant="ghost" />
                </View>
              </View>
            </Card>
          </View>
        )}

        {wearCount > 0 ? (
          <View style={styles.stat}>
            <Card>
              <Text tone="secondary" variant="label">
                이번 주 착용 기록
              </Text>
              <View style={styles.statRow}>
                <View style={styles.countRow}>
                  <Text variant="numeral">{wearCount}</Text>
                  <Text variant="heading">회</Text>
                </View>
                <View accessibilityLabel={`이번 주 ${wearCount}회 착용`} style={styles.week}>
                  {weekdays.map((day, index) => (
                    <View key={day} style={styles.day}>
                      <View style={[styles.dayBlock, index < wearCount && styles.dayBlockOn]} />
                      <Text tone="secondary" variant="caption">
                        {day}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card>
          </View>
        ) : null}
      </ScreenScroll>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  weather: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.xs,
    minHeight: theme.touch.min,
    paddingHorizontal: theme.space.md,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceRaised,
  },
  intro: { gap: theme.space.sm, paddingTop: theme.space.md },
  chipScroll: { marginTop: theme.space.xl, marginHorizontal: -theme.space.xl, flexGrow: 0 },
  chips: { gap: theme.space.sm, paddingHorizontal: theme.space.xl },
  outfit: { marginTop: theme.space.xxl },
  meta: { marginTop: theme.space.md },
  reason: { flexDirection: 'row', gap: theme.space.sm, marginTop: theme.space.sm },
  reasonText: { flex: 1 },
  actions: { flexDirection: 'row', gap: theme.space.sm, marginTop: theme.space.xl },
  action: { flex: 1 },
  empty: { alignItems: 'center', gap: theme.space.md },
  emptyActions: { alignSelf: 'stretch', gap: theme.space.xs, marginTop: theme.space.sm },
  stat: { marginTop: theme.space.section },
  statRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: theme.space.xs,
  },
  countRow: { flexDirection: 'row', alignItems: 'baseline', gap: theme.space.xs },
  week: { flexDirection: 'row', gap: theme.space.sm, paddingBottom: theme.space.xs },
  day: { alignItems: 'center', gap: theme.space.xs },
  dayBlock: {
    width: 20,
    height: 20,
    borderWidth: theme.stroke.emphasis,
    borderColor: theme.colors.borderStructural,
  },
  dayBlockOn: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
}));
