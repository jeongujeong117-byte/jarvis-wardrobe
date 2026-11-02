import { Plus } from 'lucide-react-native';
import { useMemo } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { categories, type ClothingItem, sourceLabels } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { IconButton } from '@/ui/icon-button';
import { GarmentPlate } from '@/ui/pen/garment-plate';
import { PenChoice, PenChoiceRow } from '@/ui/pen/pen-choice';
import { PenDrawing } from '@/ui/pen/pen-drawing';
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
        trailing={<IconButton icon={Plus} label="옷 직접 등록" onPress={onAdd} />}
        width="wide"
      />
      <ScreenScroll width="wide">
        <Text accessibilityRole="header" variant="display">
          {items.length > 0 ? `옷장에 ${items.length}벌.` : '옷장이 비어 있어요.'}
        </Text>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <PenDrawing name="hanger" size={160} />
            <Text tone="secondary" variant="body">
              Gmail 주문메일이나 주문 캡처에서 옷을 가져와보세요.
            </Text>
            <View style={styles.actions}>
              <Button label="옷 가져오기" onPress={onImport} />
              <Button label="직접 적기" onPress={onAdd} variant="text" />
            </View>
          </View>
        ) : (
          <>
            <View accessibilityLabel="종류" style={styles.choices}>
              <PenChoiceRow>
                {categories.map((category) => (
                  <PenChoice
                    key={category}
                    label={category}
                    onPress={() => setFilter(category)}
                    selected={filter === category}
                  />
                ))}
              </PenChoiceRow>
            </View>

            <View style={styles.grid}>
              {filteredItems.map((item) => (
                <View key={item.id} style={styles.cell}>
                  <Pressable
                    accessibilityHint="자세히 보기"
                    accessibilityLabel={`${item.name}, ${item.color} ${item.category}`}
                    accessibilityRole="button"
                    onPress={() =>
                      Alert.alert(item.name, `${item.detail}\n${sourceLabels[item.source]}로 등록됨`)
                    }
                    style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}>
                    <GarmentPlate id={`closet-${item.id}`} item={item} />
                    <View style={styles.tileText}>
                      <Text numberOfLines={2} variant="label">
                        {item.name}
                      </Text>
                      <Text numberOfLines={1} tone="secondary" variant="caption">
                        {item.color} {item.category}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              ))}
            </View>

            {filteredItems.length === 0 ? (
              <Text style={styles.noResult} tone="secondary" variant="body">
                이 종류의 옷은 아직 없어요.
              </Text>
            ) : null}

            <Text style={styles.sync} tone="tertiary" variant="caption">
              Gmail 주문메일을 데모로 연결해 두었어요. 새 주문이 오면 여기에 더해져요.
            </Text>
          </>
        )}
      </ScreenScroll>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  empty: { marginTop: theme.space.xxl, gap: theme.space.md },
  actions: { flexDirection: 'row', alignItems: 'center', gap: theme.space.md, marginTop: theme.space.lg },
  choices: { marginTop: theme.space.lg },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.space.xl,
    marginHorizontal: -theme.space.md,
    rowGap: theme.space.xxl,
  },
  cell: {
    paddingHorizontal: theme.space.md,
    width: { xs: '50%', sm: '33.333%', md: '25%' },
  },
  tile: { gap: theme.space.md },
  tilePressed: { opacity: 0.7 },
  tileText: { gap: 2 },
  noResult: { marginTop: theme.space.xl },
  sync: { marginTop: theme.space.section },
}));
