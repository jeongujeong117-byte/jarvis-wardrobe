import type { ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { needsOutline, onColor } from '@/design/color';
import type { ClothingItem } from '@/data/wardrobe';

import { CategoryGlyph } from './category-glyph';

/**
 * A garment rendered as what it is in this app: a square block of its own color.
 * radius 0 by rule — the Mondrian element of the design.
 * The glyph color is computed per garment (onColor), never fixed.
 */
export function GarmentField({
  item,
  glyphSize = 28,
  children,
  aspect = 1,
}: {
  item: Pick<ClothingItem, 'colorHex' | 'category'>;
  glyphSize?: number;
  /** Optional overlay content (labels) — callers must color it with onColor(item.colorHex). */
  children?: ReactNode;
  aspect?: number;
}) {
  const { theme } = useUnistyles();
  const outlined = needsOutline(item.colorHex, theme.colors.surfaceBase);
  styles.useVariants({ outlined });
  return (
    <View style={[styles.field, { backgroundColor: item.colorHex, aspectRatio: aspect }]}>
      <CategoryGlyph category={item.category} color={onColor(item.colorHex)} size={glyphSize} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  field: {
    width: '100%',
    borderRadius: theme.radius.none,
    alignItems: 'center',
    justifyContent: 'center',
    variants: {
      outlined: {
        true: { borderWidth: theme.stroke.base, borderColor: theme.colors.borderInteractive },
        false: {},
      },
    },
  },
}));
