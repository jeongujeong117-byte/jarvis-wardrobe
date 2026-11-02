import { ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { ClothingItem } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { GarmentPlate } from '@/ui/pen/garment-plate';
import { PenDrawing } from '@/ui/pen/pen-drawing';
import { Screen, ScreenScroll } from '@/ui/screen';
import { Text } from '@/ui/text';
import { BackBar } from '@/ui/top-bar';

export function ResultsScreen({
  items,
  selectedIds,
  onToggle,
  onBack,
  onImport,
}: {
  items: ClothingItem[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onBack: () => void;
  onImport: () => void;
}) {
  return (
    <Screen>
      <BackBar backIcon={ChevronLeft} onBack={onBack} title="가져오기 결과" />
      <ScreenScroll>
        <View style={styles.intro}>
          <Text accessibilityRole="header" variant="display">
            옷 {items.length}벌을{'\n'}찾았어요.
          </Text>
          <Text tone="secondary" variant="body">
            취소된 주문 1건은 뺐어요. 가져오지 않을 옷은 선택을 풀어주세요.
          </Text>
        </View>

        <View style={styles.list}>
          {items.map((item) => {
            const selected = selectedIds.has(item.id);
            return (
              <Pressable
                accessibilityLabel={`${item.name}, ${item.detail}`}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                key={item.id}
                onPress={() => onToggle(item.id)}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
                <View style={styles.thumb}>
                  <GarmentPlate id={`result-${item.id}`} item={item} />
                </View>
                <View style={styles.rowText}>
                  <Text numberOfLines={1} variant="title">
                    {item.name}
                  </Text>
                  <Text tone="secondary" variant="caption">
                    {item.detail}
                  </Text>
                </View>
                <View style={[styles.box, selected && styles.boxOn]}>
                  {selected ? <PenDrawing name="tick" size={22} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScreenScroll>
      <View style={styles.footer}>
        <Button
          block
          disabled={selectedIds.size === 0}
          label={`${selectedIds.size}벌 옷장에 담기`}
          onPress={onImport}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  intro: { gap: theme.space.md },
  list: { marginTop: theme.space.xxl, gap: theme.space.sm },
  row: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.lg,
    paddingVertical: theme.space.xs,
  },
  rowPressed: { backgroundColor: theme.colors.surfaceSunken },
  thumb: { width: 64 },
  rowText: { flex: 1, gap: 2 },
  box: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: theme.stroke.base,
    borderColor: theme.colors.borderInteractive,
  },
  boxOn: { borderColor: theme.colors.textPrimary },
  footer: {
    width: '100%',
    maxWidth: theme.layout.readable,
    alignSelf: 'center',
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.md,
    paddingBottom: theme.space.lg,
  },
}));
