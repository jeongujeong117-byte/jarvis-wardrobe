import { View } from 'react-native';
import Svg from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

import type { ClothingItem } from '@/data/wardrobe';

import { GarmentArt } from './garment-art';

/** A single garment as a tile: plane offset down-right, contour up-left. Scales with its container. */
export function GarmentPlate({
  item,
  id,
}: {
  item: Pick<ClothingItem, 'colorHex' | 'category'>;
  id: string;
}) {
  const { theme } = useUnistyles();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: '100%', aspectRatio: 100 / 96 }}>
      <Svg height="100%" viewBox="0 0 100 96" width="100%">
        <GarmentArt
          category={item.category}
          colorHex={item.colorHex}
          drawing={{ x: 0, y: 0, size: 80 }}
          id={id}
          ink={theme.colors.textPrimary}
          plane={{ x: 14, y: 16, w: 86, h: 80 }}
        />
      </Svg>
    </View>
  );
}
