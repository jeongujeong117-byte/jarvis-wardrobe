import { Image } from 'expo-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type LayoutChangeEvent, Pressable, ScrollView, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { type AiCut, aiOutfitFor, itemPhotos, type PhotoMode, photoModes } from '@/data/photos';
import type { ClothingItem } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { Text } from '@/ui/text';

/** expo-image is a third-party view: Unistyles styles must not be passed to it, so this stays a plain object. */
const fill = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const;

const RATIO = 1.25; // photo is 4:5 (height = 1.25 × width)

type Props = {
  mode: PhotoMode;
  onModeChange: (mode: PhotoMode) => void;
  /** Items of today's outfit, in display order. */
  pieces: ClothingItem[];
  top: ClothingItem;
  bottom: ClothingItem;
  onPickItem: (item: ClothingItem) => void;
  onPickMyPhoto: () => void;
};

/**
 * The magazine plate. One horizontally paged stage with three pages (코디 컷 / 착용 컷 / 내 사진).
 * The photo is sized to fit the space that is left, so it never pushes the action bar away.
 * The stage color equals the AI image's own background, so the photo has no visible edge.
 */
export function OutfitStage({ mode, onModeChange, pieces, top, bottom, onPickItem, onPickMyPhoto }: Props) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const scroller = useRef<ScrollView>(null);
  const ai = aiOutfitFor(top, bottom);
  const { theme } = useUnistyles();

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setBox((current) => (current.w === width && current.h === height ? current : { w: width, h: height }));
  };

  // Keep the paged scroller on the current page when the stage is resized.
  const index = photoModes.findIndex((entry) => entry.key === mode);
  useEffect(() => {
    if (box.w > 0) scroller.current?.scrollTo({ x: index * box.w, animated: false });
  }, [box.w, index]);

  const onScroll = useCallback(
    (x: number) => {
      if (box.w <= 0) return;
      const next = photoModes[Math.min(photoModes.length - 1, Math.max(0, Math.round(x / box.w)))];
      if (next && next.key !== mode) onModeChange(next.key);
    },
    [box.w, mode, onModeChange],
  );

  const photoH = Math.max(0, Math.min(box.h, box.w * RATIO));
  const photoW = photoH / RATIO;
  const stageBackground =
    mode === 'model'
      ? (ai?.model.background ?? theme.colors.surfaceBase)
      : mode === 'flatlay'
        ? (ai?.flatlay.background ?? theme.colors.surfaceBase)
        : theme.colors.surfaceBase;

  return (
    <View onLayout={onLayout} style={[styles.stage, { backgroundColor: stageBackground }]}>
      {box.w > 0 ? (
        <ScrollView
          horizontal
          onScroll={(event) => onScroll(event.nativeEvent.contentOffset.x)}
          pagingEnabled
          ref={scroller}
          scrollEventThrottle={32}
          showsHorizontalScrollIndicator={false}>
          <Page h={box.h} w={box.w}>
            {ai ? (
              <TaggedPhoto cut={ai.flatlay} items={pieces} onPick={onPickItem} w={photoW} h={photoH} />
            ) : (
              <ItemGrid items={pieces} onPick={onPickItem} w={photoW} h={photoH} />
            )}
          </Page>
          <Page h={box.h} w={box.w}>
            {ai ? (
              <TaggedPhoto cut={ai.model} items={pieces} onPick={onPickItem} w={photoW} h={photoH} />
            ) : (
              <Notice
                body="이 코디의 착용 컷은 PLUS에서 만들어 드려요."
                h={photoH}
                onPress={onPickMyPhoto}
                action="PLUS 알아보기"
                w={photoW}
              />
            )}
          </Page>
          <Page h={box.h} w={box.w}>
            <Notice
              action="사진 고르기"
              body="내 사진에 이 코디를 입혀 드려요."
              h={photoH}
              onPress={onPickMyPhoto}
              w={photoW}
            />
          </Page>
        </ScrollView>
      ) : null}
      {ai && mode !== 'mine' ? (
        <View pointerEvents="none" style={styles.badge}>
          <Text tone="secondary" variant="caption">
            AI 코디
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function Page({ w, h, children }: { w: number; h: number; children: React.ReactNode }) {
  return <View style={[styles.page, { width: w, height: h }]}>{children}</View>;
}

function TaggedPhoto({
  cut,
  items,
  onPick,
  w,
  h,
}: {
  cut: AiCut;
  items: ClothingItem[];
  onPick: (item: ClothingItem) => void;
  w: number;
  h: number;
}) {
  return (
    <View style={{ width: w, height: h }}>
      <Image
        accessibilityLabel="AI가 만든 오늘의 코디 사진"
        contentFit="cover"
        source={cut.image}
        style={{ width: w, height: h }}
      />
      {cut.tags.map((tag) => {
        const item = items.find((entry) => entry.id === tag.itemId);
        if (!item) return null;
        return (
          <Pressable
            accessibilityLabel={`${item.name}, 자세히 보기`}
            accessibilityRole="button"
            key={`${tag.itemId}-${tag.x}`}
            onPress={() => onPick(item)}
            style={[
              styles.tag,
              tag.flip
                ? { right: `${100 - tag.x}%`, flexDirection: 'row-reverse' }
                : { left: `${tag.x}%` },
              { top: `${tag.y}%` },
            ]}>
            <View style={styles.dot} />
            <View style={styles.tagLabel}>
              <Text variant="caption">{item.name}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Fallback when no AI cut exists for this outfit: the real item photos, 2 × 2. */
function ItemGrid({
  items,
  onPick,
  w,
  h,
}: {
  items: ClothingItem[];
  onPick: (item: ClothingItem) => void;
  w: number;
  h: number;
}) {
  const cells = items.slice(0, 4);
  return (
    <View style={[styles.grid, { width: w, height: h }]}>
      {cells.map((item) => (
        <Pressable
          accessibilityLabel={`${item.name}, 자세히 보기`}
          accessibilityRole="button"
          key={item.id}
          onPress={() => onPick(item)}
          style={[styles.cell, { backgroundColor: item.colorHex }]}>
          {itemPhotos[item.id] ? (
            <Image contentFit="cover" source={itemPhotos[item.id]} style={fill} />
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

function Notice({
  body,
  action,
  onPress,
  w,
  h,
}: {
  body: string;
  action: string;
  onPress: () => void;
  w: number;
  h: number;
}) {
  return (
    <View style={[styles.notice, { width: w, height: h }]}>
      <Text align="center" variant="title">
        {body}
      </Text>
      <Button label={action} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  stage: { flex: 1, minHeight: 160 },
  page: { alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    right: theme.space.sm,
    bottom: theme.space.sm,
    backgroundColor: theme.colors.surfaceRaised,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 2,
  },
  tag: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.xs,
    minHeight: theme.touch.min,
    marginTop: -(theme.touch.min / 2),
    marginLeft: -theme.space.sm,
    paddingHorizontal: theme.space.sm,
  },
  dot: { width: 10, height: 10, backgroundColor: theme.colors.accent },
  tagLabel: {
    backgroundColor: theme.colors.surfaceRaised,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 2,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.xs },
  cell: { width: '49%', height: '49%' },
  notice: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space.xl,
    padding: theme.space.xl,
    backgroundColor: theme.colors.surfaceSunken,
  },
}));
