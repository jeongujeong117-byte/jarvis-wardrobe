/**
 * Today = today's issue of the magazine. The cover is the outfit; turning pages sideways
 * brings the weather report, the on-body look, the credits (what you wear) and the PLUS page.
 * The action bar stays fixed below every page.
 */
import { ChevronRight } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Alert, type LayoutChangeEvent, Pressable, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { aiOutfitFor } from '@/data/photos';
import type { ClothingItem } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { Icon } from '@/ui/icon';
import { Sheet } from '@/ui/sheet';
import { Text } from '@/ui/text';
import { TopBar } from '@/ui/top-bar';
import { Wordmark } from '@/ui/wordmark';

import {
  type Box,
  CoverPage,
  CreditsPage,
  LookPage,
  MinePage,
  type Teaser,
  type Weather,
  WeatherPage,
} from './issue-pages';
import { ItemInfoSheet } from './item-info-sheet';

const occasions = ['일상', '출근', '약속', '운동'];

/** Demo weather (same sample the app showed before). */
const sampleWeather: Weather = {
  city: '서울',
  now: 24,
  sky: '맑음',
  low: 15,
  high: 24,
  hours: [
    { time: '9시', temp: 18 },
    { time: '12시', temp: 22 },
    { time: '15시', temp: 24 },
    { time: '18시', temp: 20 },
    { time: '21시', temp: 17 },
  ],
};

const weekdaysEn = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const weekdaysKo = ['일', '월', '화', '수', '목', '금', '토'];

/** Issue number = day of the year, so every day is a new issue. */
function issueOf(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const number = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return {
    line: `NO.${number} · ${mm}.${dd} ${weekdaysEn[date.getDay()]}`,
    label: `${number}호, ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdaysKo[date.getDay()]}요일`,
  };
}

type PageKey = 'cover' | 'weather' | 'look' | 'credits' | 'mine';
const pageNames: Record<PageKey, string> = {
  cover: '표지',
  weather: '날씨',
  look: '착용 컷',
  credits: '크레딧',
  mine: '내 사진',
};

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
  page,
  setPage,
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
  /** Kept by the app so returning from an item's detail lands on the same page of the issue. */
  page: number;
  setPage: (page: number) => void;
}) {
  const [box, setBox] = useState<Box>({ w: 0, h: 0 });
  const [showOccasions, setShowOccasions] = useState(false);
  const [pickedItem, setPickedItem] = useState<ClothingItem | null>(null);
  const scroller = useRef<ScrollView>(null);

  // Selection rules unchanged from the prototype.
  const tops = items.filter((item) => item.category === '상의');
  const bottoms = items.filter((item) => item.category === '하의');
  const outer = items.find((item) => item.category === '아우터');
  const shoes = items.find((item) => item.category === '신발');
  const ready = tops.length > 0 && bottoms.length > 0;
  const top = ready ? tops[outfitIndex % tops.length] : undefined;
  const bottom = ready ? bottoms[(outfitIndex + 1) % bottoms.length] : undefined;

  if (!ready || !top || !bottom) {
    return (
      <>
        <TopBar leading={<Wordmark />} />
        <View style={styles.empty}>
          <Text accessibilityRole="header" variant="display">
            이번 호를 만들 옷이{'\n'}아직 부족해요.
          </Text>
          <Text tone="secondary" variant="body">
            상의와 하의를 한 벌씩 더하면 바로 오늘의 표지를 만들어 드려요.
          </Text>
          <View style={styles.emptyActions}>
            <Button label="옷 가져오기" onPress={onImport} />
            <Button label="옷장 보기" onPress={onOpenCloset} variant="text" />
          </View>
        </View>
      </>
    );
  }

  const pieces = [top, bottom, outer, shoes].filter((piece): piece is ClothingItem => Boolean(piece));
  const ai = aiOutfitFor(top, bottom);
  const pages: PageKey[] = ai ? ['cover', 'weather', 'look', 'credits', 'mine'] : ['cover', 'weather', 'credits', 'mine'];
  const numberOf = (key: PageKey) => String(pages.indexOf(key) + 1).padStart(2, '0');
  const issue = issueOf(new Date());

  const teasers: Teaser[] = [
    { number: numberOf('weather'), label: `날씨 ${sampleWeather.now}° ${sampleWeather.sky}`, page: pages.indexOf('weather') },
    ...(ai ? [{ number: numberOf('look'), label: '착용 컷', page: pages.indexOf('look') }] : []),
    { number: numberOf('credits'), label: `오늘 입는 옷 ${pieces.length}벌`, page: pages.indexOf('credits') },
  ];

  const current = Math.min(page, pages.length - 1);
  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(pages.length - 1, index));
    setPage(next);
    scroller.current?.scrollTo({ x: next * box.w, animated: true });
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width !== box.w || height !== box.h) {
      setBox({ w: width, h: height });
      requestAnimationFrame(() => scroller.current?.scrollTo({ x: current * width, animated: false }));
    }
  };

  const pickMyPhoto = () =>
    Alert.alert('데모 안내', '내 사진 고르기는 PLUS 기능이에요. 실제 연결은 다음 단계에서 해요.');

  const nextKey = pages[current + 1];

  return (
    <>
      <View onLayout={onLayout} style={styles.stage}>
        {box.w > 0 ? (
          <ScrollView
            horizontal
            onScroll={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / box.w);
              if (index !== current && index >= 0 && index < pages.length) setPage(index);
            }}
            pagingEnabled
            ref={scroller}
            scrollEventThrottle={32}
            showsHorizontalScrollIndicator={false}>
            {pages.map((key) => {
              const number = numberOf(key);
              if (key === 'cover') {
                return (
                  <CoverPage
                    box={box}
                    cut={ai?.flatlay}
                    headline="오늘은 가볍게."
                    issueLabel={issue.label}
                    issueLine={issue.line}
                    key={key}
                    occasion={tpo}
                    onOccasion={() => setShowOccasions(true)}
                    onTeaser={goTo}
                    pieces={pieces}
                    teasers={teasers}
                  />
                );
              }
              if (key === 'weather') {
                return <WeatherPage box={box} key={key} number={number} outer={outer} weather={sampleWeather} />;
              }
              if (key === 'look' && ai) {
                return <LookPage box={box} cut={ai.model} key={key} number={number} onPick={setPickedItem} pieces={pieces} />;
              }
              if (key === 'credits') {
                return (
                  <CreditsPage aiPhoto={Boolean(ai)} box={box} key={key} number={number} onOpen={onOpenItem} pieces={pieces} />
                );
              }
              return <MinePage box={box} key={key} number={number} onPick={pickMyPhoto} />;
            })}
          </ScrollView>
        ) : null}
      </View>

      {/* Folio: where you are in the issue, and the way to the next page. */}
      <View style={styles.folio}>
        <Text
          accessibilityLabel={`${pages.length}쪽 중 ${current + 1}쪽, ${pageNames[pages[current] ?? 'cover']}`}
          tone="secondary"
          variant="caption">
          {String(current + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')} · {pageNames[pages[current] ?? 'cover']}
        </Text>
        <Pressable
          accessibilityLabel={nextKey ? `다음 쪽, ${pageNames[nextKey]}` : '표지로 돌아가기'}
          accessibilityRole="button"
          onPress={() => goTo(nextKey ? current + 1 : 0)}
          style={styles.folioNext}>
          <Text variant="label">{nextKey ? pageNames[nextKey] : '표지로'}</Text>
          <Icon icon={ChevronRight} size={16} />
        </Pressable>
      </View>

      <View style={styles.actionBar}>
        <View style={styles.primary}>
          {worn ? (
            <Button block label="오늘 입는 중 · 취소" onPress={onUnwear} variant="quiet" />
          ) : (
            <Button block label="이 코디 입기" onPress={onWear} />
          )}
        </View>
        <Button
          label="다른 코디"
          onPress={() => {
            goTo(0);
            onOtherOutfit();
          }}
          variant="text"
        />
      </View>

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
  stage: { flex: 1, minHeight: 240 },
  folio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: theme.space.xl,
    paddingRight: theme.space.md,
  },
  folioNext: {
    minHeight: theme.touch.min,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: theme.space.sm,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
    paddingHorizontal: theme.space.xl,
    paddingBottom: theme.space.sm,
  },
  primary: { flex: 1 },
  empty: { flex: 1, paddingHorizontal: theme.space.xl, paddingTop: theme.space.section, gap: theme.space.md },
  emptyActions: { flexDirection: 'row', alignItems: 'center', gap: theme.space.md, marginTop: theme.space.xl },
  options: { gap: theme.space.xs },
  option: { minHeight: theme.touch.button, justifyContent: 'center', paddingHorizontal: theme.space.lg },
  optionOn: { backgroundColor: theme.colors.accent },
}));
