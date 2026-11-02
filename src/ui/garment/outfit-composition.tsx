import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { needsLabelPlate, onColor } from '@/design/color';
import type { ClothingItem } from '@/data/wardrobe';

import { Text } from '../text';
import { CategoryGlyph } from './category-glyph';

/**
 * Today's outfit drawn as a Mondrian composition: each garment is a color field,
 * separated by structural lines. Top is the dominant plane; bottom, outer and shoes
 * are the counterweights (De Stijl principle 4: asymmetric balance).
 */
export function OutfitComposition({
  top,
  bottom,
  outer,
  shoes,
}: {
  top: ClothingItem;
  bottom: ClothingItem;
  outer?: ClothingItem;
  shoes?: ClothingItem;
}) {
  const accents = [outer, shoes].filter(Boolean) as ClothingItem[];
  return (
    <View
      accessible
      accessibilityLabel={`추천 코디: ${[top, bottom, ...accents].map((i) => i.name).join(', ')}`}
      style={styles.frame}>
      <View style={styles.major}>
        <Block item={top} />
      </View>
      <View style={styles.minor}>
        <View style={styles.bottomCell}>
          <Block item={bottom} />
        </View>
        {accents.length > 0 ? (
          <View style={styles.accentRow}>
            {accents.map((item) => (
              <View key={item.id} style={styles.accentCell}>
                <Block compact item={item} />
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

function Block({ item, compact = false }: { item: ClothingItem; compact?: boolean }) {
  const ink = onColor(item.colorHex);
  const plate = needsLabelPlate(item.colorHex);
  return (
    <View style={[styles.block, { backgroundColor: item.colorHex }]}>
      <CategoryGlyph category={item.category} color={ink} size={compact ? 24 : 36} />
      {!compact ? (
        <View style={[styles.label, plate && styles.labelPlate]}>
          <Text numberOfLines={1} style={plate ? undefined : { color: ink }} tone={plate ? 'onInverse' : 'primary'} variant="caption">
            {item.category}
          </Text>
          <Text numberOfLines={2} style={plate ? undefined : { color: ink }} tone={plate ? 'onInverse' : 'primary'} variant="label">
            {item.name}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  frame: {
    flexDirection: 'row',
    height: 300,
    gap: theme.stroke.structural,
    padding: theme.stroke.structural,
    backgroundColor: theme.colors.borderStructural,
  },
  major: { flex: 3 },
  minor: { flex: 2, gap: theme.stroke.structural },
  bottomCell: { flex: 3 },
  accentRow: { flex: 1, flexDirection: 'row', gap: theme.stroke.structural },
  accentCell: { flex: 1 },
  block: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.none,
  },
  label: {
    position: 'absolute',
    left: theme.space.md,
    right: theme.space.md,
    bottom: theme.space.md,
    gap: 2,
  },
  labelPlate: {
    backgroundColor: theme.colors.inverse,
    padding: theme.space.sm,
    borderRadius: theme.radius.sm,
  },
}));
