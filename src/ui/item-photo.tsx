import { Image } from 'expo-image';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { itemPhotos } from '@/data/photos';
import type { ClothingItem } from '@/data/wardrobe';

/** expo-image is a third-party view: Unistyles styles must not be passed to it, so this stays a plain object. */
const fill = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const;

/**
 * A garment photo on its own color. Items without a photo (manual / captured) show a flat
 * color plane in the garment's color — never an emoji or a drawing.
 */
export function ItemPhoto({
  item,
  ratio = 1,
}: {
  item: Pick<ClothingItem, 'id' | 'colorHex'>;
  /** height / width */
  ratio?: number;
}) {
  const source = itemPhotos[item.id];
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.box, { backgroundColor: item.colorHex, aspectRatio: 1 / ratio }]}>
      {source ? <Image contentFit="cover" source={source} style={fill} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: '100%' },
});
