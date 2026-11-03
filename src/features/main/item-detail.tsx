import { ChevronLeft } from 'lucide-react-native';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { type ClothingItem, sourceLabels } from '@/data/wardrobe';
import { ItemPhoto } from '@/ui/item-photo';
import { ScreenScroll } from '@/ui/screen';
import { Text } from '@/ui/text';
import { BackBar } from '@/ui/top-bar';

/** One garment, full width: photo on its own color, name in one line, facts as plain rows. */
export function ItemDetailScreen({ item, onBack }: { item: ClothingItem; onBack: () => void }) {
  const rows: [string, string][] = [
    ['종류', item.category],
    ['색', item.color],
    ['사이즈', item.detail],
    ['등록', sourceLabels[item.source]],
  ];
  return (
    <>
      <BackBar backIcon={ChevronLeft} onBack={onBack} title="옷 상세" />
      <ScreenScroll>
        <ItemPhoto item={item} ratio={1.1} />
        <Text accessibilityRole="header" numberOfLines={2} style={styles.name} variant="heading">
          {item.name}
        </Text>
        <View style={styles.rows}>
          {rows.map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text tone="secondary" variant="label">
                {label}
              </Text>
              <Text variant="body">{value}</Text>
            </View>
          ))}
        </View>
      </ScreenScroll>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  name: { marginTop: theme.space.xl },
  rows: { marginTop: theme.space.xl, gap: theme.space.xs },
  row: {
    minHeight: theme.touch.min,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space.lg,
    backgroundColor: theme.colors.surfaceSunken,
  },
}));
