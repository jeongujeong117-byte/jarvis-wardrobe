/**
 * Today = today's issue of the magazine. The cover is the outfit worn; turning pages sideways
 * brings the weather report, the flat-lay with product tags, the credits (what you wear) and
 * the PLUS page. One floating bar over every page holds the actions and the way to the other tabs.
 */
import { Check, List, Shirt, Shuffle, User } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Alert, type LayoutChangeEvent, Pressable, ScrollView, View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

import { aiOutfitFor } from '@/data/photos';
import type { ClothingItem } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { type BarSlot, FloatingBar, type Tab } from '@/ui/floating-bar';
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
  onNavigate,
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
  onNavigate: (tab: Tab) => void;
  /** Kept by the app so returning from an item's detail lands on the same page of the issue. */
  page: number;
  setPage: (page: number) => void;
}) {
  const [box, setBox] = useState<Box>({ w: 0, h: 0 });
  const [showOccasions, setShowOccasions] = useState(false);
  const [pickedItem, setPickedItem] = useState<ClothingItem | null>(null);
  const scroller = useRef<ScrollView>(null);
  // The cover bleeds under the status bar, so the pages are laid out from the very top.
  const topInset = UnistylesRuntime.insets.top;

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
        <FloatingBar groups={[navSlots(onNavigate)]} />
      </>
    );
  }

  const pieces = [top, bottom, outer, shoes].filter((piece): piece is ClothingItem => Boolean(piece));
  const ai = aiOutfitFor(top, bottom);
  const pages: PageKey[] = ai ? ['cover', 'weather', 'look', 'credits', 'mine'] : ['cover', 'weather', 'credits', 'mine'];
  const total = String(pages.length).padStart(2, '0');
  const numberOf = (key: PageKey) => String(pages.indexOf(key) + 1).padStart(2, '0');
  const counterOf = (key: PageKey) => `${numberOf(key)} / ${total}`;
  const issue = issueOf(new Date());

  const teasers: Teaser[] = [
    { number: numberOf('weather'), label: `날씨 ${sampleWeather.now}°`, page: pages.indexOf('weather') },
    ...(ai ? [{ number: numberOf('look'), label: '코디 컷', page: pages.indexOf('look') }] : []),
    { number: numberOf('credits'), label: `입는 옷 ${pieces.length}벌`, page: pages.indexOf('credits') },
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

  const actions: BarSlot[] = [
    {
      key: 'wear',
      label: worn ? '입는 중' : '입기',
      a11yLabel: worn ? '오늘 입는 중, 취소하려면 누르세요' : '이 코디 입기',
      icon: Check,
      active: worn,
      onPress: worn ? onUnwear : onWear,
    },
    {
      key: 'other',
      label: '다른 코디',
      icon: Shuffle,
      onPress: () => {
        goTo(0);
        onOtherOutfit();
      },
    },
    { key: 'credits', label: '입는 옷', icon: List, onPress: () => goTo(pages.indexOf('credits')) },
  ];

  return (
    <View style={styles.root}>
      <View onLayout={onLayout} style={[styles.stage, { marginTop: -topInset }]}>
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
              if (key === 'cover') {
                return (
                  <CoverPage
                    box={box}
                    counter={`${counterOf('cover')} · 이번 호`}
                    cut={ai?.model}
                    headline={'오늘은\n가볍게.'}
                    issueLabel={issue.label}
                    issueLine={issue.line}
                    key={key}
                    lead={'낮엔 셔츠 한 장,\n저녁엔 윈드 재킷.'}
                    occasion={tpo}
                    onOccasion={() => setShowOccasions(true)}
                    onTeaser={goTo}
                    pieces={pieces}
                    teasers={teasers}
                    topInset={topInset}
                  />
                );
              }
              if (key === 'weather') {
                return (
                  <WeatherPage box={box} counter={counterOf(key)} key={key} outer={outer} topInset={topInset} weather={sampleWeather} />
                );
              }
              if (key === 'look' && ai) {
                return (
                  <LookPage box={box} counter={counterOf(key)} cut={ai.flatlay} key={key} onPick={setPickedItem} pieces={pieces} topInset={topInset} />
                );
              }
              if (key === 'credits') {
                return (
                  <CreditsPage aiPhoto={Boolean(ai)} box={box} counter={counterOf(key)} key={key} onOpen={onOpenItem} pieces={pieces} topInset={topInset} />
                );
              }
              return <MinePage box={box} counter={counterOf(key)} key={key} onPick={pickMyPhoto} topInset={topInset} />;
            })}
          </ScrollView>
        ) : null}
      </View>

      <FloatingBar groups={[actions, navSlots(onNavigate)]} />

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
    </View>
  );
}

/** Today's bar only shows the other two tabs: you are already on Today. */
function navSlots(onNavigate: (tab: Tab) => void): BarSlot[] {
  return [
    { key: 'closet', label: '옷장', icon: Shirt, dim: true, onPress: () => onNavigate('closet') },
    { key: 'my', label: '마이', icon: User, dim: true, onPress: () => onNavigate('my') },
  ];
}

const styles = StyleSheet.create((theme) => ({
  root: { flex: 1 },
  stage: { flex: 1 },
  empty: { flex: 1, paddingHorizontal: theme.space.xl, paddingTop: theme.space.section, gap: theme.space.md },
  emptyActions: { flexDirection: 'row', alignItems: 'center', gap: theme.space.md, marginTop: theme.space.xl },
  options: { gap: theme.space.xs },
  option: { minHeight: theme.touch.button, justifyContent: 'center', paddingHorizontal: theme.space.lg },
  optionOn: { backgroundColor: theme.colors.accent },
}));
