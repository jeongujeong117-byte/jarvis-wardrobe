/**
 * Verifies src/design/color.ts on every garment color in the app's data, plus a sweep of
 * 1,728 arbitrary RGB colors (what users could register). Run: npx tsx tools/design/oncolor-check.ts
 */
import { contrastRatio, needsLabelPlate, onColor } from '../../src/design/color';

const appColors = ['#EDECE8', '#34425C', '#7188A8', '#BCA98B', '#8F9390', '#E8E5DE', '#7B8061',
  '#343634', '#ECEAE4', '#3D4961', '#B6B0A4', '#EEE8F2'];

let min = Infinity;
for (const hex of appColors) {
  const r = contrastRatio(onColor(hex), hex);
  min = Math.min(min, r);
  console.log(`${hex}  label=${onColor(hex)}  ${r.toFixed(2)}:1${needsLabelPlate(hex) ? '  → plate' : ''}`);
}
console.log(`app colors: min ${min.toFixed(2)}:1 ${min >= 4.5 ? 'PASS' : 'FAIL'}`);

let plates = 0;
let unreadable = 0;
let total = 0;
const steps = Array.from({ length: 12 }, (_, i) => Math.round((i * 255) / 11));
for (const r of steps) for (const g of steps) for (const b of steps) {
  total++;
  const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  const ratio = contrastRatio(onColor(hex), hex);
  if (needsLabelPlate(hex)) plates++;
  else if (ratio < 4.5) unreadable++;
}
console.log(`sweep: ${total} colors, ${plates} routed to a label plate, ${unreadable} unreadable without plate`);
process.exit(min >= 4.5 && unreadable === 0 ? 0 : 1);
