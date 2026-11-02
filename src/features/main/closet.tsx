import { Mail, Plus } from 'lucide-react-native';
import { useMemo } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { categories, type ClothingItem, sourceLabels } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Chip } from '@/ui/chip';
import { GarmentField } from '@/ui/garment/garment-field';
import { Icon } from '@/ui/icon';
import { IconButton } from '@/ui/icon-button';
import { RailIllustration } from '@/ui/line-art';
import { ScreenScroll } from '@/ui/screen';
import { Text } from '@/ui/text';
import { TopBar } from '@/ui/top-bar';
import { Wordmark } from '@/ui/wordmark';

export function ClosetScreen({
  items,
  filter,
  setFilter,
  onAdd,
  onImport,
}: {
  items: ClothingItem[];
  filter: (typeof categories)[number];
  setFilter: (value: (typeof categories)[number]) => void;
  onAdd: () => void;
  onImport: () => void;
}) {
  const filteredItems = useMemo(
    () => (filter === '전체' ? items : items.filter((item) => item.category === filter)),
    [filter, items],
  );

  return (
    <>
      <TopBar
        leading={<Wordmark />}
        width="wide"
        trailing={<IconButton icon={Plus} label="옷 직접 등록" onPress={onAdd} variant="filled" />}
      />
      <ScreenScroll width="wide">
        <View style={styles.summary}>
          <Text tone="secondary" variant="label">
            보관 중인 옷
          </Text>
          <View style={styles.countRow}>
            <Text accessibilityLabel={`옷 ${items.length}벌`} variant="numeral">
              {items.length}
            </Text>
            <Text variant="heading">벌</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.chips}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onPress={() => setFilter(category)}
              selected={filter === category}
            />
          ))}
        </ScrollView>

        {items.length === 0 ? (
          <View style={styles.section}>
            <Card>
              <View style={styles.empty}>
                <RailIllustration height={140} />
                <Text align="center" variant="heading">
                  아직 옷장이 비어 있어요
                </Text>
                <Text align="center" tone="secondary" variant="body">
                  Gmail 주문메일이나 주문 캡처에서 옷을 가져와보세요.
                </Text>
                <View style={styles.emptyActions}>
                  <Button label="옷 가져오기" onPress={onImport} />
                  <Button label="직접 등록하기" onPress={onAdd} variant="ghost" />
                </View>
              </View>
            </Card>
          </View>
        ) : (
          <>
            <View style={styles.sync}>
              <Icon icon={Mail} size={18} tone="secondary" />
              <Text style={styles.syncText} tone="secondary" variant="caption">
                Gmail 주문메일 연결됨 · 새 주문을 자동으로 확인하는 데모 상태예요
              </Text>
              <View accessibilityLabel="연결됨" style={styles.live} />
            </View>

            <View style={styles.grid}>
              {filteredItems.map((item) => (
                <View key={item.id} style={styles.cell}>
                  <Pressable
                    accessibilityHint="상세 정보 보기"
                    accessibilityLabel={`${item.name}, ${item.category}, ${item.color}`}
                    accessibilityRole="button"
                    onPress={() =>
                      Alert.alert(item.name, `${item.detail}\n${sourceLabels[item.source]}로 등록됨`)
                    }
                    style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}>
                    <GarmentField glyphSize={40} item={item} />
                    <View style={styles.tileText}>
                      <Text numberOfLines={2} variant="label">
                        {item.name}
                      </Text>
                      <Text numberOfLines={1} tone="secondary" variant="caption">
                        {item.category} · {item.color}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              ))}
            </View>

            {filteredItems.length === 0 ? (
              <Text align="center" style={styles.noResult} tone="secondary" variant="body">
                이 카테고리에는 아직 옷이 없어요.
              </Text>
            ) : null}
          </>
        )}
      </ScreenScroll>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  summary: { gap: theme.space.xs, paddingTop: theme.space.md },
  countRow: { flexDirection: 'row', alignItems: 'baseline', gap: theme.space.xs },
  chipScroll: { marginTop: theme.space.xl, marginHorizontal: -theme.space.xl, flexGrow: 0 },
  chips: { gap: theme.space.sm, paddingHorizontal: theme.space.xl },
  section: { marginTop: theme.space.xxl },
  empty: { alignItems: 'center', gap: theme.space.md },
  emptyActions: { alignSelf: 'stretch', gap: theme.space.xs, marginTop: theme.space.sm },
  sync: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
    marginTop: theme.space.xl,
  },
  syncText: { flex: 1 },
  live: { width: 8, height: 8, backgroundColor: theme.colors.accent },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.space.lg,
    marginHorizontal: -theme.space.sm,
    rowGap: theme.space.xl,
  },
  cell: {
    paddingHorizontal: theme.space.sm,
    width: { xs: '50%', sm: '33.333%', md: '25%' },
  },
  tile: { gap: theme.space.sm },
  tilePressed: { opacity: 0.8 },
  tileText: { gap: 2 },
  noResult: { marginTop: theme.space.xxl },
}));
