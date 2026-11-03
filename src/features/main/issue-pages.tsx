/**
 * The inside of today's issue. Each page fills the whole stage (W × H) given by the pager.
 * Type printed over photos uses fixed ink (overPhotoInk) chosen per photo, not the theme.
 */
import { Image } from 'expo-image';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

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

/* ───────────── 01 Cover ───────────── */

export function CoverPage({
  box,
  cut,
  pieces,
  issueLine,
  issueLabel,
  occasion,
  headline,
  teasers,
  onOccasion,
  onTeaser,
}: {
  box: Box;
  /** AI flat-lay; when missing the cover is a collage of the real item photos. */
  cut?: AiCut;
  pieces: ClothingItem[];
  issueLine: string;
  issueLabel: string;
  occasion: string;
  headline: string;
  teasers: Teaser[];
  onOccasion: () => void;
  onTeaser: (page: number) => void;
}) {
  const ink = overPhotoInk[cut?.textOn ?? 'dark'];
  const rect = cut ? coverRect(box, cut.size) : undefined;

  return (
    <View style={[styles.page, { width: box.w, height: box.h, backgroundColor: cut?.background ?? '#FFFFFF' }]}>
      {cut && rect ? (
        <>
          <Image
            accessibilityLabel="오늘의 코디 사진, AI로 생성"
            contentFit="cover"
            source={cut.image}
            style={{ position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
          />
        </>
      ) : (
        <Collage items={pieces} />
      )}

      <View pointerEvents="box-none" style={styles.coverTop}>
        <Text accessibilityLabel="자비스" accessibilityRole="header" style={[styles.masthead, { color: ink }]} variant="masthead">
          JARVIS
        </Text>
        <View style={styles.chipRow}>
          <View accessibilityLabel={issueLabel} accessible style={styles.chip}>
            <Text variant="caption">{issueLine}</Text>
          </View>
          <Pressable
            accessibilityLabel={`오늘의 일정 ${occasion}, 바꾸기`}
            accessibilityRole="button"
            onPress={onOccasion}
            style={styles.teaserHit}>
            <View style={styles.chip}>
              <Text variant="caption">{occasion}</Text>
              <Icon icon={ChevronDown} size={14} />
            </View>
          </Pressable>
        </View>
      </View>

      <View pointerEvents="box-none" style={styles.coverBottom}>
        <View style={styles.teasers}>
          {teasers.map((teaser) => (
            <Pressable
              accessibilityLabel={`${teaser.label}, ${teaser.number}쪽으로 넘기기`}
              accessibilityRole="button"
              key={teaser.number}
              onPress={() => onTeaser(teaser.page)}
              style={styles.teaserHit}>
              <View style={styles.chip}>
                <Text variant="caption">
                  {teaser.number} {teaser.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
        <Text numberOfLines={1} style={[styles.headline, { color: ink }]} variant="display">
          {headline}
        </Text>
      </View>
    </View>
  );
}

/** W-style cover for outfits without an AI photo: the real garment photos, edge to edge. */
function Collage({ items }: { items: ClothingItem[] }) {
  return (
    <View style={styles.collage}>
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
  number,
  kicker,
  title,
  children,
}: {
  box: Box;
  number: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.page, { width: box.w, height: box.h }]}>
      <ScrollView contentContainerStyle={styles.sectionBody} showsVerticalScrollIndicator={false}>
        <Text tone="secondary" style={styles.kicker} variant="caption">
          {number} — {kicker}
        </Text>
        <Text accessibilityRole="header" variant="display">
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
  number,
  weather,
  outer,
}: {
  box: Box;
  number: string;
  weather: Weather;
  outer?: ClothingItem;
}) {
  const evening = weather.hours[weather.hours.length - 1];
  return (
    <Section box={box} kicker="WEATHER" number={number} title="오늘의 날씨">
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

/* ───────────── 03 Look (on-body, labelled tags) ───────────── */

export function LookPage({
  box,
  number,
  cut,
  pieces,
  onPick,
}: {
  box: Box;
  number: string;
  cut: AiCut;
  pieces: ClothingItem[];
  onPick: (item: ClothingItem) => void;
}) {
  const ink = overPhotoInk[cut.textOn];
  const rect = coverRect(box, cut.size);
  return (
    <View style={[styles.page, { width: box.w, height: box.h, backgroundColor: cut.background }]}>
      <Image
        accessibilityLabel="오늘의 코디를 입은 사진, AI로 생성"
        contentFit="cover"
        source={cut.image}
        style={{ position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
      />
      <Text style={[styles.lookKicker, { color: ink }]} variant="caption">
        {number} — THE LOOK
      </Text>
      {cut.tags.map((tag) => {
        const item = pieces.find((entry) => entry.id === tag.itemId);
        const left = rect.x + (tag.x / 100) * rect.w;
        const top = rect.y + (tag.y / 100) * rect.h;
        if (!item || top < 24 || top > box.h - 24) return null;
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
            <View style={styles.chip}>
              <Text variant="caption">{item.name}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ───────────── 04 Credits ───────────── */

export function CreditsPage({
  box,
  number,
  pieces,
  aiPhoto,
  onOpen,
}: {
  box: Box;
  number: string;
  pieces: ClothingItem[];
  aiPhoto: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <Section box={box} kicker="CREDITS" number={number} title="오늘 입는 옷">
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
          표지·착용 컷 사진: AI 생성 이미지. 실제 옷과 색이나 핏이 조금 다를 수 있어요.
        </Text>
      ) : null}
    </Section>
  );
}

/* ───────────── 05 My photo (PLUS) ───────────── */

export function MinePage({ box, number, onPick }: { box: Box; number: string; onPick: () => void }) {
  return (
    <Section box={box} kicker="PLUS" number={number} title="내 사진으로 입어보기">
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
  coverTop: { position: 'absolute', top: theme.space.lg, left: theme.space.xl, right: theme.space.xl, gap: theme.space.xs },
  masthead: { fontSize: 44, lineHeight: 52, letterSpacing: 8 },
  chipRow: { flexDirection: 'row', gap: theme.space.xs, alignItems: 'center' },
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: theme.colors.surfaceRaised,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 3,
  },
  coverBottom: { position: 'absolute', left: theme.space.xl, right: theme.space.xl, bottom: theme.space.lg },
  teasers: { marginBottom: theme.space.sm },
  teaserHit: { minHeight: theme.touch.min, justifyContent: 'center', alignSelf: 'flex-start' },
  headline: { fontSize: 34, lineHeight: 42 },
  dot: { width: 10, height: 10 },
  collage: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
  collageCell: { width: '50%', height: '50%' },
  // Section pages
  sectionBody: { paddingHorizontal: theme.space.xl, paddingTop: theme.space.xl, paddingBottom: theme.space.xl },
  kicker: { letterSpacing: 2, marginBottom: theme.space.sm },
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
  lookKicker: { position: 'absolute', top: theme.space.lg, left: theme.space.xl, letterSpacing: 2 },
  tag: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.xs,
    minHeight: theme.touch.min,
  },
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
