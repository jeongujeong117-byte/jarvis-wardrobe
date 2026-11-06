import Svg, { G, Path } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

import { penDrawings, type PenDrawingName } from '@/design/pen-drawings';

/**
 * A fountain-pen drawing (see tools/design/pen.py). Filled outlines, so the line
 * keeps its thick–thin modulation at any size. Decorative: hidden from screen readers.
 */
export function PenDrawing({
  name,
  size,
  width,
  height,
  color,
  stretch = false,
  viewBox = '0 0 100 100',
}: {
  name: PenDrawingName;
  size?: number;
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  color?: string;
  /** Fill the box non-uniformly (circles around words of any length, underlines). */
  stretch?: boolean;
  /** Crop of the 100×100 board, e.g. "0 0 100 12" for the swash, which lives in a thin band. */
  viewBox?: string;
}) {
  const { theme } = useUnistyles();
  const ink = color ?? theme.colors.textPrimary;
  return (
    <Svg
      accessibilityElementsHidden
      height={height ?? size}
      importantForAccessibility="no-hide-descendants"
      preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
      viewBox={viewBox}
      width={width ?? size}>
      <G>
        {penDrawings[name].map((d, i) => (
          <Path d={d} fill={ink} key={i} />
        ))}
      </G>
    </Svg>
  );
}
