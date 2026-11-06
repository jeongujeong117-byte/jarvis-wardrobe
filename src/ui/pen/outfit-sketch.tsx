import { View } from 'react-native';
import Svg from 'react-native-svg';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type { ClothingItem } from '@/data/wardrobe';

import { Text } from '../text';
import { GarmentArt, type PlaneBox } from './garment-art';

type Slot = { plane: PlaneBox; drawing: { x: number; y: number; size: number } };

/**
 * Today's outfit as one fashion-sketch page: the top is the dominant plane, the bottom
 * overlaps it from below-right, outerwear and shoes are small counterweights.
 * Signed below with the day in the pen script, the way an illustrator signs a drawing
 * (below, not over a plane: light ink on a beige plane would drop to ~1.9:1 at night).
 * Board: 340 × 330.
 */
const slots: Record<'top' | 'bottom' | 'outer' | 'shoes', Slot> = {
  top: { plane: { x: 34, y: 40, w: 166, h: 190 }, drawing: { x: 0, y: 0, size: 190 } },
  bottom: { plane: { x: 204, y: 150, w: 122, h: 170 }, drawing: { x: 176, y: 120, size: 140 } },
  outer: { plane: { x: 262, y: 26, w: 74, h: 78 }, drawing: { x: 244, y: 8, size: 86 } },
  shoes: { plane: { x: 24, y: 268, w: 112, h: 44 }, drawing: { x: 6, y: 214, size: 124 } },
};

export function OutfitSketch({
  top,
  bottom,
  outer,
  shoes,
  signature,
}: {
  top: ClothingItem;
  bottom: ClothingItem;
  outer?: ClothingItem;
  shoes?: ClothingItem;
  signature: string;
}) {
  const { theme } = useUnistyles();
  const ink = theme.colors.textPrimary;
  const pieces = [
    ['top', top],
    ['bottom', bottom],
    ['outer', outer],
    ['shoes', shoes],
  ] as const;
  const names = [top, bottom, outer, shoes].filter(Boolean).map((i) => i!.name);

  return (
    <View accessibilityLabel={`오늘의 코디: ${names.join(', ')}`} accessible style={styles.frame}>
      <View style={styles.board}>
        <Svg height="100%" viewBox="0 0 340 330" width="100%">
          {pieces.map(([slot, item]) =>
            item ? (
              <GarmentArt
                category={item.category}
                colorHex={item.colorHex}
                drawing={slots[slot].drawing}
                id={`${slot}-${item.id}`}
                ink={ink}
                key={slot}
                plane={slots[slot].plane}
              />
            ) : null,
          )}
        </Svg>
      </View>
      <Text align="right" style={styles.signature} variant="script">
        {signature}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  frame: { width: '100%' },
  board: { width: '100%', aspectRatio: 340 / 330 },
  signature: { marginTop: -theme.space.sm, marginRight: theme.space.xs },
}));
