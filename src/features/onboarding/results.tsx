import { Check, ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { ClothingItem } from '@/data/wardrobe';
import { Button } from '@/ui/button';
import { GarmentField } from '@/ui/garment/garment-field';
import { Icon } from '@/ui/icon';
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
        <View style={styles.summary}>
          <Text tone="secondary" variant="label">
            최근 1년 주문에서 찾은 옷
          </Text>
          <View style={styles.countRow}>
            <Text variant="numeral">{items.length}</Text>
            <Text style={styles.unit} variant="heading">
              벌
            </Text>
          </View>
          <Text tone="secondary" variant="body">
            취소된 주문 1건은 제외했어요. 가져오지 않을 옷은 선택을 해제하세요.
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
                  <GarmentField glyphSize={24} item={item} />
                </View>
                <View style={styles.rowText}>
                  <Text numberOfLines={1} variant="title">
                    {item.name}
                  </Text>
                  <Text tone="secondary" variant="caption">
                    {item.category} · {item.detail}
                  </Text>
                </View>
                <View style={[styles.box, selected && styles.boxOn]}>
                  {selected ? <Icon icon={Check} size={16} tone="onInverse" /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScreenScroll>
      <View style={styles.footer}>
        <Button
          disabled={selectedIds.size === 0}
          label={`${selectedIds.size}벌 옷장에 담기`}
          onPress={onImport}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  summary: { gap: theme.space.sm, paddingTop: theme.space.lg },
  countRow: { flexDirection: 'row', alignItems: 'baseline', gap: theme.space.xs },
  unit: { marginLeft: theme.space.xs },
  list: { marginTop: theme.space.xxl, gap: theme.space.xs },
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.lg,
    paddingVertical: theme.space.sm,
    paddingHorizontal: theme.space.sm,
    borderRadius: theme.radius.card,
  },
  rowPressed: { backgroundColor: theme.colors.surfaceRaised },
  thumb: { width: 56 },
  rowText: { flex: 1, gap: 2 },
  box: {
    width: 26,
    height: 26,
    borderRadius: theme.radius.pill,
    borderWidth: theme.stroke.emphasis,
    borderColor: theme.colors.borderInteractive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: theme.colors.inverse, borderColor: theme.colors.inverse },
  footer: {
    width: '100%',
    maxWidth: theme.layout.readable,
    alignSelf: 'center',
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.md,
    paddingBottom: theme.space.lg,
  },
}));
