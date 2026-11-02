import Svg, { Path } from 'react-native-svg';

import type { Category } from '@/data/wardrobe';

/**
 * Monoline category drawings on a 24 grid, stroke 2 — same weight as the lucide set.
 * Replace the 👕👖🧥👟 emoji (native-slop #3).
 */
const paths: Record<Category, string[]> = {
  상의: [
    'M8.5 3.5 L3.5 6.5 L5 11 L7 10.2 V20.5 H17 V10.2 L19 11 L20.5 6.5 L15.5 3.5',
    'M8.5 3.5 C9.2 5.2 10.4 6 12 6 C13.6 6 14.8 5.2 15.5 3.5',
  ],
  하의: ['M6.5 3.5 H17.5 L19 20.5 H13.6 L12 10.5 L10.4 20.5 H5 Z', 'M6.5 6.5 H17.5'],
  아우터: [
    'M9 3.5 L4.5 5.5 L3.5 13 V18.5 H6.5 V12',
    'M15 3.5 L19.5 5.5 L20.5 13 V18.5 H17.5 V12',
    'M6.5 8.5 V20.5 H17.5 V8.5',
    'M9 3.5 L12 9.5 L15 3.5',
    'M12 9.5 V20.5',
  ],
  신발: ['M2.5 17.5 V11.5 L7 10.5 L9.5 6.5 L13 7.5 L14 11 L21.5 13 V17.5 Z', 'M2.5 15 H21.5'],
};

export function CategoryGlyph({
  category,
  color,
  size = 28,
}: {
  category: Category;
  color: string;
  size?: number;
}) {
  return (
    <Svg
      accessibilityElementsHidden
      fill="none"
      height={size}
      importantForAccessibility="no-hide-descendants"
      viewBox="0 0 24 24"
      width={size}>
      {paths[category].map((d) => (
        <Path
          d={d}
          key={d}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
        />
      ))}
    </Svg>
  );
}
