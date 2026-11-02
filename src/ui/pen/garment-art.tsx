import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { onColor } from '@/design/color';
import { penDrawings, type PenDrawingName } from '@/design/pen-drawings';
import type { Category } from '@/data/wardrobe';

export const drawingFor: Record<Category, PenDrawingName> = {
  상의: 'top',
  하의: 'bottom',
  아우터: 'outer',
  신발: 'shoes',
};

export type PlaneBox = { x: number; y: number; w: number; h: number };

/**
 * The signature element (docs/ui/06 §6): a flat color plane with the garment's
 * fountain-pen contour laid slightly off-register over it, like a misaligned print.
 *
 * Where the line crosses the plane it switches to whichever of ink/paper reads on
 * that color — on a navy tee an ink line would be 1.41:1. Must be placed inside an <Svg>.
 */
export function GarmentArt({
  id,
  category,
  colorHex,
  plane,
  drawing,
  ink,
}: {
  /** Unique within the parent Svg (clip-path id). */
  id: string;
  category: Category;
  colorHex: string;
  plane: PlaneBox;
  /** Top-left and size of the 100×100 pen board, in the parent's units. */
  drawing: { x: number; y: number; size: number };
  ink: string;
}) {
  const paths = penDrawings[drawingFor[category]];
  const scale = drawing.size / 100;
  const transform = `translate(${drawing.x} ${drawing.y}) scale(${scale})`;
  const clipId = `plane-${id}`;
  return (
    <G>
      <Defs>
        <ClipPath id={clipId}>
          <Rect height={plane.h} width={plane.w} x={plane.x} y={plane.y} />
        </ClipPath>
      </Defs>
      <Rect fill={colorHex} height={plane.h} width={plane.w} x={plane.x} y={plane.y} />
      <G transform={transform}>
        {paths.map((d, i) => (
          <Path d={d} fill={ink} key={i} />
        ))}
      </G>
      <G clipPath={`url(#${clipId})`}>
        <G transform={transform}>
          {paths.map((d, i) => (
            <Path d={d} fill={onColor(colorHex)} key={i} />
          ))}
        </G>
      </G>
    </G>
  );
}
