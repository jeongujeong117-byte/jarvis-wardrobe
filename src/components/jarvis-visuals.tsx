import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { jarvisColors as c } from '@/constants/jarvis-theme';
import { ClothingItem } from '@/data/wardrobe';

const paths = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
  closet: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 3v18M9 11v3m6-3v3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  back: '<path d="m14 5-7 7 7 7"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  refresh: '<path d="M20 8a8 8 0 1 0 0 8M20 3v5h-5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.4"/><path d="m3 17 5-5 4 4 4-6 5 7"/>',
  hanger: '<path d="M10 6a2 2 0 1 1 3 1.7L12 9v2l9 6a1.1 1.1 0 0 1-.6 2H3.6A1.1 1.1 0 0 1 3 17l9-6"/>',
  spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
  shield: '<path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
  calendar: '<rect x="4" y="5" width="16" height="16" rx="3"/><path d="M8 3v4m8-4v4M4 11h16m-11 4h2m3 0h2"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 22, color = c.ink }: { name: IconName; size?: number; color?: string }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
  return <Image accessible={false} source={{ uri: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` }} style={{ width: size, height: size }} />;
}

export function JarvisMark({ small = false }: { small?: boolean }) {
  return (
    <View style={s.brand}>
      <View style={[s.mark, small && s.smallMark]}><Icon name="spark" size={small ? 17 : 24} color={c.accent} /></View>
      {!small && <Text style={s.brandName}>jarvis<Text style={{ color: c.accent }}>.</Text></Text>}
    </View>
  );
}

// The atlas is synthetic, illustrative sample imagery. Never apply it to a
// user-created item just because its category or colour happens to match.
const sampleCell: Record<string, number> = {
  'gmail-1': 0, 'gmail-2': 1, 'gmail-3': 2, 'gmail-4': 3, 'gmail-5': 4, 'gmail-6': 5,
};

export function GarmentImage({ item }: { item: ClothingItem }) {
  const [width, setWidth] = useState(0);
  const cell = sampleCell[item.id];
  return (
    <View
      accessible accessibilityLabel={`${item.name}, ${cell === undefined ? '사진 미등록' : 'AI 생성 예시 이미지'}`}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)} style={s.garment}>
      {cell !== undefined && width > 0 ? (
        <Image source={require('../../assets/images/wardrobe-atlas.png')} contentFit="fill" accessible={false}
          style={{ position: 'absolute', width: width * 3, height: width * 2, left: -(cell % 3) * width, top: -Math.floor(cell / 3) * width }} />
      ) : (
        <View style={s.fallback}>
          <View style={[s.swatch, { backgroundColor: item.colorHex }]} />
          <Icon name="hanger" size={48} color={c.muted} />
          <Text style={s.noPhoto}>사진 미등록</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  mark: { width: 40, height: 40, borderRadius: 14, backgroundColor: c.lavender, alignItems: 'center', justifyContent: 'center' },
  smallMark: { width: 30, height: 30, borderRadius: 11 },
  brandName: { fontSize: 29, letterSpacing: -1.5, fontWeight: '600', color: c.ink },
  garment: { width: '100%', aspectRatio: 1, backgroundColor: '#F6F5F2', overflow: 'hidden' },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  swatch: { width: 10, height: 10, borderRadius: 5, position: 'absolute', top: 16, right: 16 },
  noPhoto: { color: c.muted, fontSize: 12 },
});
