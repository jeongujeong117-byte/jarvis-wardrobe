/**
 * The inside of today's issue. Each page fills the whole stage (W × H) given by the pager,
 * including the area under the status bar (`topInset` is added back as padding).
 * Type printed over photos uses fixed ink (overPhotoInk) chosen per photo, not the theme,
 * and is never placed on top of the garments: it lives in the empty studio wall.
 */
import { Image } from 'expo-image';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { type AiCut, itemPhotos, overPhotoInk } from '@/data/photos';
import type { ClothingItem } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { Icon } from '@/ui/icon';
import { ItemPhoto } from '@/ui/item-photo';
import { Text } from '@/ui/text';

/** expo-image is a third-party view: Unistyles styles must not be passed to it, so these stay plain objects. */
const fill = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const;

export type Box = { w: number; h: number };

/** Where a photo lands when it is scaled to cover the box (centered crop, no bands). */
function coverRect(box: Box, size: { w: number; h: number }) {
  const scale = Math.max(box.w / size.w, box.h / size.h);
  const w = size.w * scale;
  const h = size.h * scale;
  return { w, h, x: (box.w - w) / 2, y: (box.h - h) / 2 };
}

export type Teaser = { number: string; label: string; page: number };

/** Space kept clear at the bottom of scrolling pages for the floating bar. */
const BAR_CLEARANCE = 112;

/* ───────────── 01 Cover ───────────── */

/** Where the figure's left edge sits in the AI cover (share of image width) — the text column stops before it. */
const FIGURE_LEFT = 0.35;

export function CoverPage({
  box,
  topInset,
  cut,
  pieces,
  issueLine,
  issueLabel,
  occasion,
  headline,
  lead,
  counter,
  teasers,
  onOccasion,
  onTeaser,
}: {
  box: Box;
  topInset: number;
  /** AI on-body cut; when missing the cover is a collage of the real item photos. */
  cut?: AiCut;
  pieces: ClothingItem[];
  issueLine: string;
  issueLabel: string;
  occasion: string;
  headline: string;
  lead: string;
  counter: string;
  teasers: Teaser[];
  onOccasion: () => void;
  onTeaser: (page: number) => void;
}) {
  const { theme } = useUnistyles();
  const ink = cut ? overPhotoInk[cut.textOn] : theme.colors.textPrimary;
  const soft = cut ? overPhotoInk[cut.textOn] : theme.colors.textSecondary;

  // Photo: as tall as the page, nudged down so the head clears the masthead, figure kept right of the text column.
  const photoH = box.h;
  const photoW = cut ? (photoH * cut.size.w) / cut.size.h : 0;
  const figureLeft = Math.max(box.w * 0.44, 150);
  const photoLeft = figureLeft - FIGURE_LEFT * photoW;
  // On short screens the head would meet the date row, so the photo starts lower there.
  const photoTop = box.h * (box.h < 700 ? 0.15 : 0.09);
  const colWidth = Math.max(96, Math.min(170, figureLeft - 20 - 12));

  return (
    <View style={[styles.page, { width: box.w, height: box.h, backgroundColor: cut?.background ?? theme.colors.surfaceBase }]}>
      {cut ? (
        <Image
          accessibilityLabel="오늘의 코디를 입은 사진, AI로 생성"
          contentFit="cover"
          source={cut.image}
          style={{ position: 'absolute', left: photoLeft, top: photoTop, width: photoW, height: photoH }}
        />
      ) : (
        <Collage items={pieces} left={figureLeft - 12} top={topInset + 128} />
      )}

      <View style={[styles.mastWrap, { top: topInset + theme.space.lg }]}>
        <Text accessibilityLabel="자비스" accessibilityRole="header" style={[styles.mast, { color: ink }]} variant="masthead">
          JARVIS
        </Text>
        <View style={styles.issueRow}>
          <Text accessibilityLabel={issueLabel} style={{ color: soft }} variant="caption">
            {issueLine}
          </Text>
          <Pressable
            accessibilityLabel={`오늘의 일정 ${occasion}, 바꾸기`}
            accessibilityRole="button"
            onPress={onOccasion}
            style={styles.occasion}>
            <Text style={{ color: ink }} variant="label">
              {occasion}
            </Text>
            <Icon icon={ChevronDown} size={16} tone={cut ? 'primary' : 'primary'} />
          </Pressable>
        </View>
      </View>

      <View style={[styles.column, { top: topInset + 136, width: colWidth }]}>
        <Text style={{ color: ink }} variant="headline">
          {headline}
        </Text>
        <Text style={[styles.lead, { color: ink }]} variant="body">
          {lead}
        </Text>
        <Text style={[styles.counter, { color: soft }]} variant="caption">
          {counter}
        </Text>
        {teasers.map((teaser) => (
          <Pressable
            accessibilityLabel={`${teaser.label}, ${teaser.number}쪽으로 넘기기`}
            accessibilityRole="button"
            key={teaser.number}
            onPress={() => onTeaser(teaser.page)}
            style={styles.teaser}>
            <Text style={[styles.numeral, { color: ink }]}>{teaser.number}</Text>
            <Text numberOfLines={1} style={[styles.teaserLabel, { color: ink }]} variant="label">
              {teaser.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/** W-style cover for outfits without an AI photo: the real garment photos on the right half of the page. */
function Collage({ items, left, top }: { items: ClothingItem[]; left: number; top: number }) {
  return (
    <View style={[styles.collage, { left, top }]}>
      {items.slice(0, 4).map((item) => (
        <View key={item.id} style={[styles.collageCell, { backgroundColor: item.colorHex }]}>
          {itemPhotos[item.id] ? <Image contentFit="cover" source={itemPhotos[item.id]} style={fill} /> : null}
        </View>
      ))}
    </View>
  );
}

/* ───────────── Section page frame ───────────── */

function Section({
  box,
  topInset,
  counter,
  kicker,
  title,
  children,
}: {
  box: Box;
  topInset: number;
  counter: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.page, { width: box.w, height: box.h }]}>
      <ScrollView contentContainerStyle={[styles.sectionBody, { paddingTop: topInset + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.kickerRow}>
          <Text tone="secondary" style={styles.kicker} variant="caption">
            {kicker}
          </Text>
          <Text tone="secondary" variant="caption">
            {counter}
          </Text>
        </View>
        <Text accessibilityRole="header" variant="headline">
          {title}
        </Text>
        {children}
      </ScrollView>
    </View>
  );
}

/* ───────────── 02 Weather report ───────────── */

export type Weather = {
  city: string;
  now: number;
  sky: string;
  low: number;
  high: number;
  hours: { time: string; temp: number }[];
};

export function WeatherPage({
  box,
  topInset,
  counter,
  weather,
  outer,
}: {
  box: Box;
  topInset: number;
  counter: string;
  weather: Weather;
  outer?: ClothingItem;
}) {
  const evening = weather.hours[weather.hours.length - 1];
  return (
    <Section box={box} counter={counter} kicker="02 — WEATHER" title="오늘의 날씨" topInset={topInset}>
      <View accessibilityLabel={`${weather.city} 지금 ${weather.now}도, ${weather.sky}`} accessible style={styles.tempRow}>
        <Text style={styles.bigTemp} variant="masthead">
          {weather.now}°
        </Text>
        <View style={styles.tempMeta}>
          <Text variant="title">
            {weather.city} · {weather.sky}
          </Text>
          <Text tone="secondary" variant="body">
            최저 {weather.low}° 최고 {weather.high}°
          </Text>
        </View>
      </View>

      <View accessibilityLabel="시간별 기온" style={styles.hours}>
        {weather.hours.map((hour) => (
          <View accessibilityLabel={`${hour.time} ${hour.temp}도`} accessible key={hour.time} style={styles.hour}>
            <Text tone="secondary" variant="caption">
              {hour.time}
            </Text>
            <Text variant="title">{hour.temp}°</Text>
          </View>
        ))}
      </View>

      <Text style={styles.paragraph} variant="body">
        낮에는 셔츠 한 장이면 충분해요. {evening ? `${evening.time}엔 ${evening.temp}°까지 내려가니 ` : ''}
        {outer ? `${outer.name}을 챙기세요.` : '얇은 겉옷을 챙기세요.'}
      </Text>
      <Text tone="tertiary" style={styles.note} variant="caption">
        샘플 날씨예요. 실제 날씨 연결은 다음 단계에서 해요.
      </Text>
    </Section>
  );
}

/* ───────────── 03 Look (flat-lay with product-name tags) ───────────── */

export function LookPage({
  box,
  topInset,
  counter,
  cut,
  pieces,
  onPick,
}: {
  box: Box;
  topInset: number;
  counter: string;
  cut: AiCut;
  pieces: ClothingItem[];
  onPick: (item: ClothingItem) => void;
}) {
  const ink = overPhotoInk[cut.textOn];
  const rect = coverRect(box, cut.size);
  return (
    <View style={[styles.page, { width: box.w, height: box.h, backgroundColor: cut.background }]}>
      <Image
        accessibilityLabel="오늘의 코디를 펼쳐 놓은 사진, AI로 생성"
        contentFit="cover"
        source={cut.image}
        style={{ position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
      />
      <View style={[styles.lookHead, { top: topInset + 20 }]}>
        <Text style={[styles.kicker, { color: ink }]} variant="caption">
          03 — THE LOOK
        </Text>
        <Text style={{ color: ink }} variant="caption">
          {counter}
        </Text>
      </View>
      {cut.tags.map((tag) => {
        const item = pieces.find((entry) => entry.id === tag.itemId);
        // Keep the tag inside the page: the cover-crop can push a point past the screen edge.
        const left = Math.min(Math.max(rect.x + (tag.x / 100) * rect.w, 24), box.w - 24);
        const top = rect.y + (tag.y / 100) * rect.h;
        if (!item || top < topInset + 48 || top > box.h - BAR_CLEARANCE) return null;
        return (
          <Pressable
            accessibilityLabel={`${item.name}, 자세히 보기`}
            accessibilityRole="button"
            key={tag.itemId}
            onPress={() => onPick(item)}
            style={[
              styles.tag,
              tag.flip ? { right: box.w - left - 8, flexDirection: 'row-reverse' } : { left: left - 8 },
              { top: top - 22 },
            ]}>
            <View style={[styles.dot, { backgroundColor: ink }]} />
            <Text style={{ color: ink }} variant="label">
              {item.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ───────────── 04 Credits ───────────── */

export function CreditsPage({
  box,
  topInset,
  counter,
  pieces,
  aiPhoto,
  onOpen,
}: {
  box: Box;
  topInset: number;
  counter: string;
  pieces: ClothingItem[];
  aiPhoto: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <Section box={box} counter={counter} kicker="CREDITS" title="오늘 입는 옷" topInset={topInset}>
      <View style={styles.credits}>
        {pieces.map((item, index) => (
          <Pressable
            accessibilityHint="옷 상세 보기"
            accessibilityLabel={`${index + 1}번, ${item.name}, ${item.detail}`}
            accessibilityRole="button"
            key={item.id}
            onPress={() => onOpen(item.id)}
            style={({ pressed }) => [styles.credit, pressed && styles.pressed]}>
            <Text style={styles.creditNo} tone="secondary" variant="label">
              {String(index + 1).padStart(2, '0')}
            </Text>
            <View style={styles.creditPhoto}>
              <ItemPhoto item={item} />
            </View>
            <View style={styles.creditText}>
              <Text numberOfLines={1} variant="label">
                {item.name}
              </Text>
              <Text numberOfLines={1} tone="secondary" variant="caption">
                {item.category} · {item.detail}
              </Text>
            </View>
            <Icon icon={ChevronRight} size={18} tone="tertiary" />
          </Pressable>
        ))}
      </View>
      {aiPhoto ? (
        <Text tone="tertiary" style={styles.note} variant="caption">
          표지·코디 컷 사진: AI 생성 이미지. 실제 옷과 색이나 핏이 조금 다를 수 있어요.
        </Text>
      ) : null}
    </Section>
  );
}

/* ───────────── 05 My photo (PLUS) ───────────── */

export function MinePage({
  box,
  topInset,
  counter,
  onPick,
}: {
  box: Box;
  topInset: number;
  counter: string;
  onPick: () => void;
}) {
  return (
    <Section box={box} counter={counter} kicker="PLUS" title="내 사진으로 입어보기" topInset={topInset}>
      <Text style={styles.paragraph} tone="secondary" variant="body">
        전신 사진 한 장을 고르면 오늘의 코디를 입혀 드려요. 사진은 이 기능에만 쓰여요.
      </Text>
      <View style={styles.mineAction}>
        <Button label="사진 고르기" onPress={onPick} />
      </View>
    </Section>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { overflow: 'hidden' },
  pressed: { opacity: 0.6 },
  // Cover
  mastWrap: { position: 'absolute', left: theme.space.xl, right: theme.space.xl },
  mast: { fontSize: 52, lineHeight: 60, letterSpacing: 9 },
  issueRow: { flexDirection: 'row', alignItems: 'center', gap: theme.space.sm, minHeight: theme.touch.min },
  occasion: { minHeight: theme.touch.min, flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: theme.space.xs },
  column: { position: 'absolute', left: theme.space.xl },
  lead: { marginTop: theme.space.sm, opacity: 0.85 },
  counter: { marginTop: theme.space.xl, letterSpacing: 2 },
  teaser: { minHeight: theme.touch.min, flexDirection: 'row', alignItems: 'center', gap: theme.space.sm },
  numeral: { fontFamily: theme.type.masthead.fontFamily, fontSize: 14, lineHeight: 20 },
  teaserLabel: { flexShrink: 1 },
  collage: { position: 'absolute', right: theme.space.lg, bottom: BAR_CLEARANCE, flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.xs },
  collageCell: { width: '49%', aspectRatio: 0.8 },
  // Section pages
  sectionBody: { paddingHorizontal: theme.space.xl, paddingBottom: BAR_CLEARANCE },
  kickerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.space.sm },
  kicker: { letterSpacing: 2 },
  paragraph: { marginTop: theme.space.xl },
  note: { marginTop: theme.space.lg },
  // Weather
  tempRow: { flexDirection: 'row', alignItems: 'flex-end', gap: theme.space.lg, marginTop: theme.space.xl },
  bigTemp: { fontSize: 80, lineHeight: 88, letterSpacing: 0 },
  tempMeta: { gap: 2, paddingBottom: theme.space.md, flex: 1 },
  hours: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.space.xl,
    paddingVertical: theme.space.md,
    paddingHorizontal: theme.space.md,
    backgroundColor: theme.colors.surfaceSunken,
  },
  hour: { alignItems: 'center', gap: 2 },
  // Look
  lookHead: { position: 'absolute', left: theme.space.xl, right: theme.space.xl, flexDirection: 'row', justifyContent: 'space-between' },
  tag: { position: 'absolute', flexDirection: 'row', alignItems: 'center', gap: theme.space.sm, minHeight: theme.touch.min },
  dot: { width: 10, height: 10 },
  // Credits
  credits: { marginTop: theme.space.xl, gap: theme.space.xs },
  credit: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
    paddingRight: theme.space.sm,
    backgroundColor: theme.colors.surfaceSunken,
  },
  creditNo: { width: 32, textAlign: 'right' },
  creditPhoto: { width: 56 },
  creditText: { flex: 1, gap: 2 },
  mineAction: { marginTop: theme.space.xl, flexDirection: 'row' },
}));
