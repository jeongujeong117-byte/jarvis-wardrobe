/**
 * Color math for garment color fields.
 *
 * The app has no photos — a garment IS its colorHex. Any label printed on that
 * color must stay readable for every possible garment, including ones users type in.
 * Audit blocker #2: fixed label colors vanish on white (1.18:1) or navy (1.87:1).
 */

const INK = '#111111';
const PAPER = '#FFFFFF';

function channel(value: number) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance. Accepts #RGB or #RRGGBB; anything else is treated as mid-grey. */
export function luminance(hex: string) {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((ch) => ch + ch).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return 0.2;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Ink or paper, whichever reads better on `background`. */
export function onColor(background: string) {
  return contrastRatio(INK, background) >= contrastRatio(PAPER, background) ? INK : PAPER;
}

/**
 * True when neither ink nor paper reaches 4.5:1 on this color
 * (saturated mid-tones). Callers must then move the label off the color field.
 */
export function needsLabelPlate(background: string) {
  return contrastRatio(onColor(background), background) < 4.5;
}

/** True for near-white garments that would disappear on a light surface — give them an outline. */
export function needsOutline(background: string, surface: string) {
  return contrastRatio(background, surface) < 1.25;
}
